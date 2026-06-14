import type { CaseRecord } from '../../../shared/types/ui';

type DiscountRule = {
  id: 'descuento_83' | 'descuento_67';
  percentage: number;
  payablePercentage: number;
};

type DiscountTimelineItem = {
  title: string;
  date: string;
  description: string;
  state: 'safe' | 'attention' | 'risk' | 'pending';
};

export type DiscountAnalysis = {
  baseAmount: number | null;
  businessDaysElapsed: number | null;
  code: string;
  discountAmount: number | null;
  issueDateLabel: string;
  payableAmount: number | null;
  queryDateLabel: string;
  reason: string;
  rule: DiscountRule | null;
  summary: string;
  timeline: DiscountTimelineItem[];
};

const excludedCodes = new Set([
  'M01',
  'M02',
  'M03',
  'M04',
  'M05',
  'M06',
  'M07',
  'M08',
  'M09',
  'M12',
  'M16',
  'M17',
  'M20',
  'M21',
  'M23',
  'M27',
  'M28',
  'M29',
  'M31',
  'M32',
  'M42',
]);

const initialDiscount: DiscountRule = {
  id: 'descuento_83',
  percentage: 83,
  payablePercentage: 17,
};

const secondWindowDiscount: DiscountRule = {
  id: 'descuento_67',
  percentage: 67,
  payablePercentage: 33,
};

export function analyzeCaseDiscount(item: CaseRecord, queryDate = new Date()): DiscountAnalysis {
  const code = normalizeCode(item.ticketCode ?? item.id);
  const issueDate = parseCaseDate(item.issueDate);
  const resolvedQueryDate = parseCaseDate(item.queryDate) ?? queryDate;
  const baseAmount = parseSolesAmount(item.amount);
  const issueDateLabel = issueDate ? formatDate(issueDate) : item.issueDate;
  const queryDateLabel = formatDate(resolvedQueryDate);

  if (!issueDate) {
    return createUnavailableAnalysis({
      baseAmount,
      code,
      issueDateLabel,
      queryDateLabel,
      reason: 'No se pudo leer la fecha de emision para calcular dias habiles.',
      summary: 'Fecha de emision por validar',
      timeline: [
        {
          title: 'Fecha pendiente',
          date: item.issueDate,
          description: 'Necesitamos una fecha de emision valida para calcular la cronologia.',
          state: 'pending',
        },
      ],
    });
  }

  const businessDaysElapsed = countBusinessDaysAfter(issueDate, resolvedQueryDate);
  const initialWindowEnd = addBusinessDays(issueDate, 5);
  const secondWindowStart = addBusinessDays(issueDate, 6);
  const timeline = buildDiscountTimeline({
    businessDaysElapsed,
    issueDate,
    initialWindowEnd,
    queryDate: resolvedQueryDate,
    secondWindowStart,
  });

  if (excludedCodes.has(code)) {
    return createUnavailableAnalysis({
      baseAmount,
      businessDaysElapsed,
      code,
      issueDateLabel,
      queryDateLabel,
      reason: `El codigo ${code} esta excluido de los descuentos SAT registrados en el RAG.`,
      summary: 'Codigo sin descuento aplicable',
      timeline,
    });
  }

  if (!item.canDiscount) {
    return createUnavailableAnalysis({
      baseAmount,
      businessDaysElapsed,
      code,
      issueDateLabel,
      queryDateLabel,
      reason: 'El estado actual del caso no reporta descuento disponible.',
      summary: 'Sin descuento vigente',
      timeline,
    });
  }

  const normalizedStage = `${item.status} ${item.stage}`.toLowerCase();
  const hasFinalSanction =
    normalizedStage.includes('sancion firme') ||
    normalizedStage.includes('coactivo') ||
    normalizedStage.includes('apelacion');

  if (businessDaysElapsed <= 5) {
    return createActiveAnalysis({
      baseAmount,
      businessDaysElapsed,
      code,
      issueDateLabel,
      queryDateLabel,
      reason: `Han pasado ${businessDaysElapsed} dias habiles desde el dia siguiente a la emision.`,
      rule: initialDiscount,
      summary: 'Descuento inicial vigente',
      timeline,
    });
  }

  if (!hasFinalSanction) {
    return createActiveAnalysis({
      baseAmount,
      businessDaysElapsed,
      code,
      issueDateLabel,
      queryDateLabel,
      reason: 'Ya paso el plazo inicial, pero aun puede aplicar el tramo previo a la resolucion de sancion.',
      rule: secondWindowDiscount,
      summary: 'Descuento de segunda ventana vigente',
      timeline,
    });
  }

  return createUnavailableAnalysis({
    baseAmount,
    businessDaysElapsed,
    code,
    issueDateLabel,
    queryDateLabel,
    reason: 'La etapa actual indica que ya no estas antes de la resolucion de sancion.',
    summary: 'Descuento vencido por etapa',
    timeline,
  });
}

export function formatSoles(amount: number | null) {
  if (amount === null) {
    return 'Monto por verificar';
  }

  return `S/ ${amount.toLocaleString('es-PE', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function createActiveAnalysis({
  baseAmount,
  businessDaysElapsed,
  code,
  issueDateLabel,
  queryDateLabel,
  reason,
  rule,
  summary,
  timeline,
}: {
  baseAmount: number | null;
  businessDaysElapsed: number;
  code: string;
  issueDateLabel: string;
  queryDateLabel: string;
  reason: string;
  rule: DiscountRule;
  summary: string;
  timeline: DiscountTimelineItem[];
}): DiscountAnalysis {
  const payableAmount = baseAmount === null ? null : roundMoney(baseAmount * (rule.payablePercentage / 100));
  const discountAmount = baseAmount === null || payableAmount === null ? null : roundMoney(baseAmount - payableAmount);

  return {
    baseAmount,
    businessDaysElapsed,
    code,
    discountAmount,
    issueDateLabel,
    payableAmount,
    queryDateLabel,
    reason,
    rule,
    summary,
    timeline,
  };
}

function createUnavailableAnalysis({
  baseAmount,
  businessDaysElapsed = null,
  code,
  issueDateLabel,
  queryDateLabel,
  reason,
  summary,
  timeline,
}: {
  baseAmount: number | null;
  businessDaysElapsed?: number | null;
  code: string;
  issueDateLabel: string;
  queryDateLabel: string;
  reason: string;
  summary: string;
  timeline: DiscountTimelineItem[];
}): DiscountAnalysis {
  return {
    baseAmount,
    businessDaysElapsed,
    code,
    discountAmount: null,
    issueDateLabel,
    payableAmount: baseAmount,
    queryDateLabel,
    reason,
    rule: null,
    summary,
    timeline,
  };
}

function buildDiscountTimeline({
  businessDaysElapsed,
  issueDate,
  initialWindowEnd,
  queryDate,
  secondWindowStart,
}: {
  businessDaysElapsed: number;
  issueDate: Date;
  initialWindowEnd: Date;
  queryDate: Date;
  secondWindowStart: Date;
}): DiscountTimelineItem[] {
  return [
    {
      title: 'Emision o notificacion',
      date: formatDate(issueDate),
      description: 'Desde el dia habil siguiente se cuenta el beneficio.',
      state: 'safe',
    },
    {
      title: '83% de descuento',
      date: `Hasta ${formatDate(initialWindowEnd)}`,
      description: 'Aplica dentro de los primeros 5 dias habiles si el codigo no esta excluido.',
      state: businessDaysElapsed <= 5 ? 'safe' : 'pending',
    },
    {
      title: '67% de descuento',
      date: `Desde ${formatDate(secondWindowStart)}`,
      description: 'Corre desde el sexto dia habil hasta antes de la resolucion de sancion.',
      state: businessDaysElapsed > 5 ? 'attention' : 'pending',
    },
    {
      title: 'Fecha de consulta',
      date: formatDate(queryDate),
      description: `Consulta calculada con ${businessDaysElapsed} dias habiles transcurridos.`,
      state: 'attention',
    },
  ];
}

function parseCaseDate(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const slashMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return createLocalDate(Number(year), Number(month), Number(day));
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return createLocalDate(Number(year), Number(month), Number(day));
  }

  return null;
}

function parseSolesAmount(value: string) {
  const normalized = value.replace(/[^0-9.,]/g, '').replace(/,/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function createLocalDate(year: number, month: number, day: number) {
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(date: Date, days: number) {
  let current = new Date(date);
  let added = 0;

  while (added < days) {
    current = addDays(current, 1);
    if (isBusinessDay(current)) {
      added += 1;
    }
  }

  return current;
}

function countBusinessDaysAfter(startDate: Date, endDate: Date) {
  if (endDate <= startDate) {
    return 0;
  }

  let count = 0;
  let current = addDays(startDate, 1);

  while (current <= endDate) {
    if (isBusinessDay(current)) {
      count += 1;
    }
    current = addDays(current, 1);
  }

  return count;
}

function isBusinessDay(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

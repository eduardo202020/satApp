export type ProcedureStep = {
  title: string;
  status: string;
};

export function useProcedures(): ProcedureStep[] {
  return [
    { title: 'Solicitud recibida', status: 'Completado' },
    { title: 'Documentos revisados', status: 'Completado' },
    { title: 'Aprobacion pendiente', status: 'Esperando confirmacion' },
  ];
}

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useProfile } from './hooks/useProfile';

export default function ProfileScreen() {
  const profile = useProfile();

  return (
    <ScreenShell
      eyebrow="Perfil"
      title="Cuenta y validacion"
      description="Gestiona identidad, preferencias y seguridad para acceder a tus casos."
      compact
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.initials}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{profile.role}</Text>
          <Text style={styles.phone}>{profile.phone}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <MaterialCommunityIcons name="shield-alert-outline" size={26} color={colors.amber} />
        <View style={styles.statusCopy}>
          <Text style={styles.statusTitle}>{profile.documentStatus}</Text>
          <Text style={styles.statusText}>Completa la validacion para proteger el acceso a tus casos.</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {profile.actions.map((action) => (
          <Pressable
            key={action.title}
            style={styles.action}
            onPress={() => navigateTo(action.href)}
          >
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name={action.icon} size={24} color={colors.blue} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionText}>{action.description}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    padding: 16,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarText: {
    color: colors.cream,
    fontSize: 19,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
  },
  name: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  role: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },
  phone: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.amberLight,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    padding: 14,
  },
  statusCopy: {
    flex: 1,
  },
  statusTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  statusText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
  action: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 84,
    padding: 14,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  actionText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { ActionRow } from '../../shared/components/ActionRow';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { useProfile } from './hooks/useProfile';

export default function ProfileScreen() {
  const profile = useProfile();

  return (
    <ScreenShell
      eyebrow="Cuenta"
      title="Perfil de trabajo"
      description="Informacion base del usuario y estado actual de la sesion."
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.initials}</Text>
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileRole}>{profile.role}</Text>
      </View>

      <View style={styles.infoList}>
        {profile.details.map((item) => (
          <ActionRow item={item} key={item.title} />
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
    marginTop: 16,
    padding: 24,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 36,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  avatarText: {
    color: colors.cream,
    fontSize: 24,
    fontWeight: '900',
  },
  profileName: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 14,
  },
  profileRole: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  infoList: {
    marginTop: 12,
  },
});

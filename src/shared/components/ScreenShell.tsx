import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/theme';

type ScreenShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  compact?: boolean;
};

export function ScreenShell({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
        style={styles.keyboardWrap}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.screen}
          contentContainerStyle={[
            styles.screenContent,
            compact && styles.compactContent,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View>
              <Text style={styles.eyebrow}>{eyebrow}</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
  keyboardWrap: {
    flex: 1,
  },
  screenContent: {
    padding: 20,
    paddingBottom: 104,
  },
  compactContent: {
    paddingBottom: 34,
  },
  hero: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  eyebrow: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 33,
    marginTop: 8,
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
});

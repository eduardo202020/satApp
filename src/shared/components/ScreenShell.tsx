import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
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
  const { contentMaxWidth, isDesktop, isWeb, screenPadding } = useResponsiveLayout();

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
            {
              paddingBottom: isWeb ? 32 : 24,
              paddingHorizontal: screenPadding,
              paddingTop: isDesktop ? 28 : 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentFrame, { maxWidth: contentMaxWidth }]}>
            <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
              <View>
                <Text style={styles.eyebrow}>{eyebrow}</Text>
                <Text style={[styles.title, isDesktop && styles.titleDesktop]}>{title}</Text>
              </View>
              <Text style={[styles.description, isDesktop && styles.descriptionDesktop]}>{description}</Text>
            </View>
            {children}
          </View>
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
    alignItems: 'center',
    flexGrow: 1,
  },
  compactContent: {
    paddingBottom: 24,
  },
  contentFrame: {
    alignSelf: 'center',
    width: '100%',
  },
  hero: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  heroDesktop: {
    padding: 28,
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
  titleDesktop: {
    fontSize: 36,
    lineHeight: 42,
    maxWidth: 760,
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
  descriptionDesktop: {
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 760,
  },
});

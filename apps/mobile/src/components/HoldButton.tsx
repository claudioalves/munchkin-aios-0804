import { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radius, fontSize } from '../theme';

interface HoldButtonProps {
  label: string;
  accessibilityLabel?: string;
  onTrigger: () => void;
  variant?: 'increment' | 'decrement';
  disabled?: boolean;
}

const HOLD_DELAY = 500;
const HOLD_INTERVAL = 200;

export function HoldButton({
  label,
  accessibilityLabel,
  onTrigger,
  variant = 'increment',
  disabled = false,
}: HoldButtonProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRepeating = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handlePressIn = useCallback(
    (_e: GestureResponderEvent) => {
      if (disabled) return;
      onTrigger();
      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          onTrigger();
        }, HOLD_INTERVAL);
      }, HOLD_DELAY);
    },
    [disabled, onTrigger]
  );

  const handlePressOut = useCallback(() => {
    stopRepeating();
  }, [stopRepeating]);

  const isIncrement = variant === 'increment';

  const btnStyle: ViewStyle[] = [
    styles.button,
    isIncrement ? styles.increment : styles.decrement,
    disabled ? styles.disabled : {},
  ];

  const textStyle: TextStyle[] = [
    styles.label,
    isIncrement ? styles.incrementText : styles.decrementText,
    disabled ? styles.disabledText : {},
  ];

  return (
    <TouchableOpacity
      style={btnStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {}} // handled by onPressIn
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  increment: {
    backgroundColor: colors.brandGreen,
    borderColor: colors.brandGreen,
  },
  decrement: {
    backgroundColor: 'transparent',
    borderColor: colors.brandBorder,
  },
  disabled: {
    opacity: 0.3,
  },
  label: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  incrementText: {
    color: '#fff',
  },
  decrementText: {
    color: colors.brandMuted,
  },
  disabledText: {
    color: colors.brandMuted,
  },
});

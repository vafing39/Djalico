import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';

type HapticTabProps = ComponentProps<typeof Pressable> & {
  onPressIn?: ((e: any) => void) | null;
  children?: React.ReactNode;
};

export function HapticTab({ onPressIn, ...props }: HapticTabProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    />
  );
}

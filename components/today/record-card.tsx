import { useThemeColor } from "@/hooks/use-theme-color";
import { Button, Card, Text, XStack, YStack } from "tamagui";
import type { ReactNode } from "react";

interface RecordCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
  children?: ReactNode;
}

/**
 * 通用记录卡片容器组件
 */
export function RecordCard({
  title,
  description,
  buttonText,
  onButtonPress,
  children,
}: RecordCardProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Card
      chromeless
      size="$4"
      bordered
      p="$4"
      borderColor="$borderColor"
      opacity={0.8}
      style={{ backgroundColor }}
    >
      <YStack gap="$3">
        <XStack
          style={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <YStack flex={1}>
            <Text
              fontSize={16}
              fontWeight="400"
              style={{ color: textColor }}
              mb="$2"
            >
              {title}
            </Text>
            <Text fontSize={14} style={{ color: textColor }} opacity={0.5}>
              {description}
            </Text>
          </YStack>

          <Button
            size="$2"
            chromeless
            onPress={onButtonPress}
            px="$2"
            py="$1"
          >
            <Text fontSize={14} style={{ color: textColor }} opacity={0.6}>
              {buttonText}
            </Text>
          </Button>
        </XStack>

        {children}
      </YStack>
    </Card>
  );
}

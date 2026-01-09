import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";
import type { DietRecord } from "./types";

interface WeightContentProps {
  value: string;
}

/**
 * 体重卡片内容展示
 */
export function WeightContent({ value }: WeightContentProps) {
  const textColor = useThemeColor({}, "text");

  if (!value) return null;

  return (
    <Text fontSize={16} style={{ color: textColor }} opacity={0.8}>
      {value} kg
    </Text>
  );
}

interface SleepContentProps {
  value: string;
}

/**
 * 睡眠卡片内容展示
 */
export function SleepContent({ value }: SleepContentProps) {
  const textColor = useThemeColor({}, "text");

  if (!value) return null;

  return (
    <YStack gap="$1">
      {value.split(" | ").map((time, index) => (
        <Text
          key={index}
          fontSize={16}
          style={{ color: textColor }}
          opacity={0.8}
        >
          {index === 0 ? `起床：${time}` : `就寝：${time}`}
        </Text>
      ))}
    </YStack>
  );
}

interface ExerciseContentProps {
  value: string;
}

/**
 * 运动卡片内容展示
 */
export function ExerciseContent({ value }: ExerciseContentProps) {
  const textColor = useThemeColor({}, "text");

  if (!value) return null;

  return (
    <YStack gap="$1">
      {value.split(" | ").map((info, index) => (
        <Text
          key={index}
          fontSize={16}
          style={{ color: textColor }}
          opacity={0.8}
        >
          {index === 0
            ? `类型：${info}`
            : index === 1
            ? `时长：${info}`
            : `强度：${info}`}
        </Text>
      ))}
    </YStack>
  );
}

interface DietContentProps {
  records: DietRecord[];
  onDelete: (id: string) => void;
}

/**
 * 饮食卡片内容展示
 */
export function DietContent({ records, onDelete }: DietContentProps) {
  const textColor = useThemeColor({}, "text");

  if (records.length === 0) return null;

  return (
    <YStack gap="$2">
      {records.map((record) => (
        <XStack
          key={record.id}
          gap="$2"
          borderWidth={1}
          borderColor="$borderColor"
          p="$2"
          style={{ alignItems: "center", borderRadius: 8 }}
        >
          <Image
            source={{ uri: record.photoUri }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 4,
            }}
            resizeMode="cover"
          />
          <YStack flex={1}>
            <Text fontSize={14} style={{ color: textColor }} opacity={0.8}>
              时间：{record.time}
            </Text>
          </YStack>
          <Button
            size="$2"
            chromeless
            onPress={() => onDelete(record.id)}
            px="$2"
            py="$1"
          >
            <Text fontSize={12} style={{ color: textColor }} opacity={0.5}>
              删除
            </Text>
          </Button>
        </XStack>
      ))}
    </YStack>
  );
}

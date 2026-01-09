import { useThemeColor } from "@/hooks/use-theme-color";
import { Button, Dialog, Input, Text, XStack, YStack } from "tamagui";

interface ExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseType: string;
  exerciseDuration: string;
  exerciseIntensity: string;
  onExerciseTypeChange: (type: string) => void;
  onExerciseDurationChange: (duration: string) => void;
  onExerciseIntensityChange: (intensity: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  topInset: number;
}

const EXERCISE_TYPES = ["跑步", "游泳", "骑行", "瑜伽", "力量训练", "其他"];
const EXERCISE_INTENSITIES = ["轻松", "适中", "困难"];

/**
 * 运动记录弹窗组件
 */
export function ExerciseDialog({
  open,
  onOpenChange,
  exerciseType,
  exerciseDuration,
  exerciseIntensity,
  onExerciseTypeChange,
  onExerciseDurationChange,
  onExerciseIntensityChange,
  onConfirm,
  onCancel,
  topInset,
}: ExerciseDialogProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const isConfirmDisabled =
    !exerciseType.trim() ||
    !exerciseDuration.trim() ||
    !exerciseIntensity.trim();

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay-exercise"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content-exercise"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: -20, opacity: 0, scale: 0.95 }}
          gap="$4"
          style={{
            backgroundColor,
            borderColor: "$borderColor",
            position: "absolute",
            top: topInset + 24,
            left: 16,
            right: 16,
            marginTop: 0,
          }}
        >
          <Dialog.Title fontSize={18} style={{ color: textColor }}>
            记录运动
          </Dialog.Title>

          <YStack gap="$3">
            <YStack gap="$2">
              <Text fontSize={14} style={{ color: textColor }} opacity={0.7}>
                运动类型
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {EXERCISE_TYPES.map((type) => (
                  <Button
                    key={type}
                    size="$3"
                    chromeless
                    onPress={() => onExerciseTypeChange(type)}
                    style={{
                      borderWidth: 1,
                      borderColor:
                        exerciseType === type ? textColor : "$borderColor",
                      backgroundColor:
                        exerciseType === type ? textColor : backgroundColor,
                      opacity: exerciseType === type ? 0.9 : 0.8,
                    }}
                  >
                    <Text
                      fontSize={14}
                      style={{
                        color:
                          exerciseType === type ? backgroundColor : textColor,
                      }}
                    >
                      {type}
                    </Text>
                  </Button>
                ))}
              </XStack>
            </YStack>

            <YStack gap="$2">
              <Text fontSize={14} style={{ color: textColor }} opacity={0.7}>
                时长（分钟）
              </Text>
              <Input
                size="$4"
                placeholder="请输入运动时长"
                value={exerciseDuration}
                onChangeText={onExerciseDurationChange}
                keyboardType="numeric"
                borderWidth={1}
                borderColor="$borderColor"
                style={{
                  backgroundColor,
                  color: textColor,
                }}
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize={14} style={{ color: textColor }} opacity={0.7}>
                运动强度
              </Text>
              <XStack gap="$2">
                {EXERCISE_INTENSITIES.map((intensity) => (
                  <Button
                    key={intensity}
                    size="$3"
                    chromeless
                    flex={1}
                    onPress={() => onExerciseIntensityChange(intensity)}
                    style={{
                      borderWidth: 1,
                      borderColor:
                        exerciseIntensity === intensity
                          ? textColor
                          : "$borderColor",
                      backgroundColor:
                        exerciseIntensity === intensity
                          ? textColor
                          : backgroundColor,
                      opacity: exerciseIntensity === intensity ? 0.9 : 0.8,
                    }}
                  >
                    <Text
                      fontSize={14}
                      style={{
                        color:
                          exerciseIntensity === intensity
                            ? backgroundColor
                            : textColor,
                      }}
                    >
                      {intensity}
                    </Text>
                  </Button>
                ))}
              </XStack>
            </YStack>

            <XStack gap="$3" style={{ justifyContent: "flex-end" }}>
              <Button
                size="$3"
                onPress={onCancel}
                chromeless
                style={{
                  borderWidth: 1,
                  borderColor: "$borderColor",
                }}
              >
                <Text style={{ color: textColor }} opacity={0.8}>
                  取消
                </Text>
              </Button>
              <Button
                size="$3"
                onPress={onConfirm}
                disabled={isConfirmDisabled}
                style={{
                  backgroundColor: textColor,
                  opacity: isConfirmDisabled ? 0.5 : 0.9,
                }}
              >
                <Text
                  style={{
                    color: backgroundColor,
                  }}
                >
                  确认
                </Text>
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

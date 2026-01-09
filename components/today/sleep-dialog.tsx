import { useThemeColor } from "@/hooks/use-theme-color";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { Button, Dialog, Input, Text, XStack, YStack } from "tamagui";
import { formatTime } from "./utils";

interface SleepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wakeUpTime: Date;
  sleepTime: Date;
  onWakeUpTimeChange: (event: any, selectedDate?: Date) => void;
  onSleepTimeChange: (event: any, selectedDate?: Date) => void;
  showWakeUpPicker: boolean;
  showSleepPicker: boolean;
  onShowWakeUpPicker: (show: boolean) => void;
  onShowSleepPicker: (show: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  topInset: number;
}

/**
 * 睡眠记录弹窗组件
 */
export function SleepDialog({
  open,
  onOpenChange,
  wakeUpTime,
  sleepTime,
  onWakeUpTimeChange,
  onSleepTimeChange,
  showWakeUpPicker,
  showSleepPicker,
  onShowWakeUpPicker,
  onShowSleepPicker,
  onConfirm,
  onCancel,
  topInset,
}: SleepDialogProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay-sleep"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content-sleep"
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
            记录睡眠
          </Dialog.Title>

          <YStack gap="$3">
            <YStack gap="$2">
              <Text fontSize={14} style={{ color: textColor }} opacity={0.7}>
                早晨起床时间
              </Text>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={wakeUpTime}
                  mode="time"
                  display="spinner"
                  onChange={onWakeUpTimeChange}
                  is24Hour={true}
                  style={{
                    backgroundColor: "transparent",
                  }}
                />
              ) : (
                <>
                  <Button
                    size="$4"
                    chromeless
                    onPress={() => onShowWakeUpPicker(true)}
                    borderWidth={1}
                    borderColor="$borderColor"
                    style={{
                      backgroundColor,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Input
                      size="$4"
                      placeholder="选择起床时间"
                      value={formatTime(wakeUpTime)}
                      editable={false}
                      borderWidth={0}
                      style={{
                        backgroundColor: "transparent",
                        color: textColor,
                        flex: 1,
                      }}
                    />
                  </Button>
                  {showWakeUpPicker && (
                    <DateTimePicker
                      value={wakeUpTime}
                      mode="time"
                      display="default"
                      onChange={onWakeUpTimeChange}
                      is24Hour={true}
                    />
                  )}
                </>
              )}
            </YStack>

            <YStack gap="$2">
              <Text fontSize={14} style={{ color: textColor }} opacity={0.7}>
                晚上就寝时间
              </Text>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={sleepTime}
                  mode="time"
                  display="spinner"
                  onChange={onSleepTimeChange}
                  is24Hour={true}
                  style={{
                    backgroundColor: "transparent",
                  }}
                />
              ) : (
                <>
                  <Button
                    size="$4"
                    chromeless
                    onPress={() => onShowSleepPicker(true)}
                    borderWidth={1}
                    borderColor="$borderColor"
                    style={{
                      backgroundColor,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Input
                      size="$4"
                      placeholder="选择就寝时间"
                      value={formatTime(sleepTime)}
                      editable={false}
                      borderWidth={0}
                      style={{
                        backgroundColor: "transparent",
                        color: textColor,
                        flex: 1,
                      }}
                    />
                  </Button>
                  {showSleepPicker && (
                    <DateTimePicker
                      value={sleepTime}
                      mode="time"
                      display="default"
                      onChange={onSleepTimeChange}
                      is24Hour={true}
                    />
                  )}
                </>
              )}
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
                style={{
                  backgroundColor: textColor,
                  opacity: 0.9,
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

import { useThemeColor } from "@/hooks/use-theme-color";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image, Platform } from "react-native";
import { Button, Dialog, Input, Text, XStack, YStack } from "tamagui";
import { formatTime } from "./utils";

interface DietDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoUri: string;
  dietTime: Date;
  showTimePicker: boolean;
  onShowTimePicker: (show: boolean) => void;
  onTimeChange: (event: any, selectedDate?: Date) => void;
  onPickImage: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  topInset: number;
}

/**
 * 饮食记录弹窗组件
 */
export function DietDialog({
  open,
  onOpenChange,
  photoUri,
  dietTime,
  showTimePicker,
  onShowTimePicker,
  onTimeChange,
  onPickImage,
  onConfirm,
  onCancel,
  topInset,
}: DietDialogProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay-diet"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content-diet"
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
            记录饮食
          </Dialog.Title>

          <YStack gap="$3">
            <YStack gap="$2">
              <Text fontSize={14} style={{ color: textColor }} opacity={0.7}>
                饮食照片
              </Text>
              <Button
                size="$4"
                chromeless
                onPress={onPickImage}
                borderWidth={1}
                borderStyle="dashed"
                borderColor="$borderColor"
                height={120}
                style={{
                  backgroundColor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text
                    fontSize={14}
                    style={{ color: textColor }}
                    opacity={0.5}
                  >
                    点击选择照片
                  </Text>
                )}
              </Button>
            </YStack>

            <YStack gap="$2">
              <Text fontSize={14} style={{ color: textColor }} opacity={0.7}>
                用餐时间
              </Text>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={dietTime}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
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
                    onPress={() => onShowTimePicker(true)}
                    borderWidth={1}
                    borderColor="$borderColor"
                    style={{
                      backgroundColor,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Input
                      size="$4"
                      placeholder="选择用餐时间"
                      value={formatTime(dietTime)}
                      editable={false}
                      borderWidth={0}
                      style={{
                        backgroundColor: "transparent",
                        color: textColor,
                        flex: 1,
                      }}
                    />
                  </Button>
                  {showTimePicker && (
                    <DateTimePicker
                      value={dietTime}
                      mode="time"
                      display="default"
                      onChange={onTimeChange}
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
                disabled={!photoUri.trim()}
                style={{
                  backgroundColor: textColor,
                  opacity: !photoUri.trim() ? 0.5 : 0.9,
                }}
              >
                <Text
                  style={{
                    color: backgroundColor,
                  }}
                >
                  添加
                </Text>
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

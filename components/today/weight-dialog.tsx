import { useThemeColor } from "@/hooks/use-theme-color";
import { Button, Dialog, Input, Text, XStack, YStack } from "tamagui";

interface WeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  topInset: number;
}

/**
 * 体重记录弹窗组件
 */
export function WeightDialog({
  open,
  onOpenChange,
  value,
  onValueChange,
  onConfirm,
  onCancel,
  topInset,
}: WeightDialogProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
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
            记录体重
          </Dialog.Title>

          <YStack gap="$3">
            <Input
              size="$4"
              placeholder="请输入体重（kg）"
              value={value}
              onChangeText={onValueChange}
              keyboardType="decimal-pad"
              borderWidth={1}
              borderColor="$borderColor"
              style={{
                backgroundColor,
                color: textColor,
              }}
              autoFocus
            />

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

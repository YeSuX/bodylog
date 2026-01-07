import { format } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, ScrollView, Text, YStack } from "tamagui";

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const formattedDate = format(today, "yyyy年M月d日 EEEE", { locale: zhCN });

  // Placeholder: 记录进度（后续从状态管理获取）
  const recordCount = 0;
  const totalRecords = 4;

  return (
    <YStack flex={1} bg="$background">
      <ScrollView>
        <YStack pt={insets.top + 24} pb={insets.bottom + 24} px="$4">
          {/* 顶部日期显示区域 */}
          <YStack mb="$4">
            <Text fontSize={28} fontWeight="400" color="$color">
              {formattedDate}
            </Text>
          </YStack>

          {/* 记录进度提示 */}
          <YStack mb="$3">
            <Text fontSize={14} color="$color" opacity={0.6}>
              {recordCount === 0
                ? "尚未记录"
                : `已记录 ${recordCount}/${totalRecords}`}
            </Text>
          </YStack>

          {/* 四个记录卡片区域 */}
          <YStack gap="$4">
            {/* 体重记录卡片 */}
            <Card
              elevate
              size="$4"
              bordered
              p="$4"
              bg="$background"
              borderColor="$borderColor"
              opacity={0.8}
            >
              <YStack>
                <Text fontSize={16} fontWeight="400" color="$color" mb="$2">
                  体重
                </Text>
                <Text fontSize={14} color="$color" opacity={0.5}>
                  记录体重
                </Text>
              </YStack>
            </Card>

            {/* 睡眠记录卡片 */}
            <Card
              elevate
              size="$4"
              bordered
              p="$4"
              bg="$background"
              borderColor="$borderColor"
              opacity={0.8}
            >
              <YStack>
                <Text fontSize={16} fontWeight="400" color="$color" mb="$2">
                  睡眠
                </Text>
                <Text fontSize={14} color="$color" opacity={0.5}>
                  记录睡眠
                </Text>
              </YStack>
            </Card>

            {/* 运动记录卡片 */}
            <Card
              elevate
              size="$4"
              bordered
              p="$4"
              bg="$background"
              borderColor="$borderColor"
              opacity={0.8}
            >
              <YStack>
                <Text fontSize={16} fontWeight="400" color="$color" mb="$2">
                  运动
                </Text>
                <Text fontSize={14} color="$color" opacity={0.5}>
                  记录运动
                </Text>
              </YStack>
            </Card>

            {/* 饮食记录卡片 */}
            <Card
              elevate
              size="$4"
              bordered
              p="$4"
              bg="$background"
              borderColor="$borderColor"
              opacity={0.8}
            >
              <YStack>
                <Text fontSize={16} fontWeight="400" color="$color" mb="$2">
                  饮食
                </Text>
                <Text fontSize={14} color="$color" opacity={0.5}>
                  记录饮食
                </Text>
              </YStack>
            </Card>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

import { useThemeColor } from "@/hooks/use-theme-color";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SortableGridRenderItem } from "react-native-sortables";
import Sortable from "react-native-sortables";
import { Card, Input, ScrollView, Text, YStack } from "tamagui";

interface RecordItem {
  id: string;
  title: string;
  description: string;
}

interface RecordValues {
  [key: string]: string;
}

const RECORD_DATA: RecordItem[] = [
  { id: "weight", title: "体重", description: "记录体重" },
  { id: "sleep", title: "睡眠", description: "记录睡眠" },
  { id: "exercise", title: "运动", description: "记录运动" },
  { id: "diet", title: "饮食", description: "记录饮食" },
];

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const today = new Date();
  const formattedDate = format(today, "yyyy年M月d日 EEEE", { locale: zhCN });
  const [data, setData] = useState<RecordItem[]>(RECORD_DATA);
  const [recordValues, setRecordValues] = useState<RecordValues>({});

  // 计算已记录的数量
  const recordCount = Object.values(recordValues).filter(
    (value) => value && value.trim() !== ""
  ).length;
  const totalRecords = 4;

  const handleValueChange = useCallback((id: string, value: string) => {
    setRecordValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const renderItem = useCallback<SortableGridRenderItem<RecordItem>>(
    ({ item }) => {
      const isWeight = item.id === "weight";
      const currentValue = recordValues[item.id] || "";

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
            <YStack>
              <Text
                fontSize={16}
                fontWeight="400"
                style={{ color: textColor }}
                mb="$2"
              >
                {item.title}
              </Text>
              <Text fontSize={14} style={{ color: textColor }} opacity={0.5}>
                {item.description}
              </Text>
            </YStack>

            {isWeight && (
              <YStack gap="$2">
                <Input
                  size="$4"
                  placeholder="请输入体重（kg）"
                  value={currentValue}
                  onChangeText={(text) => handleValueChange(item.id, text)}
                  keyboardType="decimal-pad"
                  borderWidth={1}
                  borderColor="$borderColor"
                  style={{
                    backgroundColor,
                    color: textColor,
                  }}
                  opacity={0.7}
                />
                {currentValue && (
                  <Text
                    fontSize={14}
                    style={{ color: textColor }}
                    opacity={0.6}
                  >
                    {currentValue} kg
                  </Text>
                )}
              </YStack>
            )}
          </YStack>
        </Card>
      );
    },
    [textColor, backgroundColor, recordValues, handleValueChange]
  );

  const handleDragEnd = useCallback(
    ({ data: newData }: { data: RecordItem[] }) => {
      setData(newData);
    },
    []
  );

  return (
    <YStack flex={1}>
      <ScrollView>
        <YStack pt={insets.top + 24} pb={insets.bottom + 24} px="$4">
          {/* 顶部日期显示区域 */}
          <YStack mb="$4">
            <Text fontSize={28} fontWeight="400" style={{ color: textColor }}>
              {formattedDate}
            </Text>
          </YStack>

          {/* 记录进度提示 */}
          <YStack mb="$3">
            <Text fontSize={14} style={{ color: textColor }} opacity={0.6}>
              {recordCount === 0
                ? "尚未记录"
                : `已记录 ${recordCount}/${totalRecords}`}
            </Text>
          </YStack>

          {/* 可拖动的记录卡片网格 */}
          <Sortable.Grid
            columnGap={16}
            columns={1}
            data={data}
            onDragEnd={handleDragEnd}
            renderItem={renderItem}
            rowGap={16}
          />
        </YStack>
      </ScrollView>
    </YStack>
  );
}

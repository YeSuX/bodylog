import { useThemeColor } from "@/hooks/use-theme-color";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SortableGridRenderItem } from "react-native-sortables";
import Sortable from "react-native-sortables";
import {
  Button,
  Card,
  Dialog,
  Input,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";

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
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [isSleepDialogOpen, setIsSleepDialogOpen] = useState(false);
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showWakeUpPicker, setShowWakeUpPicker] = useState(false);
  const [showSleepPicker, setShowSleepPicker] = useState(false);

  // 计算已记录的数量
  const recordCount = Object.values(recordValues).filter(
    (value) => value && value.trim() !== ""
  ).length;
  const totalRecords = 4;

  const handleWeightCardPress = useCallback(() => {
    // 如果已有记录，预填充输入框
    setWeightInput(recordValues.weight || "");
    setIsWeightDialogOpen(true);
  }, [recordValues.weight]);

  const handleWeightConfirm = useCallback(() => {
    if (weightInput.trim()) {
      setRecordValues((prev) => ({
        ...prev,
        weight: weightInput.trim(),
      }));
    }
    setIsWeightDialogOpen(false);
    setWeightInput("");
  }, [weightInput]);

  const handleWeightCancel = useCallback(() => {
    setIsWeightDialogOpen(false);
    setWeightInput("");
  }, []);

  // 将时间格式化为 HH:mm 格式
  const formatTime = useCallback((date: Date) => {
    return format(date, "HH:mm");
  }, []);

  // 解析时间字符串为 Date 对象
  const parseTime = useCallback((timeStr: string, defaultDate: Date) => {
    if (!timeStr) return defaultDate;
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return defaultDate;
    const date = new Date(defaultDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, []);

  const handleSleepCardPress = useCallback(() => {
    // 如果已有记录，解析并预填充时间
    const sleepValue = recordValues.sleep || "";
    if (sleepValue) {
      const [wakeUpStr, sleepStr] = sleepValue.split(" | ");
      const today = new Date();
      setWakeUpTime(parseTime(wakeUpStr, today));
      setSleepTime(parseTime(sleepStr, today));
    } else {
      const now = new Date();
      setWakeUpTime(now);
      setSleepTime(now);
    }
    setIsSleepDialogOpen(true);
  }, [recordValues.sleep, parseTime]);

  const handleWakeUpTimeChange = useCallback(
    (event: any, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowWakeUpPicker(false);
      }
      if (selectedDate) {
        setWakeUpTime(selectedDate);
      }
    },
    []
  );

  const handleSleepTimeChange = useCallback(
    (event: any, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowSleepPicker(false);
      }
      if (selectedDate) {
        setSleepTime(selectedDate);
      }
    },
    []
  );

  const handleSleepConfirm = useCallback(() => {
    const wakeUpStr = formatTime(wakeUpTime);
    const sleepStr = formatTime(sleepTime);
    setRecordValues((prev) => ({
      ...prev,
      sleep: `${wakeUpStr} | ${sleepStr}`,
    }));
    setIsSleepDialogOpen(false);
    setShowWakeUpPicker(false);
    setShowSleepPicker(false);
  }, [wakeUpTime, sleepTime, formatTime]);

  const handleSleepCancel = useCallback(() => {
    setIsSleepDialogOpen(false);
    setShowWakeUpPicker(false);
    setShowSleepPicker(false);
  }, []);

  const renderItem = useCallback<SortableGridRenderItem<RecordItem>>(
    ({ item }) => {
      const isWeight = item.id === "weight";
      const isSleep = item.id === "sleep";
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
                  {item.title}
                </Text>
                <Text fontSize={14} style={{ color: textColor }} opacity={0.5}>
                  {item.description}
                </Text>
              </YStack>

              {(isWeight || isSleep) && (
                <Button
                  size="$2"
                  chromeless
                  onPress={
                    isWeight ? handleWeightCardPress : handleSleepCardPress
                  }
                  px="$2"
                  py="$1"
                >
                  <Text
                    fontSize={14}
                    style={{ color: textColor }}
                    opacity={0.6}
                  >
                    {currentValue ? "编辑" : "记录"}
                  </Text>
                </Button>
              )}
            </XStack>

            {isWeight && currentValue && (
              <Text fontSize={16} style={{ color: textColor }} opacity={0.8}>
                {currentValue} kg
              </Text>
            )}

            {isSleep && currentValue && (
              <YStack gap="$1">
                {currentValue.split(" | ").map((time, index) => (
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
            )}
          </YStack>
        </Card>
      );
    },
    [
      textColor,
      backgroundColor,
      recordValues,
      handleWeightCardPress,
      handleSleepCardPress,
    ]
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

      {/* 体重记录 Dialog */}
      <Dialog
        modal
        open={isWeightDialogOpen}
        onOpenChange={setIsWeightDialogOpen}
      >
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
              top: insets.top + 24,
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
                value={weightInput}
                onChangeText={setWeightInput}
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
                  onPress={handleWeightCancel}
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
                  onPress={handleWeightConfirm}
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

      {/* 睡眠记录 Dialog */}
      <Dialog
        modal
        open={isSleepDialogOpen}
        onOpenChange={setIsSleepDialogOpen}
      >
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
              top: insets.top + 24,
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
                    onChange={handleWakeUpTimeChange}
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
                      onPress={() => setShowWakeUpPicker(true)}
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
                        onChange={handleWakeUpTimeChange}
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
                    onChange={handleSleepTimeChange}
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
                      onPress={() => setShowSleepPicker(true)}
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
                        onChange={handleSleepTimeChange}
                        is24Hour={true}
                      />
                    )}
                  </>
                )}
              </YStack>

              <XStack gap="$3" style={{ justifyContent: "flex-end" }}>
                <Button
                  size="$3"
                  onPress={handleSleepCancel}
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
                  onPress={handleSleepConfirm}
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
    </YStack>
  );
}

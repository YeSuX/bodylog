import { DietDialog } from "@/components/today/diet-dialog";
import { ExerciseDialog } from "@/components/today/exercise-dialog";
import { RecordCard } from "@/components/today/record-card";
import {
  DietContent,
  ExerciseContent,
  SleepContent,
  WeightContent,
} from "@/components/today/record-card-content";
import { SleepDialog } from "@/components/today/sleep-dialog";
import type {
  DietRecord,
  RecordItem,
  RecordValues,
} from "@/components/today/types";
import { formatTime, parseTime } from "@/components/today/utils";
import { WeightDialog } from "@/components/today/weight-dialog";
import { useThemeColor } from "@/hooks/use-theme-color";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SortableGridRenderItem } from "react-native-sortables";
import Sortable from "react-native-sortables";
import { ScrollView, Text, YStack } from "tamagui";

const RECORD_DATA: RecordItem[] = [
  { id: "weight", title: "体重", description: "记录体重" },
  { id: "sleep", title: "睡眠", description: "记录睡眠" },
  { id: "exercise", title: "运动", description: "记录运动" },
  { id: "diet", title: "饮食", description: "记录饮食" },
];

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, "text");
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
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("");
  const [exerciseIntensity, setExerciseIntensity] = useState("");
  const [isDietDialogOpen, setIsDietDialogOpen] = useState(false);
  const [dietRecords, setDietRecords] = useState<DietRecord[]>([]);
  const [dietPhotoUri, setDietPhotoUri] = useState("");
  const [dietTime, setDietTime] = useState(new Date());
  const [showDietTimePicker, setShowDietTimePicker] = useState(false);

  // 计算已记录的数量
  const recordCount = Object.values(recordValues).filter(
    (value) => value && value.trim() !== ""
  ).length;
  const totalRecords = 4;

  // 体重记录处理
  const handleWeightCardPress = useCallback(() => {
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

  // 睡眠记录处理
  const handleSleepCardPress = useCallback(() => {
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
  }, [recordValues.sleep]);

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
  }, [wakeUpTime, sleepTime]);

  const handleSleepCancel = useCallback(() => {
    setIsSleepDialogOpen(false);
    setShowWakeUpPicker(false);
    setShowSleepPicker(false);
  }, []);

  // 运动记录处理
  const handleExerciseCardPress = useCallback(() => {
    const exerciseValue = recordValues.exercise || "";
    if (exerciseValue) {
      const parts = exerciseValue.split(" | ");
      setExerciseType(parts[0] || "");
      setExerciseDuration(parts[1]?.replace("分钟", "") || "");
      setExerciseIntensity(parts[2] || "");
    } else {
      setExerciseType("");
      setExerciseDuration("");
      setExerciseIntensity("");
    }
    setIsExerciseDialogOpen(true);
  }, [recordValues.exercise]);

  const handleExerciseConfirm = useCallback(() => {
    if (
      exerciseType.trim() &&
      exerciseDuration.trim() &&
      exerciseIntensity.trim()
    ) {
      setRecordValues((prev) => ({
        ...prev,
        exercise: `${exerciseType.trim()} | ${exerciseDuration.trim()}分钟 | ${exerciseIntensity.trim()}`,
      }));
      setIsExerciseDialogOpen(false);
      setExerciseType("");
      setExerciseDuration("");
      setExerciseIntensity("");
    }
  }, [exerciseType, exerciseDuration, exerciseIntensity]);

  const handleExerciseCancel = useCallback(() => {
    setIsExerciseDialogOpen(false);
    setExerciseType("");
    setExerciseDuration("");
    setExerciseIntensity("");
  }, []);

  // 饮食记录处理
  const handleDietCardPress = useCallback(() => {
    setDietPhotoUri("");
    setDietTime(new Date());
    setIsDietDialogOpen(true);
  }, []);

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("需要相册权限才能选择照片");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setDietPhotoUri(result.assets[0].uri);
    }
  }, []);

  const handleDietTimeChange = useCallback(
    (event: any, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowDietTimePicker(false);
      }
      if (selectedDate) {
        setDietTime(selectedDate);
      }
    },
    []
  );

  const handleDietConfirm = useCallback(() => {
    if (dietPhotoUri.trim()) {
      const newRecord: DietRecord = {
        id: Date.now().toString(),
        photoUri: dietPhotoUri,
        time: formatTime(dietTime),
      };
      setDietRecords((prev) => [...prev, newRecord]);
      setIsDietDialogOpen(false);
      setDietPhotoUri("");
      setShowDietTimePicker(false);
    }
  }, [dietPhotoUri, dietTime]);

  const handleDietCancel = useCallback(() => {
    setIsDietDialogOpen(false);
    setDietPhotoUri("");
    setShowDietTimePicker(false);
  }, []);

  const handleDeleteDietRecord = useCallback((id: string) => {
    setDietRecords((prev) => prev.filter((record) => record.id !== id));
  }, []);

  // 渲染记录卡片
  const renderItem = useCallback<SortableGridRenderItem<RecordItem>>(
    ({ item }) => {
      const isWeight = item.id === "weight";
      const isSleep = item.id === "sleep";
      const isExercise = item.id === "exercise";
      const isDiet = item.id === "diet";
      const currentValue = recordValues[item.id] || "";

      const buttonText = isDiet ? "添加" : currentValue ? "编辑" : "记录";
      const onPress = isWeight
        ? handleWeightCardPress
        : isSleep
        ? handleSleepCardPress
        : isExercise
        ? handleExerciseCardPress
        : handleDietCardPress;

      return (
        <RecordCard
          title={item.title}
          description={item.description}
          buttonText={buttonText}
          onButtonPress={onPress}
        >
          {isWeight && <WeightContent value={currentValue} />}
          {isSleep && <SleepContent value={currentValue} />}
          {isExercise && <ExerciseContent value={currentValue} />}
          {isDiet && (
            <DietContent
              records={dietRecords}
              onDelete={handleDeleteDietRecord}
            />
          )}
        </RecordCard>
      );
    },
    [
      recordValues,
      dietRecords,
      handleWeightCardPress,
      handleSleepCardPress,
      handleExerciseCardPress,
      handleDietCardPress,
      handleDeleteDietRecord,
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

      {/* 体重记录弹窗 */}
      <WeightDialog
        open={isWeightDialogOpen}
        onOpenChange={setIsWeightDialogOpen}
        value={weightInput}
        onValueChange={setWeightInput}
        onConfirm={handleWeightConfirm}
        onCancel={handleWeightCancel}
        topInset={insets.top}
      />

      {/* 睡眠记录弹窗 */}
      <SleepDialog
        open={isSleepDialogOpen}
        onOpenChange={setIsSleepDialogOpen}
        wakeUpTime={wakeUpTime}
        sleepTime={sleepTime}
        onWakeUpTimeChange={handleWakeUpTimeChange}
        onSleepTimeChange={handleSleepTimeChange}
        showWakeUpPicker={showWakeUpPicker}
        showSleepPicker={showSleepPicker}
        onShowWakeUpPicker={setShowWakeUpPicker}
        onShowSleepPicker={setShowSleepPicker}
        onConfirm={handleSleepConfirm}
        onCancel={handleSleepCancel}
        topInset={insets.top}
      />

      {/* 运动记录弹窗 */}
      <ExerciseDialog
        open={isExerciseDialogOpen}
        onOpenChange={setIsExerciseDialogOpen}
        exerciseType={exerciseType}
        exerciseDuration={exerciseDuration}
        exerciseIntensity={exerciseIntensity}
        onExerciseTypeChange={setExerciseType}
        onExerciseDurationChange={setExerciseDuration}
        onExerciseIntensityChange={setExerciseIntensity}
        onConfirm={handleExerciseConfirm}
        onCancel={handleExerciseCancel}
        topInset={insets.top}
      />

      {/* 饮食记录弹窗 */}
      <DietDialog
        open={isDietDialogOpen}
        onOpenChange={setIsDietDialogOpen}
        photoUri={dietPhotoUri}
        dietTime={dietTime}
        showTimePicker={showDietTimePicker}
        onShowTimePicker={setShowDietTimePicker}
        onTimeChange={handleDietTimeChange}
        onPickImage={handlePickImage}
        onConfirm={handleDietConfirm}
        onCancel={handleDietCancel}
        topInset={insets.top}
      />
    </YStack>
  );
}

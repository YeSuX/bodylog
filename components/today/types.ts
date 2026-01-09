/**
 * 今日记录相关的类型定义
 */

export interface RecordItem {
  id: string;
  title: string;
  description: string;
}

export interface RecordValues {
  [key: string]: string;
}

export interface DietRecord {
  id: string;
  photoUri: string;
  time: string;
}

export type RecordType = "weight" | "sleep" | "exercise" | "diet";

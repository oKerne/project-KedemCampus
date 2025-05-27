import { Lesson } from "./lesson.model";

export interface Course {
  lessons: never[];
 id: number;
  title: string;
  episodes: number;
  teacher: string;
  imageUrl?: string;
  isStatic?: boolean;
  accessGranted?: boolean;
}

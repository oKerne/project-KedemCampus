
import { Lesson } from "./lesson.model";

// }
export interface Course {
  id: number;
  title: string;
  episodes: number;
  teacher: string;
  imageUrl: string;
  isStatic?: boolean;
  description?: string; 
  accessGranted?: boolean;
  lessons?: Lesson[];
}
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Direction } from '@angular/cdk/bidi';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { AuthService } from '../../services/auth.service';

export interface LessonData {id?: number;title: string;content: string;courseId?: number;}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule,FormsModule,MatFormFieldModule,MatInputModule,MatCardModule,MatIconModule,MatTooltipModule,],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
})
export class TeachersComponent implements OnInit {
  public isEditMode: 'edit' | null = null;

cancelEditCourse() {
throw new Error('Method not implemented.');
}
  public courses = signal<Course[]>([]);

  private _courseForm = signal<Course>({ id: 0, title: '', teacher: '', description: '', imageUrl: '', episodes: 0 });
  public courseForm = () => this._courseForm();
  public addCourseVisible = false;
  public editingCourseId = signal<number | null>(null);
  public visibleLessons = signal<{ [courseId: number]: boolean }>({});
  public lessonFormVisible = signal<{ [courseId: number]: boolean }>({});
  private _lessonForm = signal<LessonData>({ title: '', content: '' });
  public lessonForm = () => this._lessonForm();
  private lessonsByCourse = signal<{ [courseId: number]: LessonData[] }>({});
  public editingLessonId: number | null = null;

  constructor(
    private coursesService: CourseService, private authService:  AuthService,private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.loadCourses();
  }

  public loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        courses.forEach(course => {
          this.loadLessonsForCourse(course.id);
        });
      },
      error: () => this.showMessage('שגיאה בטעינת הקורסים', true)
    });
  }
  public getCoursesByTeacher(): { [teacher: string]: Course[] } {
  const grouped: { [teacher: string]: Course[] } = {};
  for (const course of this.courses()) {
    if (!grouped[course.teacher]) {
      grouped[course.teacher] = [];
    }
    grouped[course.teacher].push(course);
  }
  return grouped;
}

  public addCourseVisibleToggle(): void {
    this.addCourseVisible = !this.addCourseVisible;
    if (this.addCourseVisible) {
      this._courseForm.set({ id: 0, title: '', teacher: '', description: '', imageUrl: '', episodes: 0 });
      this.editingCourseId.set(null);
    }
  }

  public addCourse(): void {
    const course = this.courseForm();
    if (!course.title || !course.teacher) {
      this.showMessage('יש למלא שם קורס ושם מורה', true);
      return;
    }

    this.coursesService.createCourse(course).subscribe({
      next: () => {
        this.showMessage('קורס נוסף בהצלחה');
        this.loadCourses();
        this.addCourseVisible = false;
      },
      error: () => this.showMessage('שגיאה בהוספת הקורס', true)
    });
  }

  public isEditVisible(courseId: number): boolean {
    return this.editingCourseId() === courseId;
  }

  public toggleEdit(courseId: number): void {
    if (this.editingCourseId() === courseId) {
      this.editingCourseId.set(null);
    } else {
      const course = this.courses().find(c => c.id === courseId);
      if (course) {
        this._courseForm.set({ ...course });
        this.editingCourseId.set(courseId);
      }
    }
  }

  public saveCourseEdit(): void {
    const course = this.courseForm();
    if (!course.title || !course.teacher) {
      this.showMessage('יש למלא שם קורס ושם מורה', true);
      return;
    }
    if (!course.id) {
      this.showMessage('קורס לא קיים לעריכה', true);
      return;
    }

    this.coursesService.updateCourse(course.id, course).subscribe({
      next: () => {
        this.showMessage('הקורס עודכן בהצלחה');
        this.loadCourses();
        this.editingCourseId.set(null);
      },
      error: () => this.showMessage('שגיאה בעדכון הקורס', true)
    });
  }

  public toggleLessons(courseId: number): void {
    const current = this.visibleLessons();
    current[courseId] = !current[courseId];
    this.visibleLessons.set({ ...current });
  }

  public isLessonsVisible(courseId: number): boolean {
    return !!this.visibleLessons()[courseId];
  }

  public showLessonFormForCourse(courseId: number): void {
    const current = this.lessonFormVisible();
    current[courseId] = !current[courseId];
    this.lessonFormVisible.set({ ...current });

    this._lessonForm.set({ title: '', content: '' });
  }

  public isLessonFormVisible(courseId: number): boolean {
    return !!this.lessonFormVisible()[courseId];
  }

  public loadLessonsForCourse(courseId: number): void {
    this.coursesService.getLessons(courseId).subscribe({
      next: (lessons) => {
        const allLessons = { ...this.lessonsByCourse() };
        allLessons[courseId] = lessons;
        this.lessonsByCourse.set(allLessons);
      },
      error: () => this.showMessage('שגיאה בטעינת השיעורים', true)
    });
  }
 saveCourse(): void {
  if (this.editingCourseId() !== null) {
    this.saveCourseEdit();
  } else {
    this.addCourse();
  }
}

  public getLessonsForCourse(courseId: number): LessonData[] {
    return this.lessonsByCourse()[courseId] || [];
  }

  public deleteLesson(lessonId: number): void {
    if (!lessonId) return;

    if (confirm('האם אתה בטוח שברצונך למחוק את השיעור?')) {
      let foundCourseId: number | undefined;
      for (const [courseId, lessons] of Object.entries(this.lessonsByCourse())) {
        if (lessons.find(lesson => lesson.id === lessonId)) {
          foundCourseId = +courseId;
          break;
        }
      }

      if (!foundCourseId) {
        this.showMessage('שגיאה: לא נמצא הקורס של השיעור למחיקה', true);
        return;
      }

      this.coursesService.deleteLesson(foundCourseId, lessonId).subscribe({
        next: () => {
          this.showMessage('השיעור נמחק בהצלחה');
          this.loadLessonsForCourse(foundCourseId!);
        },
        error: () => this.showMessage('שגיאה במחיקת השיעור', true)
      });
    }
  }
  editLesson(lesson: LessonData): void {
  this._lessonForm.set(lesson);
  this.editingLessonId = lesson.id ?? null; 
}

  public cancelEditLesson(): void {
    this.editingLessonId = null;
    this._lessonForm.set({ title: '', content: '' });
  }

  public saveLesson(courseId: number): void {
    if (!this._lessonForm().title || !this._lessonForm().content) {
      this.showMessage('יש למלא כותרת ותוכן לשיעור', true);
      return;
    }

    const lesson = this._lessonForm();

    if (this.editingLessonId !== null) {
      this.coursesService.updateLesson(courseId, lesson.id!, lesson).subscribe({
        next: () => {
          this.showMessage('השיעור עודכן בהצלחה');
          this.loadLessonsForCourse(courseId);
          this.editingLessonId = null;
          this._lessonForm.set({ title: '', content: '' });
          console.log('courseId', courseId);
         console.log('lesson.id', lesson.id);

        },
        error: () => this.showMessage('שגיאה בעדכון השיעור', true)
      });
    } else {
      this.coursesService.createLesson(courseId, lesson).subscribe({
        next: () => {
          this.showMessage('השיעור נוסף בהצלחה');
          this.loadLessonsForCourse(courseId);
          this.showLessonFormForCourse(courseId);
        },
        error: () => this.showMessage('שגיאה בהוספת השיעור', true)
      });
    }
  }

  public deleteCourse(courseId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את הקורס?')) {
      this.coursesService.deleteCourse(courseId).subscribe({
        next: () => {
          this.showMessage('הקורס נמחק בהצלחה');
          this.loadCourses();
        },
        error: () => this.showMessage('שגיאה במחיקת הקורס', true)
      });
    }
  }
public showMessage(message: string, isError: boolean = false): void {
  const config = {
    duration: 4000,
    panelClass: isError ? ['snackbar', 'snackbar-error'] : ['snackbar', 'snackbar-success'],
    horizontalPosition: 'center' as const,
    verticalPosition: 'top' as const,
    direction: 'rtl' as Direction 
  };

  this.snackBar.open(message, '✖ סגור', config);
}
}




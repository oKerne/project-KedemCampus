import { Component, effect, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../services/lesson.service';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Lesson } from '../../models/lesson.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-teachers',
  standalone: true,
imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule],  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
})
export class TeachersComponent {
  lessons = signal<Lesson[]>([]);
  editLesson = signal<Lesson>({ courseId: 0, title: '', content: '', id: 0 });
  editLessonId = signal<number | null>(null);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  courses = signal<Course[]>([]);
  selectedCourse = signal<Course | null>(null);
  teacherName = computed(() => this.selectedCourse()?.teacher || '');
  courseId = computed(() => this.selectedCourse()?.id || 0);

  showNoCoursesMessage = signal<boolean>(false);
  noCoursesMessage = signal<string>('');

  isGridView = signal<boolean>(true);

  newCourse = signal<Course>({ id: 0, title: '', teacher: '', imageUrl: '', episodes: 0 });
  newLesson = signal<Lesson>({ title: '', content: '', courseId: 0, id: 0 });

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private courseService: CourseService
  ) {
    this.loadCoursesByTeacher();

    // כשמשתנה ה־courseId — טען שיעורים אוטומטית
    effect(() => {
      const id = this.courseId();
      if (id) {
        this.loadLessons(id);
        this.newLesson.update(n => ({ ...n, courseId: id }));
        this.editLesson.update(n => ({ ...n, courseId: id }));
      }
    });
  }

  toggleView(): void {
    this.isGridView.update(v => !v);
  }
  loadCoursesByTeacher(): void {
    this.courseService.getCourses().subscribe({
      next: (courses: Course[]) => {
        if (courses.length > 0) {
          this.courses.set(courses);
          this.selectedCourse.set(courses[0]);
          this.showNoCoursesMessage.set(false);
        } else {
          this.showNoCoursesMessage.set(true);
          this.noCoursesMessage.set('אין עדיין קורסים למורה. ניתן להוסיף קורס חדש.');
        }
      },
      error: () => {
        this.showNoCoursesMessage.set(true);
        this.noCoursesMessage.set('שגיאה בטעינת הקורסים.');
      }
    });
  }

  selectCourse(course: Course): void {
    this.selectedCourse.set(course);
  }
  

 loadLessons(courseId: number): void {
  this.lessonService.getLessons(courseId).subscribe({
    next: lessons => {
      this.lessons.set(lessons);
      this.errorMessage.set('');
    },
    error: err => {
      console.warn('לא נמצאו שיעורים לקורס', courseId);
      this.lessons.set([]);
    }
  });
}

addCourse(): void {
  const course = this.newCourse();
  if (!course.title || !course.teacher) return;

  const newCourseObj: Course = {
    ...course,
    id: 0,
    episodes: 0,
    imageUrl: course.imageUrl || '/images/Software.jpg'
  };

  this.courseService.createCourse(newCourseObj).subscribe({
    next: createdCourse => {
      this.courses.update(c => [...c, createdCourse]);
      this.selectedCourse.set(createdCourse); // העברה לקורס החדש
      this.newCourse.set({ id: 0, title: '', teacher: '', imageUrl: '', episodes: 0 });
      this.showNoCoursesMessage.set(false);
      
      // טען שיעורים רק אם יש קורס
      this.loadLessons(createdCourse.id);
    },
    error: err => {
      console.error('שגיאה ביצירת קורס:', err);
      this.errorMessage.set('לא ניתן היה ליצור את הקורס.');
    }
  });
}

 deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.courses.update(c => c.filter(course => course.id !== courseId));
        this.selectedCourse.set(null);
      },
      error: err => {
        console.error('שגיאה במחיקת קורס:', err);
        this.errorMessage.set('לא ניתן היה למחוק את הקורס.');
      }
    });
  }

  addLesson(): void {
    const lesson = this.newLesson();
    if (!lesson.title || !lesson.content) return;

    this.lessonService.addLesson(this.courseId(), lesson).subscribe({
      next: newL => {
        this.lessons.update(l => [...l, newL]);
        this.newLesson.set({ courseId: this.courseId(), title: '', content: '', id: 0 });
        this.errorMessage.set('');
      },
      error: err => this.errorMessage.set(err.message)
    });
  }

  deleteLesson(lessonId: number): void {
    this.lessonService.deleteLesson(this.courseId(), lessonId).subscribe({
      next: () => {
        this.lessons.update(l => l.filter(x => x.id !== lessonId));
        this.errorMessage.set('');
      },
      error: err => this.errorMessage.set(err.message)
    });
  }
}

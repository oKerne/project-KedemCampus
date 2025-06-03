import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { LessonService } from '../../services/lesson.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { catchError, tap } from 'rxjs';


@Component({
  selector: 'app-lessons',
  imports: [CommonModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

  selectedCourse = signal<any>(null);
  lessons = signal<any[]>([]);
  selectedLesson = signal<any>(null);
  selectedLessonIndex = signal<number>(-1);
  errorMessage = signal<string | null>(null);
  courseId!: number;
  @Input() selected: any = null;
  @Output() lessonClicked = new EventEmitter<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonService: LessonService,
    private authService: AuthService
  ) {}

 ngOnInit(): void {
  this.courseId = +this.route.snapshot.paramMap.get('id')!;
  
  this.courseService.getCourseById(this.courseId).subscribe({
    next: (course) => {
      this.selectedCourse.set(course);
      this.loadLessons();
    },
    error: (err) => {
      console.error('שגיאה בטעינת הקורס:', err);
    }
  });
}

  loadLessons(): void {
    this.lessonService.getLessons(this.courseId).subscribe(
      lessons => {
        this.lessons.set(lessons);
        console.log('השיעורים שהתקבלו:', lessons);

        const updatedCourse = {
          ...this.selectedCourse(),
          lessons
        };
        this.selectedCourse.set(updatedCourse);

        console.log('הקורס עם השיעורים שהתקבל:', updatedCourse);
      },
      error => {
        console.error('שגיאה בטעינת השיעורים:', error);
        this.errorMessage.set('שגיאה בטעינת השיעורים.');
      }
    );
  }
  onLessonClick(id: number): void {
    this.lessonClicked.emit(id);
  }
  onLessonSelected(lessonId: number): void {
    const index = this.lessons().findIndex(lesson => lesson.id === lessonId);
    if (index !== -1) {
      this.selectedLessonIndex.set(index);
      this.selectedLesson.set(this.lessons()[index]);
      console.log('Selected lesson:', this.selectedLesson());
    }
  }
}

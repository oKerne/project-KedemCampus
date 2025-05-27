import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CourseService } from '../../services/course.service';
import { LessonService } from '../../services/lesson.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses = signal<Course[]>([]);
  userId = signal<number | null>(null);
  selectedCourseId = signal<number | null>(null);
  isGridView = signal(true);

  // קורסים סטטיים
  // readonly Courses: Course[] = [
  //   { title: 'AI - מתקדם', episodes: 5, id: 7, teacher: 'מייר אילון ', imageUrl: 'images/ai.jpg', isStatic: true },
  //   { title: 'AI ', episodes: 5, id: 8, teacher: 'ברכי קליין ', imageUrl: 'images/AI-2.jpg', isStatic: true },
  //   { title: 'Angular 19', episodes: 10, id: 3, teacher: ' חני לוין ', imageUrl: 'images/אנגולר 19..jpg', isStatic: true },
  //   { title: 'Angular 19 - מחזור 2', episodes: 12, id: 4, teacher: ' יהודית קמינר', imageUrl: 'images/אנגולר 19.jpg', isStatic: true },
  //   { title: 'Angular-מחזור 3', episodes: 20, id: 10, teacher: 'טליה שורץ', imageUrl: 'images/angular19-3.png', isStatic: true },
  //   { title: 'Net Cor', episodes: 20, id: 11, teacher: ' שפרה בהר', imageUrl: 'images/net.jpg', isStatic: true },
  //   { title: 'React   ', episodes: 20, id: 5, teacher: ' יעל לוי', imageUrl: 'images/react.jpg', isStatic: true },
  //   { title: 'אוטומציה עסקית מסלול מיוחד', episodes: 25, id: 6, teacher: 'טליה שורץ', imageUrl: 'images/course8.jpg', isStatic: true },
  // ];


  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    
  ) {}


  ngOnInit(): void {
    this.userId.set(this.authService.userId());
    this.loadCourses();
  }

  toggleView() {
    this.isGridView.update(val => !val);
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (serverCourses: Course[]) => {
        serverCourses.forEach(course => {
          if (!course.imageUrl) course.imageUrl = 'images/QA.png';
          if (!course.episodes) course.episodes = 5;
          if (!course.teacher) course.teacher = 'טליה שורץ';
        });

        const allCourses = [...this.courses(), ...serverCourses];

        if (this.userId()) {
          this.courseService.getCoursesByUserId(this.userId()!).subscribe({
            next: (myCourses: Course[]) => {
              const myCourseIds = myCourses.map(c => c.id);
              this.courses.set(allCourses.map(course => ({
                ...course,
                accessGranted: myCourseIds.includes(course.id)
              })));
            },
            error: err => {
              console.error('שגיאה בטעינת קורסים של המשתמש:', err);
              this.courses.set(allCourses);
            }
          });
        } else {
          this.courses.set(allCourses);
        }
      },
      error: err => {
        console.error('שגיאה בטעינת קורסים:', err);
        this.courses.set([...this.courses()]);
      }
    });
  }

  enroll(courseId: number) {
    if (!this.userId()) {
      alert('יש להתחבר כדי להירשם לקורס');
      return;
    }

    this.courseService.enrollStudent(courseId, this.userId()!).subscribe({
      next: () => {
        alert('נרשמת בהצלחה לקורס!');
        this.loadCourses();
      },
      error: err => {
        console.error('שגיאה בהרשמה:', err);
        alert('שגיאה בהרשמה לקורס');
      }
    });
  }

  unenroll(courseId: number): void {
    if (!this.userId()) {
      alert('יש להתחבר כדי לבטל הרשמה');
      return;
    }

    this.courseService.unenrollStudent(courseId, this.userId()!).subscribe({
      next: () => {
        alert('ההרשמה בוטלה בהצלחה');
        this.loadCourses();
      },
      error: err => {
        console.error('שגיאה בביטול רישום:', err);
        alert('שגיאה בביטול ההרשמה');
      }
    });
  }

  viewLessons(courseId: number): void {
    this.selectedCourseId.set(courseId);
  }

  closeLessons(): void {
    this.selectedCourseId.set(null);
  }

  openCourse(courseId: number) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/course', courseId]);
    } else {
      alert('אנא התחבר כדי לצפות בקורס');
    }
  }

  logout() {
    this.authService.logout();
  }
}

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

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private lessonService: LessonService,
    
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

        const allCourses = [...serverCourses];


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
// loadCourses(): void {
//   this.courseService.getCourses().subscribe({
//     next: (serverCourses: Course[]) => {
//       serverCourses.forEach(course => {
//         if (!course.imageUrl) course.imageUrl = 'images/QA.png';
//         if (!course.episodes) course.episodes = 5;
//         if (!course.teacher) course.teacher = 'טליה שורץ';
//       });

//       const allCourses = [...serverCourses];

//       if (this.userId()) {
//         this.courseService.getCoursesByUserId(this.userId()!).subscribe({
//           next: (myCourses: Course[]) => {
//             const myCourseIds = myCourses.map(c => c.id);

//             allCourses.forEach(course => {
//               this.lessonService.getLessons(course.id).subscribe({
//                 next: lessons => {
//                   course.lessons = lessons;
//                   course.accessGranted = myCourseIds.includes(course.id);
//                   this.courses.set([...allCourses]);
//                 },
//                 error: () => {
//                   course.lessons = [];
//                   course.accessGranted = myCourseIds.includes(course.id);
//                   this.courses.set([...allCourses]);
//                 }
//               });
//             });
//           },
//           error: err => {
//             console.error('שגיאה בטעינת קורסים של המשתמש:', err);
//             this.courses.set(allCourses);
//           }
//         });
//       } else {
//         allCourses.forEach(course => {
//           this.lessonService.getLessons(course.id).subscribe({
//             next: lessons => {
//               course.lessons = lessons;
//               this.courses.set([...allCourses]);
//             },
//             error: () => {
//               course.lessons = [];
//               this.courses.set([...allCourses]);
//             }
//           });
//         });
//       }
//     },
//     error: err => {
//       console.error('שגיאה בטעינת קורסים:', err);
//       this.courses.set([...this.courses()]);
//     }
//   });
// }

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


openCourse(courseId: number): void {
  const userId = this.authService.userId?.();

  if (!userId) {
    alert('אנא התחבר כדי לצפות בקורס');
    return;
  }

  this.courseService.getCoursesByUserId(userId).subscribe({
    next: (courses) => {
      const isEnrolled = courses.some(c => c.id === courseId);
      if (!isEnrolled) {
        alert('יש להירשם לקורס כדי לצפות בפרטיו');
        return;
      }

      this.router.navigate(['/course', courseId]);
    },
    error: () => {
      alert('שגיאה בבדיקת הרשמה לקורס');
    }
  });
}

  logout() {
    this.authService.logout();
  }
}

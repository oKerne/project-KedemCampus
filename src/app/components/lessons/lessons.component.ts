// import { Component, Input, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CourseService } from '../../services/course.service';
// import { CommonModule } from '@angular/common';
// import { catchError, tap } from 'rxjs/operators';
// import { of } from 'rxjs';

// @Component({
//   selector: 'app-lessons',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './lessons.component.html',
//   styleUrls: ['./lessons.component.css']
// })
// export class LessonsComponent implements OnInit {
//   lessons: any[] = [];
//   courseId!: number;
//   selectedCourse: any = null;
//   errorMessage: string | null = null; 

//   constructor(private route: ActivatedRoute, private coursesService: CourseService) { }

//   ngOnInit() {
//     this.courseId = +this.route.snapshot.paramMap.get('id')!;
//     this.coursesService.getCourseById(this.courseId).pipe(
//       tap(course => { 
//         console.log('הקורס שהתקבל:', course);
//       }),
//       catchError(error => {
//         console.error('שגיאה בקבלת הקורס:', error);
//         this.errorMessage = 'שגיאה בטעינת השיעורים. אנא נסה שוב מאוחר יותר.';
//         return of(null); 
//       })
//     ).subscribe((course: any) => {
//       if (course) {
//         this.lessons = course.lessons || [];
//         console.log('השיעורים שהתקבלו:', this.lessons);
//       } else {
//         this.lessons = [];
//       }
//     });
//   }

//   onLessonSelected(lessonId: number) {
//     console.log('השיעור נבחר:', lessonId);
//   }
// }

 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  selectedCourse: any = null;
  courseId!: number;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.courseService.getCourseById(this.courseId).pipe(
      tap(course => {
        console.log('הקורס שהתקבל:', course);
      }),
      catchError(error => {
        console.error('שגיאה בקבלת הקורס:', error);
        this.errorMessage = 'שגיאה בטעינת הקורס.';
        return of(null);
      })
    ).subscribe(course => {
      if (course) {
        this.selectedCourse = {
          ...course,
          // lessons: course.lessons || []
        };
      }
    });
  }
}

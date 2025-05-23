// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { Lesson } from '../models/lesson.model';

import { catchError, Observable, throwError } from "rxjs";
import { Lesson } from "../models/lesson.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

// @Injectable({
//   providedIn: 'root'
// })
// export class LessonService {
//   private baseUrl = 'http://localhost:3000/api/course';

//   constructor(private http: HttpClient) {}

//   getLessons(courseId: number): Observable<Lesson[]> {
//     return this.http.get<Lesson[]>(`${this.baseUrl}/${courseId}/lessons`)
//       .pipe(catchError(this.handleError));
//   }

//   addLesson(courseId: number, lesson: Lesson): Observable<Lesson> {
//     return this.http.post<Lesson>(`${this.baseUrl}/${courseId}/lessons`, lesson)
//       .pipe(catchError(this.handleError));
//   }

//   updateLesson(courseId: number, lessonId: number, lesson: Lesson): Observable<Lesson> {
//     return this.http.put<Lesson>(`${this.baseUrl}/${courseId}/lessons/${lessonId}`, lesson)
//       .pipe(catchError(this.handleError));
//   }

//   deleteLesson(courseId: number, lessonId: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/${courseId}/lessons/${lessonId}`)
//       .pipe(catchError(this.handleError));
//   }

//   private handleError(error: HttpErrorResponse) {
//     console.error('שגיאה מהשרת:', error);
//     return throwError(() => new Error('אירעה שגיאה בעת ביצוע הפעולה. נסה שוב מאוחר יותר.'));
//   }
// }
@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private baseUrl = 'http://localhost:3000/api/course';

  constructor(private http: HttpClient) {}

  getLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/${courseId}/lessons`)
      .pipe(catchError(this.handleError));
  }

  addLesson(courseId: number, lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.baseUrl}/${courseId}/lessons`, lesson)
      .pipe(catchError(this.handleError));
  }

  updateLesson(courseId: number, lessonId: number, lesson: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.baseUrl}/${courseId}/lessons/${lessonId}`, lesson)
      .pipe(catchError(this.handleError));
  }

  deleteLesson(courseId: number, lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${courseId}/lessons/${lessonId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('שגיאה מהשרת:', error);
    return throwError(() => new Error('אירעה שגיאה בעת ביצוע הפעולה. נסה שוב מאוחר יותר.'));
  }
}

import { catchError, Observable, throwError } from "rxjs";
import { Lesson } from "../models/lesson.model";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = '/api/courses';

  constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
    console.error('שגיאה מהשרת:', error);
    return throwError(() => new Error('אירעה שגיאה בעת ביצוע הפעולה. נסה שוב מאוחר יותר.'));
  }
    private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  getLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getHeaders() })  
      .pipe(catchError(this.handleError));
  }

  createLesson(courseId: number, lesson: Lesson): Observable<Lesson> {
    return this.http
      .post<Lesson>(`${this.apiUrl}/${courseId}/lessons`, lesson, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateLesson(lessonId: number, updates: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(`/api/lessons/${lessonId}`, updates, {headers: this.getHeaders()
     }).pipe(catchError(this.handleError));
 }


  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

}

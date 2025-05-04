import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getLessons(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getHeaders() });
  }

  getLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers: this.getHeaders() });
  }

  createLesson(courseId: number, lesson: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/lessons`, lesson, { headers: this.getHeaders() });
  }

  updateLesson(courseId: number, lessonId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, data, { headers: this.getHeaders() });
  }

  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers: this.getHeaders() });
  }
}

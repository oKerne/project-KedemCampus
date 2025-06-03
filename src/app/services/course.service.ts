
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service"; 
import { Course } from "../models/course.model";
import { Lesson } from "../models/lesson.model";


@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiUrl = '/api/courses';
  constructor(private http: HttpClient, private authService: AuthService) {}

 private getHeaders(): HttpHeaders {
  const token = this.authService.getToken();
  if (token) {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  } else {
    return new HttpHeaders();
  }
}


  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

 
  getCourses(): Observable<Course[]> {
    return this.http
      .get<Course[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error fetching courses:', error);
          return throwError(() => new Error('שגיאה בטעינת הקורסים. אנא נסה שוב מאוחר יותר.'));
        })
      );
  }
 getCourseById(id: number): Observable<Course> {
    return this.http
      .get<Course>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


getCoursesByUserId(userId: number): Observable<Course[]> {
  return this.http.get<Course[]>(`${this.apiUrl}/student/${userId}`, { headers: this.getHeaders() })
    .pipe(
      catchError(error => {
        console.error('Error fetching user courses:', error);
        return throwError(() => new Error('שגיאה בטעינת הקורסים. אנא נסה שוב מאוחר יותר.'));
      })
    );
}
getEnrolledCourses(studentId: number): Observable<{ id: number, title: string, description: string, teacherId: number }[]> {
  if (!studentId || studentId <= 0) {
    console.error('Invalid student ID:', studentId);
    return throwError(() => new Error('Invalid student ID'));
  }

  return this.http.get<{ id: number, title: string, description: string, teacherId: number }[]>(
    `${this.apiUrl}/student/${studentId}`,
    { headers: this.getHeaders() }
  );
}


  enrollStudent(courseId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, { userId }, {
      headers: this.getHeaders()
    }).pipe(catchError((error) => {
        console.error('Error enrolling in course:', error);
        return throwError(() => new Error(' שגיאה בהרשמה לקורס. אנא נסה שוב.'));
      }));
  }

  unenrollStudent(courseId: number, userId: number): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${courseId}/unenroll`, {
      body: { userId },
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }
  getLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getHeaders() })
      .pipe(catchError(error => {   
        console.error('Error during unenrollment:', error);
        return throwError(() => new Error('שגיאה בביטול הרשמה לקורס. אנא נסה שוב.'));
      })
      );
  }
   // למורים בלבד
  private getTeacherId(): number {
    const teacherId = localStorage.getItem('userId');
    if (!teacherId) {
      throw new Error('Teacher ID is not found in localStorage');
    }
    return parseInt(teacherId, 10); // המרה למספר שלם
  }
   getCourseDetails(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getHeaders() });
  }
// getCoursesByTeacher(): Observable<Course[]> {
//   const teacherId = this.authService.userId();
//   if (!teacherId) {
//     throw new Error('Teacher ID is missing');
//   }
//   return this.http.get<Course[]>(`${this.apiUrl}/byTeacher/${teacherId}`, { headers: this.getHeaders() });
// }

getCoursesByTeacher(): Observable<Course[]> {
  const teacherId = this.authService.userId();
  console.log('teacherId in getCoursesByTeacher:');
  console.log('teacherId in getCoursesByTeacher:', teacherId);
  if (!teacherId) {
    throw new Error('Teacher ID is missing');
  }
  
  return this.http.get<Course[]>(`${this.apiUrl}/byTeacher/${teacherId}`, { headers: this.getHeaders() });
}

  // createCourse(course: Omit<Course, 'teacherId'>): Observable<Course> {
  //   const teacherId = this.getTeacherId(); 
  //   console.log('teacherId in createCourse:', teacherId);
  //   const courseWithTeacherId = { ...course, teacherId };

  //   return this.http
  //     .post<Course>(this.apiUrl, courseWithTeacherId, { headers: this.getHeaders() })
  //     .pipe(catchError(this.handleError));
  // }
 createCourse(course: Omit<Course, 'teacherId'>): Observable<Course> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Course>(this.apiUrl, course, { headers: this.getHeaders() });
  }
  updateCourse(courseId: number, course: Omit<Course, 'teacherId'>): Observable<Course> {
  const teacherId = this.authService.userId();
  const courseWithTeacherId = { ...course, teacherId };
  return this.http
    .put<Course>(`${this.apiUrl}/${courseId}`, courseWithTeacherId, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}


  deleteCourse(courseId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${courseId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createLesson(courseId: number, lesson: Lesson): Observable<Lesson> {
    return this.http
      .post<Lesson>(`${this.apiUrl}/${courseId}/lessons`, lesson, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

   updateLesson(courseId: number, lessonId: number, updates: Lesson): Observable<any> {
  return this.http.put(`/api/courses/${courseId}/lessons/${lessonId}`, updates, {
    headers: this.getHeaders()
  }).pipe(
    catchError(this.handleError)
  );
}


  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}

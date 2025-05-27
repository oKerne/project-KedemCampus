
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";
import { computed, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { switchMap, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  private loadUserFromToken() {
    
    const token = this.token();
    if (!token) return;
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadUserDetails(userId).subscribe();
    }
  }

  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role.toLowerCase() || null);
  userName = computed(() => this.currentUser()?.name || null);
  userId = computed(() => this.currentUser()?.id || null);

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.token.set(token);
        this.loadUserFromToken();
      }
    }
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.token();
    if (!token) {
      return { headers: new HttpHeaders() };
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
login(email: string, password: string) {
  return this.http.post<{ token: string; userId: string; role: string }>(
    `${this.apiUrl}/login`,
    { email, password }
  ).pipe(
    tap(({ token, userId, role }) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
      }
      this.token.set(token);

      // נטען את פרטי המשתמש לפי userId
      this.loadUserDetails(userId).subscribe();
    })
  );
}

//   login(email: string, password: string) {
//     return this.http.post<{ token: string; user: User }>(
//       `${this.apiUrl}/login`,
//       { email, password }
//     ).pipe(
//      tap(({ token, user }) => {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', user.id.toString());
//          localStorage.setItem('userName', user.name);
//         //  localStorage.setItem('userRole', 'teacher');

//         localStorage.setItem('userInitial', user.name.charAt(0).toUpperCase());
//       }
//       this.token.set(token);
//       this.currentUser.set(user);  // קובע ישירות את המשתמש שהתקבל
//     })
//   );
// }

loadUserDetails(userId: string) {
  return this.http.get<User>(`http://localhost:3000/api/users/${userId}`, this.getAuthHeaders())
    .pipe(
      tap(user => {
        this.currentUser.set(user);
      })
    )
}


  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return this.token();
  }
  
}

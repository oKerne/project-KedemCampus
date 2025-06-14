
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

  private apiUrl = 'api/auth';

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

loadUserDetails(userId: string) {
  return this.http.get<User>(`/api/users/${userId}`, this.getAuthHeaders())
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

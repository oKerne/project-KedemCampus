import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ 
  providedIn: 'root'
 })

export class UserService {
  private apiUrl = 'http://localhost:3000/api/auth/register'

  constructor(private http: HttpClient) {}
  
  loginUser(credentials: { email: string; password: string }): Observable<any> {
  const url = 'http://localhost:3000/api/auth/login'; 
  return this.http.post(url, credentials);
}

 registerUser(userData: { name: string; email: string; password: string; role: string }): Observable<any> {
  return this.http.post(this.apiUrl, userData);
}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // getUser(id: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  // }
 getUser(id: number): Observable<any> {
  if (id) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  } else {
   
    return this.http.get(`${this.apiUrl}/current-user`);
  }
}

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

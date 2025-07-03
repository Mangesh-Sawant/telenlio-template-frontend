import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  private baseUrl = 'http://localhost:8000/auth'; // your FastAPI backend

  constructor(private http: HttpClient) {
  }

  register(data: RegisterPayload) {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(credentials: LoginPayload) {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  surname: string;
  contact: number;
  email: string;
  password: string;
  field: string;
}

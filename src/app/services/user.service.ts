import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDto } from '../models/user.service';
import { AuthResponseDto } from '../models/auth-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7267/api/Account';
  private userSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  register(user: UserDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/Register`, user, { headers });
  }

  login(credentials: any): Observable<AuthResponseDto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/Login`, credentials, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          if (this.isLocalStorageAvailable()) {
            localStorage.setItem('authToken', response.token);
          }
          this.fetchUser();
        }
      })
    );
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  fetchUser(): void {
    if (!this.isLocalStorageAvailable()) {
      console.error('localStorage is not available');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.http.get(`${this.apiUrl}/GetUser`, { headers }).subscribe(
        user => this.userSubject.next(user),
        error => console.error('Erro ao obter dados do usuário', error)
      );
    } else {
      console.error('Token não encontrado no localStorage');
    }
  }

  updateUser(user: any): Observable<any> {
    if (!this.isLocalStorageAvailable()) {
      return new Observable(observer => {
        observer.error('localStorage is not available');
      });
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      return this.http.put<any>(`${this.apiUrl}/UpdateUser`, user, { headers });
    } else {
      return new Observable(observer => {
        observer.error('Token não encontrado no localStorage');
      });
    }
  }

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagem', image);
    if (!this.isLocalStorageAvailable()) {
      return new Observable(observer => {
        observer.error('localStorage is not available');
      });
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post<any>(`${this.apiUrl}/upload-image`, formData, { headers }).pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        })
      );
    } else {
      return new Observable(observer => {
        observer.error('Token não encontrado no localStorage');
      });
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}

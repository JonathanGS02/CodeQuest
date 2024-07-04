import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDto } from '../models/user.service';   // Certifique-se de que o caminho está correto
import { AuthResponseDto } from '../models/auth-response.dto'; // Importe a nova interface

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7267/api/Account'; // URL da API
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
          localStorage.setItem('authToken', response.token);
          this.fetchUser(); // Fetch user data after login
        }
      })
    );
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  fetchUser(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.http.get(`${this.apiUrl}/GetUser`, { headers }).subscribe(
      user => this.userSubject.next(user),
      error => console.error('Erro ao obter dados do usuário', error)
    );
  }
}

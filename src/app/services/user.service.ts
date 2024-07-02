import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDto } from '../models/user.service';  // Certifique-se de que o caminho está correto
import { AuthResponseDto } from '../models/auth-response.dto'; // Importe a nova interface

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7267/api/Account'; // URL da API

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
        }
      })
    );
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/GetUser`, { headers });
  }
}

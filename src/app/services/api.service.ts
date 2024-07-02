import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user.service';
import { UserService } from './user.service';  // Importe o UserService

export interface Question {
  questaoId: string;
  titulo: string;
  pergunta1: string;
  pergunta2: string;
  pergunta3: string;
  pergunta4: string;
  pergunta5: string;
  pergunta6: string;
  perguntaCorreta1: boolean;
  perguntaCorreta2: boolean;
  perguntaCorreta3: boolean;
  perguntaCorreta4: boolean;
  perguntaCorreta5: boolean;
  perguntaCorreta6: boolean;
  nivel: number;
  concluido: boolean;
  userId: number;
  user: UserDto;
  numero: number;
  correctOption: string;
}

export interface Topic {
  topicId: string;
  title: string;
  level: number;
  unlocked: boolean;
  questoes: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7267/api';

  constructor(private http: HttpClient, private userService: UserService) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('authToken') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getQuestions(): Observable<Question[]> {
    console.log('Fetching questions...');
    return this.http.get<Question[]>(`${this.apiUrl}/Questao`, { headers: this.getHeaders() });
  }

  getTopics(): Observable<Topic[]> {
    console.log('Fetching topics...');
    return this.http.get<Topic[]>(`${this.apiUrl}/Topico`, { headers: this.getHeaders() });
  }

  getQuestionById(id: string): Observable<Question> {
    console.log(`Fetching question by ID: ${id}`);
    return this.http.get<Question>(`${this.apiUrl}/Questao/${id}`, { headers: this.getHeaders() });
  }

  getTopicById(id: string): Observable<Topic> {
    console.log(`Fetching topic by ID: ${id}`);
    return this.http.get<Topic>(`${this.apiUrl}/Topico/${id}`, { headers: this.getHeaders() });
  }

  createQuestion(question: Question): Observable<Question> {
    console.log('Creating question...', question);
    return this.http.post<Question>(`${this.apiUrl}/Questao`, question, { headers: this.getHeaders() });
  }

  createTopic(topic: Topic): Observable<Topic> {
    console.log('Creating topic...', topic);
    return this.http.post<Topic>(`${this.apiUrl}/Topico`, topic, { headers: this.getHeaders() });
  }

  updateQuestion(id: string, question: Question): Observable<Question> {
    console.log(`Updating question ID: ${id}`, question);
    return this.http.put<Question>(`${this.apiUrl}/Questao/${id}`, question, { headers: this.getHeaders() });
  }

  updateTopic(id: string, topic: Topic): Observable<Topic> {
    console.log(`Updating topic ID: ${id}`, topic);
    return this.http.put<Topic>(`${this.apiUrl}/Topico/${id}`, topic, { headers: this.getHeaders() });
  }

  deleteQuestion(id: string): Observable<void> {
    console.log(`Deleting question ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/Questao/${id}`, { headers: this.getHeaders() });
  }

  deleteTopic(id: string): Observable<void> {
    console.log(`Deleting topic ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/Topico/${id}`, { headers: this.getHeaders() });
  }
}
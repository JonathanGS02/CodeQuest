import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cadastro, Login } from './types/Cadastro';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private readonly endpointUrl = "https://localhost:7123/Cadastro";
  private readonly endpointUrlLogin = "https://localhost:7123/Cadastro/login";

  constructor(private http: HttpClient){}

  enviarCadastro(cadastro: Cadastro){
    console.log(cadastro);
    return this.http.post<Cadastro>(`${this.endpointUrl}`,cadastro)
  }

  entrar(login: Login){
    console.log(login);
    return this.http.post<Login>(`${this.endpointUrlLogin}`,login)
  }
}

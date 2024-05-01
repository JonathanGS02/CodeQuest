import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importe o serviço Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  currentForm: 'login' | 'register' | 'forgot' = 'login';
  passwordHidden: boolean = true;
  fullname: string = '';
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = ''; 

  constructor(private router: Router) { } // Injete o serviço Router

  toggleForm(form: 'login' | 'register' | 'forgot') {
    this.currentForm = form;
    // Limpar os campos quando o formulário for alterado
    this.clearFields();
  }

  togglePassword() {
    this.passwordHidden = !this.passwordHidden;
  }

  submitForm(formType: 'login' | 'register' | 'forgot', form: any) {
    if (form.valid) {
      console.log('Formulário válido. Enviando...');

      if (formType === 'register') {
        // Navegar para a tela de login após enviar o formulário de cadastro com sucesso
        this.currentForm = 'login';
        this.clearFields();
      } 

      if (formType === 'login') {
        // Lidar com o envio do formulário de login
        this.router.navigate(['/home']);
        this.clearFields();
      }

      if(formType === 'forgot') {
        this.currentForm = 'login';
        this.clearFields();
      }
    } 
  }
  

  clearFields() {
    // Limpar os campos do formulário
    this.fullname = '';
    this.email = '';
    this.confirmEmail = '';
    this.password = '';
    this.confirmPassword = '';
    this.username = '';
  }
}

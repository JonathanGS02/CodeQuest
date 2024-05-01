import { Component } from '@angular/core';

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

  toggleForm(form: 'login' | 'register' | 'forgot') {
    this.currentForm = form;
  }

  togglePassword() {
    this.passwordHidden = !this.passwordHidden;
  }

  submitForm(registerForm: any) {
    if (registerForm.valid) {
      console.log('Formulário válido. Enviando...');
    } else {
      console.log('Formulário inválido. Corrija os campos marcados.');
    }
  }
}

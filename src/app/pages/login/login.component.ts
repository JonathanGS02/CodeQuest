import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  remember: boolean = false;
  isLoading: boolean = false;

  // Propriedades FontAwesome
  faEye = 'eye';
  faEyeSlash = 'eye-slash';

  constructor(private router: Router) { } // Injete o serviço de loading

  toggleForm(form: 'login' | 'register' | 'forgot') {
    this.currentForm = form;
    this.clearFields();
  }

  togglePassword() {
    this.passwordHidden = !this.passwordHidden;
  }

  navigateTo(form: 'login' | 'register' | 'forgot') {
    this.currentForm = form;
  }

  submitForm(formType: 'login' | 'register' | 'forgot', form: any) {
    if (form.valid) {
      console.log('Formulário válido. Enviando...');

      setTimeout(() => {
        if (formType === 'register' || formType === 'forgot') {
          this.currentForm = 'login';
          this.clearFields();
        } else if (formType === 'login') {
          this.router.navigate(['/home']);
          this.clearFields();
        }
      }, 2000); // Simulação de tempo de processamento
    }
  }

  clearFields() {
    this.fullname = '';
    this.email = '';
    this.confirmEmail = '';
    this.password = '';
    this.confirmPassword = '';
    this.username = '';
  }
}

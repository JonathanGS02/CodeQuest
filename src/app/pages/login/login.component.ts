import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  currentForm: 'login' | 'register' | 'forgot' = 'login';

  toggleForm(form: 'login' | 'register' | 'forgot') {
    this.currentForm = form;
  }
}

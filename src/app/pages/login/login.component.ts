import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  currentForm: 'login' | 'register' | 'forgot' = 'login';
  passwordHidden: boolean = true;
  isLoading: boolean = false;
  profileImage: File | null = null;
  registerForm: FormGroup;
  loginForm: FormGroup;
  forgotForm: FormGroup;
  loginError: string | null = null;

  faEye = 'eye';
  faEyeSlash = 'eye-slash';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required],
      remember: [false]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]]
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')!.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')!.setErrors(null);
    }
  }

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

  submitForm(formType: 'login' | 'register' | 'forgot') {
    let form: FormGroup | undefined;
    if (formType === 'login') {
      form = this.loginForm;
    } else if (formType === 'register') {
      form = this.registerForm;
    } else if (formType === 'forgot') {
      form = this.forgotForm;
    }

    if (form && form.valid) {
      this.isLoading = true; // Iniciar carregamento
      if (formType === 'register') {
        const user: UserDto = {
          id: 0, // ou outro valor padrão
          titulo: '', // ou outro valor padrão
          userName: this.registerForm.get('userName')!.value,
          email: this.registerForm.get('email')!.value,
          password: this.registerForm.get('password')!.value,
          primeiroNome: this.registerForm.get('primeiroNome')!.value,
          ultimoNome: this.registerForm.get('ultimoNome')!.value,
          phoneNumber: '', // ou outro valor padrão
          funcao: '', // ou outro valor padrão
          descricao: '', // ou outro valor padrão
          token: '', // ou outro valor padrão
          imagemURL: '' // ou outro valor padrão
        };

        this.userService.register(user).subscribe((response: any) => {
          console.log('Usuário registrado com sucesso', response);
          this.isLoading = false; // Parar carregamento
          this.navigateTo('login');
        }, (error: any) => {
          console.error('Erro ao registrar o usuário', error);
          this.isLoading = false; // Parar carregamento
        });
      } else if (formType === 'login') {
        const credentials = {
          userName: this.loginForm.get('userName')!.value,
          password: this.loginForm.get('password')!.value
        };
        this.userService.login(credentials).subscribe((response: any) => {
          console.log('Usuário logado com sucesso', response);
          localStorage.setItem('authToken', response.token); // Armazenar o token no localStorage
          this.isLoading = false; 
          this.router.navigate(['/home']);
        }, (error: any) => {
          console.error('Erro ao fazer login', error);
          this.isLoading = false; // Parar carregamento
          this.loginError = 'Usuário ou senha incorretos';
        });
      } else if (formType === 'forgot') {
        // Implementar lógica de recuperação de senha aqui
        console.log('Recuperando senha para:', form.value);
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.profileImage = input.files[0];
    }
  }

  clearFields() {
    this.registerForm.reset();
    this.loginForm.reset();
    this.forgotForm.reset();
    this.profileImage = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

declare var bootstrap: any;

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.css']
})
export class MinhaContaComponent implements OnInit {
  user: any = {};
  selectedFile: File | null = null;
  updateForm: FormGroup;
  faCamera = faCamera;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (data: any) => {
        if (data) {
          this.user = data;
          console.log('Dados do usuário obtidos:', this.user);
        } else {
          this.userService.fetchUser();
          console.log('Dados do usuário não encontrados, solicitando fetchUser.');
        }
      },
      (error: any) => {
        console.error('Erro ao obter dados do usuário', error);
      }
    );
  }

  openModal(): void {
    const modalElement = document.getElementById('updateInfoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

    this.updateForm.patchValue({
      primeiroNome: this.user.primeiroNome,
      ultimoNome: this.user.ultimoNome,
      email: this.user.email,
      userName: this.user.userName
    });
    console.log('Formulário preenchido com dados do usuário:', this.updateForm.value);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Arquivo selecionado:', this.selectedFile);
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      console.log('Formulário válido. Iniciando upload da imagem se selecionada.');
      if (this.selectedFile) {
        this.userService.uploadImage(this.selectedFile).subscribe(
          (response: any) => {
            console.log('Resposta do upload da imagem:', response);
            this.user.imagemURL = response.imagem;
            if (response.token) {
              localStorage.setItem('authToken', response.token);
              this.user.token = response.token;
            }
            this.updateUserInfo();
          },
          (error: any) => {
            console.error('Erro ao fazer upload da imagem', error);
          }
        );
      } else {
        this.updateUserInfo();
      }
    } else {
      console.log('Formulário inválido:', this.updateForm.errors);
    }
  }

  updateUserInfo(): void {
    const token = localStorage.getItem('authToken') || '';

    const updatedUser = {
      id: this.user.id,
      titulo: this.user.titulo || '',
      userName: this.updateForm.get('userName')!.value,
      primeiroNome: this.updateForm.get('primeiroNome')!.value,
      ultimoNome: this.updateForm.get('ultimoNome')!.value,
      email: this.updateForm.get('email')!.value,
      phoneNumber: this.user.phoneNumber || '',
      funcao: this.user.funcao || '',
      descricao: this.user.descricao || '',
      password: this.user.password || '',
      token: token,
      imagem: this.user.imagemURL // Certifique-se de que o campo "Imagem" está sendo enviado corretamente
    };

    console.log('Dados enviados para atualização:', updatedUser);

    this.userService.updateUser(updatedUser).subscribe(
      (response: any) => {
        console.log('Usuário atualizado com sucesso', response);
        this.user = response; 
        console.log('Dados do usuário após atualização:', this.user);
        const modalElement = document.getElementById('updateInfoModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
      },
      (error: any) => {
        console.error('Erro ao atualizar o usuário', error);
        if (error.error && error.error.errors) {
          console.error('Detalhes do erro:', error.error.errors);
        }
      }
    );
  }
}

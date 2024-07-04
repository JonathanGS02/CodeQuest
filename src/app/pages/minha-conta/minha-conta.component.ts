import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.css']
})
export class MinhaContaComponent implements OnInit {
  user: any = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (data: any) => {
        if (data) {
          this.user = data;
        } else {
          this.userService.fetchUser();
        }
      },
      (error: any) => {
        console.error('Erro ao obter dados do usuário', error);
      }
    );
  }
}

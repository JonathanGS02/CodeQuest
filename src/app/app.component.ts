import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './loader.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "CodeQuest";
  isLoginPage = false;

  constructor(private router: Router, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.show(); // Mostrar o loading na inicialização

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started');
        this.loaderService.show(); // Mostrar o loading durante a navegação
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        console.log('Navigation ended');
        this.loaderService.hide(); // Esconder o loading após a navegação
        this.isLoginPage = this.router.url === '/login';
      }
    });

    // Para garantir que o loading apareça na atualização da página
    setTimeout(() => {
      console.log('Initial load complete');
      this.loaderService.hide();
    }, 2000); // Ajuste o tempo conforme necessário
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  abrirDropdown: boolean = false;
  constructor(){}

  toggleDropdown(event: Event): void {
    event.preventDefault(); // Evita o comportamento padrão do link
    this.abrirDropdown = !this.abrirDropdown;
  console.log(this.abrirDropdown);

  }
}

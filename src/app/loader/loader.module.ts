import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component'; 

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule],
  exports: [LoaderComponent] // Exportar o LoaderComponent para que ele possa ser usado em outros módulos
})
export class LoaderModule {}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-eliminar-usuario',
  standalone: true,
  imports: [],
  templateUrl: './modal-eliminar-usuario.html',
  styleUrl: './modal-eliminar-usuario.css',
})
export class ModalEliminarUsuario {

  usuario = input<any | null>(null);
  confirmar = output<void>();
  cerrar = output<void>();

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
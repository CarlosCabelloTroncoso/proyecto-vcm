import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ClienteVista {
  nombres_usuario: string;
  apellidos_usuario: string;
  rut_usuario: string;
  telefono_usuario?: string;
}

@Component({
  selector: 'app-modal-detalle-cliente',
  imports: [CommonModule],
  templateUrl: './modal-detalle-cliente.html',
  styleUrl: './modal-detalle-cliente.css',
})
export class ModalDetalleCliente {
  @Input() visible  = false;
  @Input() cliente: ClienteVista | null = null;

  @Output() cerrar = new EventEmitter<void>();

  get iniciales(): string {
    if (!this.cliente) return '';
    return (
      (this.cliente.nombres_usuario?.charAt(0) ?? '') +
      (this.cliente.apellidos_usuario?.charAt(0) ?? '')
    ).toUpperCase();
  }

  get nombreCompleto(): string {
    if (!this.cliente) return '';
    return `${this.cliente.nombres_usuario} ${this.cliente.apellidos_usuario}`;
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}

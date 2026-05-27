import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Modal genérico de confirmación de acciones (aprobar, rechazar, etc.).
 * Distinto al modal-confirmar que está orientado a eliminaciones (ícono/color rojo).
 *
 * Uso:
 * <app-modal-confirmar-accion
 *   [visible]="mostrar"
 *   tipo="aprobar"
 *   [titulo]="'Aprobar solicitud'"
 *   [nombreDestacado]="solicitud.titulo"
 *   [descripcion]="'¿Confirmas esta acción?'"
 *   (confirmar)="onConfirmar()"
 *   (cancelar)="cerrar()" />
 *
 * tipo: 'aprobar'  → ícono check verde
 *       'rechazar' → ícono X rojo
 *       'neutro'   → ícono info azul
 */
@Component({
  selector: 'app-modal-confirmar-accion',
  imports: [CommonModule],
  templateUrl: './modal-confirmar-accion.html',
  styleUrl: './modal-confirmar-accion.css',
})
export class ModalConfirmarAccion {
  @Input() visible          = false;
  @Input() tipo: 'aprobar' | 'rechazar' | 'neutro' = 'neutro';
  @Input() titulo           = 'Confirmar acción';
  @Input() nombreDestacado  = '';
  @Input() descripcion      = '¿Estás seguro de que deseas continuar?';
  @Input() textoConfirmar   = 'Confirmar';
  @Input() textoCancelar    = 'Cancelar';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar  = new EventEmitter<void>();

  get claseIconoFondo(): string {
    return {
      aprobar:  'bg-emerald-100',
      rechazar: 'bg-red-100',
      neutro:   'bg-[#1B3A6B]/10',
    }[this.tipo];
  }

  get claseIconoColor(): string {
    return {
      aprobar:  'text-emerald-600',
      rechazar: 'text-red-500',
      neutro:   'text-[#1B3A6B]/60',
    }[this.tipo];
  }

  get claseBoton(): string {
    return {
      aprobar:  'bg-emerald-600 hover:bg-emerald-700',
      rechazar: 'bg-red-500    hover:bg-red-600',
      neutro:   'bg-[#1B3A6B]  hover:bg-[#16315b]',
    }[this.tipo];
  }
}

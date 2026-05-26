import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Modal genérico de confirmación de eliminación.
 * Reutilizable en cualquier módulo del panel admin.
 *
 * Uso:
 * <app-modal-confirmar
 *   [visible]="mostrarModalEliminar"
 *   [nombreDestacado]="'Juan Pérez'"
 *   (confirmar)="eliminar()"
 *   (cancelar)="cerrar()" />
 */
@Component({
  selector: 'app-modal-confirmar',
  imports: [CommonModule],
  templateUrl: './modal-confirmar.html',
  styleUrl: './modal-confirmar.css',
})
export class ModalConfirmar {
  @Input() visible          = false;
  @Input() titulo           = 'Eliminar registro';
  @Input() nombreDestacado  = '';
  @Input() descripcion      = '¿Estás seguro? Esta acción no se puede deshacer.';
  @Input() textoConfirmar   = 'Sí, eliminar';
  @Input() textoCancelar    = 'Cancelar';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar  = new EventEmitter<void>();
}

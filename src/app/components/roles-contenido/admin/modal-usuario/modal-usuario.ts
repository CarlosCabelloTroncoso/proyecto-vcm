import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-usuario.html',
  styleUrl: './modal-usuario.css',
})
export class ModalUsuario implements OnInit {

  usuario = input<any | null>(null);
  guardar = output<any>();
  cerrar = output<void>();

  form!: FormGroup;
  esEdicion = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const u = this.usuario();
    this.esEdicion = !!u;

    this.form = this.fb.group({
      id:     [u?.id ?? null],
      nombre: [u?.nombre ?? '', [Validators.required, Validators.minLength(2)]],
      rut:    [u?.rut ?? '', [Validators.required]],
      correo: [u?.correo ?? '', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.form.getRawValue());
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
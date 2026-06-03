import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarUsuario } from './modal-eliminar-usuario';

describe('ModalEliminarUsuario', () => {
  let component: ModalEliminarUsuario;
  let fixture: ComponentFixture<ModalEliminarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

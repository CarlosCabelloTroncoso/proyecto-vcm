import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAlumno } from './gestion-alumno';

describe('GestionAlumno', () => {
  let component: GestionAlumno;
  let fixture: ComponentFixture<GestionAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAlumno],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionAlumno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

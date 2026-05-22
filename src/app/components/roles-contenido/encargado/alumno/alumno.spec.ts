import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alumno } from './alumno';

describe('Alumno', () => {
  let component: Alumno;
  let fixture: ComponentFixture<Alumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alumno],
    }).compileComponents();

    fixture = TestBed.createComponent(Alumno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

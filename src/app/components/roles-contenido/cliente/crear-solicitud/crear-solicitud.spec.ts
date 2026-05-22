import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitud } from './crear-solicitud';

describe('CrearSolicitud', () => {
  let component: CrearSolicitud;
  let fixture: ComponentFixture<CrearSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSolicitud],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearSolicitud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

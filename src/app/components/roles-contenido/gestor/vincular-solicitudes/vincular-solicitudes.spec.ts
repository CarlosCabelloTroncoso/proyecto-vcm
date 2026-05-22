import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularSolicitudes } from './vincular-solicitudes';

describe('VincularSolicitudes', () => {
  let component: VincularSolicitudes;
  let fixture: ComponentFixture<VincularSolicitudes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VincularSolicitudes],
    }).compileComponents();

    fixture = TestBed.createComponent(VincularSolicitudes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

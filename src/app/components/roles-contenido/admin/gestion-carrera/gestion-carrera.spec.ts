import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCarrera } from './gestion-carrera';

describe('GestionCarrera', () => {
  let component: GestionCarrera;
  let fixture: ComponentFixture<GestionCarrera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCarrera],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionCarrera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

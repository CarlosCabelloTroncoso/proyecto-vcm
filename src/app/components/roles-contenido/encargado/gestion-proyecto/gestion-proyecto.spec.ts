import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProyecto } from './gestion-proyecto';

describe('GestionProyecto', () => {
  let component: GestionProyecto;
  let fixture: ComponentFixture<GestionProyecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionProyecto],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionProyecto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

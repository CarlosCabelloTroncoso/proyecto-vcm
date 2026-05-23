import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFacultad } from './gestion-facultad';

describe('GestionFacultad', () => {
  let component: GestionFacultad;
  let fixture: ComponentFixture<GestionFacultad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionFacultad],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionFacultad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

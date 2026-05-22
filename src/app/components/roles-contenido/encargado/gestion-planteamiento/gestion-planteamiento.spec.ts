import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlanteamiento } from './gestion-planteamiento';

describe('GestionPlanteamiento', () => {
  let component: GestionPlanteamiento;
  let fixture: ComponentFixture<GestionPlanteamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlanteamiento],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionPlanteamiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

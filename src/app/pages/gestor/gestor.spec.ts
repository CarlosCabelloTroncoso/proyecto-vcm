import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gestor } from './gestor';

describe('Gestor', () => {
  let component: Gestor;
  let fixture: ComponentFixture<Gestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gestor],
    }).compileComponents();

    fixture = TestBed.createComponent(Gestor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

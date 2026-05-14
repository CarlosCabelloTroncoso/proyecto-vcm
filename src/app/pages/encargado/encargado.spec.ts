import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encargado } from './encargado';

describe('Encargado', () => {
  let component: Encargado;
  let fixture: ComponentFixture<Encargado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encargado],
    }).compileComponents();

    fixture = TestBed.createComponent(Encargado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

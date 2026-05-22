import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Autoridad } from './autoridad';

describe('Autoridad', () => {
  let component: Autoridad;
  let fixture: ComponentFixture<Autoridad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autoridad],
    }).compileComponents();

    fixture = TestBed.createComponent(Autoridad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

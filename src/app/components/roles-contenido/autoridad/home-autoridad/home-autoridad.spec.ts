import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAutoridad } from './home-autoridad';

describe('HomeAutoridad', () => {
  let component: HomeAutoridad;
  let fixture: ComponentFixture<HomeAutoridad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAutoridad],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeAutoridad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

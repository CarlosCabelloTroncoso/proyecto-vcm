import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAutoridad } from './navbar-autoridad';

describe('NavbarAutoridad', () => {
  let component: NavbarAutoridad;
  let fixture: ComponentFixture<NavbarAutoridad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAutoridad],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarAutoridad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

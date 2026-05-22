import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarProfesor } from './navbar-profesor';

describe('NavbarProfesor', () => {
  let component: NavbarProfesor;
  let fixture: ComponentFixture<NavbarProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarProfesor],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarProfesor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

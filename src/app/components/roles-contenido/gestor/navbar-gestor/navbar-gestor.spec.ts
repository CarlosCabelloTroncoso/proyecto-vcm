import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarGestor } from './navbar-gestor';

describe('NavbarGestor', () => {
  let component: NavbarGestor;
  let fixture: ComponentFixture<NavbarGestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarGestor],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarGestor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

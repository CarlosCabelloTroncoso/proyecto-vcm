import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarEncargado } from './navbar-encargado';

describe('NavbarEncargado', () => {
  let component: NavbarEncargado;
  let fixture: ComponentFixture<NavbarEncargado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarEncargado],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarEncargado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

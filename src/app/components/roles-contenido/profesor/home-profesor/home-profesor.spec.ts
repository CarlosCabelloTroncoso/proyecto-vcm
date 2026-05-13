import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProfesor } from './home-profesor';

describe('HomeProfesor', () => {
  let component: HomeProfesor;
  let fixture: ComponentFixture<HomeProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProfesor],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeProfesor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

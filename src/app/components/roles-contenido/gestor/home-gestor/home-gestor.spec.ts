import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGestor } from './home-gestor';

describe('HomeGestor', () => {
  let component: HomeGestor;
  let fixture: ComponentFixture<HomeGestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGestor],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGestor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Planteamientos } from './planteamientos';

describe('Planteamientos', () => {
  let component: Planteamientos;
  let fixture: ComponentFixture<Planteamientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planteamientos],
    }).compileComponents();

    fixture = TestBed.createComponent(Planteamientos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

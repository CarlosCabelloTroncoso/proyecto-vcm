import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentHome } from './content-home';

describe('ContentHome', () => {
  let component: ContentHome;
  let fixture: ComponentFixture<ContentHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

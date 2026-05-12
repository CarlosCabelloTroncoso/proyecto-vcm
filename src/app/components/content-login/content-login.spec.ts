import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLogin } from './content-login';

describe('ContentLogin', () => {
  let component: ContentLogin;
  let fixture: ComponentFixture<ContentLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

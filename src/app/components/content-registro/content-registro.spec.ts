import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentRegistro } from './content-registro';

describe('ContentRegistro', () => {
  let component: ContentRegistro;
  let fixture: ComponentFixture<ContentRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentRegistro],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentRegistro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

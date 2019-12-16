import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeradorPage } from './moderador.page';

describe('ModeradorPage', () => {
  let component: ModeradorPage;
  let fixture: ComponentFixture<ModeradorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeradorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

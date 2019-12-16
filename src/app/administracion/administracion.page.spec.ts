import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionPage } from './administracion.page';

describe('AdministracionPage', () => {
  let component: AdministracionPage;
  let fixture: ComponentFixture<AdministracionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

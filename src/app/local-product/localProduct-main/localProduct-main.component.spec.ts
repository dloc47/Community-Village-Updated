/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LocalProductMainComponent } from './localProduct-main.component';

describe('LocalProductMainComponent', () => {
  let component: LocalProductMainComponent;
  let fixture: ComponentFixture<LocalProductMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalProductMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalProductMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

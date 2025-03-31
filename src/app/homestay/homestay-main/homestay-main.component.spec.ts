/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomestayMainComponent } from './homestay-main.component';

describe('HomestayMainComponent', () => {
  let component: HomestayMainComponent;
  let fixture: ComponentFixture<HomestayMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomestayMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomestayMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

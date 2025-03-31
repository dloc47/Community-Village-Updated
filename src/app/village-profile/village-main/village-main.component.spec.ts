/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VillageMainComponent } from './village-main.component';

describe('VillageMainComponent', () => {
  let component: VillageMainComponent;
  let fixture: ComponentFixture<VillageMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VillageMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VillageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

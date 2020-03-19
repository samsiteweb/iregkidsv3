import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgRegComponent } from './org-reg.component';

describe('OrgRegComponent', () => {
  let component: OrgRegComponent;
  let fixture: ComponentFixture<OrgRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawDashboardComponent } from './raw-dashboard.component';

describe('RawDashboardComponent', () => {
  let component: RawDashboardComponent;
  let fixture: ComponentFixture<RawDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

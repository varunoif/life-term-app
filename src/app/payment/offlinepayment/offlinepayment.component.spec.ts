import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinepaymentComponent } from './offlinepayment.component';

describe('OfflinepaymentComponent', () => {
  let component: OfflinepaymentComponent;
  let fixture: ComponentFixture<OfflinepaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinepaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

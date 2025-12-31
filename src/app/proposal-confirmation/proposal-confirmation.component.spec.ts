import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalConfirmationComponent } from './proposal-confirmation.component';

describe('ProposalConfirmationComponent', () => {
  let component: ProposalConfirmationComponent;
  let fixture: ComponentFixture<ProposalConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

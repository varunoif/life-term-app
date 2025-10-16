import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ConfirmationComponent } from './confirmation/confirmation.component';
//import { FailureComponent } from './failure/failure.component';
import { OfflinepaymentComponent } from './offlinepayment/offlinepayment.component';

const routes: Routes = [
  //{ path: 'confirmation/:id', component: ConfirmationComponent },
  { path: 'offlinepayment/:id', component: OfflinepaymentComponent },
  //{ path: 'failure/:id', component: FailureComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }

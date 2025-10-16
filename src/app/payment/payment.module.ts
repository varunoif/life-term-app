import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatOptionModule,
  MatStepperModule,
  MatToolbarModule,
  MatListModule,
} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

//import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';

import { PaymentRoutingModule } from './payment-routing.module';
//import { ConfirmationComponent } from './confirmation/confirmation.component';
//import { FailureComponent } from './failure/failure.component';
import { OfflinepaymentComponent } from './offlinepayment/offlinepayment.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  //declarations: [ConfirmationComponent, FailureComponent, OfflinepaymentComponent],
  declarations: [ OfflinepaymentComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule, 
    MatSidenavModule,
    MatCheckboxModule, 
    MatRadioModule, 
    MatFormFieldModule,
    MatOptionModule, 
    MatStepperModule, 
    MatToolbarModule, 
    MatListModule,
    //NgxMatSelectSearchModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  exports:[MatNativeDateModule,MatRippleModule],
})
export class PaymentModule { }

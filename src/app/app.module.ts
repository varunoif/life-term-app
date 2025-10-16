import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuoteComponent } from './quote/quote.component';
import {MatStepperModule} from '@angular/material/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// tslint:disable-next-line: max-line-length
import {MatMenuModule, MatButtonModule, MatIconModule, MatSidenavModule, MatCheckboxModule, MatRadioModule, MatFormFieldModule, MatOptionModule,  MatInputModule,  MatToolbarModule, MatListModule, MatSnackBarModule, MatCardModule, MatTableModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './common/header/header.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './not-found/not-found.component';
import { FooterComponent } from './common/footer/footer.component';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { TextMaskModule } from 'angular2-text-mask';
import { PartnerLoginComponent } from './partner-login/partner-login.component';
import { PartnerRegistrationComponent } from './partner-registration/partner-registration.component';

@NgModule({
	declarations: [
		AppComponent,
		QuoteComponent,
		HeaderComponent,
		NotFoundComponent,
		FooterComponent,
		PartnerLoginComponent,
	
		PartnerRegistrationComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		MatStepperModule,
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
		MatInputModule,
		MatStepperModule,
		MatToolbarModule,
		MatListModule,
		BrowserAnimationsModule,
		MatSelectModule,
		MatChipsModule,
		MatButtonToggleModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatDialogModule,
		MatExpansionModule,
		MatSliderModule,
		MatBottomSheetModule,
		HttpClientModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
    	MatCardModule,
   		MatTableModule,
   		TextMaskModule,
		DeviceDetectorModule.forRoot(),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [MatNativeDateModule],
	bootstrap: [AppComponent]
})
export class AppModule { }

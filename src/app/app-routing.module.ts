import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuoteComponent } from './quote/quote.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ProposalConfirmationComponent } from './proposal-confirmation/proposal-confirmation.component';
//import { PartnerLoginComponent } from './partner-login/partner-login.component';
//import { PartnerRegistrationComponent } from './partner-registration/partner-registration.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: QuoteComponent
	},	
	// {
	// 	path: 'term-life/partner-login',
	// 	pathMatch: 'full',
	// 	component: PartnerLoginComponent
	// },	
	// {
	// 	path: 'term-life/partner-registration',
	// 	pathMatch: 'full',
	// 	component:PartnerRegistrationComponent 
	// },	
	{
		path: 'listing/qid/:quoteId',
		pathMatch: 'full',
		loadChildren: () => import('./premiumlisting/premiumlisting.module').then(m => m.PremiumlistingModule),
	},
	{
		path:'proposal/qid/:quoteId',
		pathMatch:'full',
		component:ProposalComponent
	},
	{
		path:'proposal-confirmation/qid/:quoteId',
		pathMatch:'full',
		component:ProposalConfirmationComponent
	},
	{	path: 'payment', 
		loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
	},
	{path: '404', pathMatch: 'full', component: NotFoundComponent },
	{path: '**', pathMatch: 'full', redirectTo: '/404' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

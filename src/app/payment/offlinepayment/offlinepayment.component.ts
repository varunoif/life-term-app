import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { $ } from 'protractor';

import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../services/seo.service';
import { SubSink } from 'subsink';

@Component({
	selector: 'app-offlinepayment',
	templateUrl: './offlinepayment.component.html',
	styleUrls: ['./offlinepayment.component.scss', '../../../assets/tpOffline/css/main.css']
})
export class OfflinepaymentComponent implements OnInit, OnDestroy {
	
	// ASSIGN SUBSINK
	private subscribeList = new SubSink();
	
	policyDcoumentForm: FormGroup;
	providerId: any = "";
	transactionStatus: any = "";
	transactionMsg: any = "";
	policyDownloadURL: any = "";
	policyNo: any = "NA";
	transactionNo: any = "";
	proposalNo: any = "";
	paymentMethod: any = "";
	orderStatus: any = "";
	productCode: any = "";
	premiumJson: any;
	proposalJson: any;
	paymentJson: any;
	quoteJson:any;
	showPremiumdata: boolean = false;
	COMPANY_LOGO = '';
	COMPANY_NAME = '';
	OWNER_NAME = '';
	APIURL: string = "";
	TOTAL_PREMIUM: any = 0.0;
	paymentStatus = 0;
	showPaymentTable = true;
	uploadedFiles: Array<File>;
	public formData = new FormData();
	userCode:any;
	quoteId:any;
	loading=false;
	public dialogRef: any;
	skvp_message='';
	documentDiv = false;
	BASE_URL:any;
	
	pageTitle: string	= 'Best Term Life Insurance : Compare & Buy 1 Cr Life Cover @ 18/day.';

	constructor(
		public dialog: MatDialog,
		private route: ActivatedRoute, 
		private apiService: ApiService, 
		protected localStorage: LocalStorage, 
		public fb: FormBuilder,
		private titleService: Title,
		private metaService: Meta,
		private seoService: SeoService,
	) {
		//this.APIURL = this.apiService.getServiceURL();
	}
	
	// UPDATE SEO META TAGS
	setSeoTagsData() {		
		let date = new Date();
		let day	=date.getDate();
		let month = date.toLocaleString('default', { month: 'long' });
		let year	=date.getFullYear();
		let full_date	=`${day} ${month}, ${year}`;
		
		const metaKeyWords	='term life insurance, term insurance, life insurance, best term plan, buy best term plan policy, term life plans, term plan';
		const metaDescription	=`Buy the best term life insurance plan online in India for lowest price. Compare and buy the best term insurance plans starting at just Rs. 18 per day. ${full_date}`;	
		this.seoService.setpageTitle(this.pageTitle + full_date);
		this.seoService.createLinkForCanonicalURL('https://www.gibl.in/term-life-insurance/');
		this.seoService.setMetaData(metaKeyWords, metaDescription);
	}

	ngOnInit() {
		this.setSeoTagsData();
		this.BASE_URL=this.apiService.getBaseURL();
		this.policyDcoumentForm = this.fb.group({
			doc1: ['',Validators.required],
			doc2: ['',Validators.required],
			doc3: ['',Validators.required]
		});
		this.getPremiumJson();
		this.subscribeList.add(
			this.localStorage.getItem('quoteJson').subscribe((data:any) => { 
				this.quoteId=data.quote_id;
				console.log(this.quoteId);
			})
		);
		this.subscribeList.add(
			this.localStorage.getItem('userJson').subscribe((data:any) => {
				this.userCode=data.user_code;
				console.log(this.userCode);
			})
		);
	}
	
	homepage(){
		window.location.href=this.BASE_URL;
	}
	
	uploadPrevPolicycopy(file) {
		this.formData.append("prev_pol_no", file[0], file[0]['name']);
	}
	
	uploadRCcopyFront(file) {
		this.formData.append("rc_copy_front", file[0], file[0]['name']);
	}
	
	uploadRCcopyBack(file) {
		this.formData.append("rc_copy_back", file[0], file[0]['name']);
	}
	
	uploadPolicyDocSubmit() {
		this.onNoClick();
		/*if (this.policyDcoumentForm.invalid) {
			return;
		}
		else {
			this.formData.append('userCode',this.userCode);
			this.formData.append('quoteId',this.quoteId);
			this.formData.append('response_track_id',this.proposalNo);
			this.loading=true;
			this.apiService.motor_policy_upload(this.formData).subscribe(data => {
				var res:any=data;
				
				if(res.success){
					this.loading=false;
					this.documentDiv=false;
					//$('.document_upload').hide();
					//this.showPaymentTable=true;
				}
			});
		}*/
	}
	
	getPremiumJson() {
		this.subscribeList.add(
			this.localStorage.getItem('premiumJson').subscribe((data) => {
				this.premiumJson = data;
				console.log('Fullo premium json:=>', this.premiumJson);
				this.showPremiumdata = true;
				this.TOTAL_PREMIUM = this.premiumJson.annual_premium;
				this.COMPANY_LOGO = this.premiumJson.company_logo;
				this.COMPANY_NAME = this.premiumJson.company_name;
				
				this.route.params.subscribe(params => {
					this.providerId = params.id;
					this.offlinePaymentProcess();
				});
			})
		);
		
		/*this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumJson = data;
			console.log('getPremiumJson',this.premiumJson.SKVP)
			this.TOTAL_PREMIUM = this.premiumJson.TOTAL_PREMIUM;
			this.COMPANY_LOGO = this.premiumJson.COMPANY_LOGO;
			this.COMPANY_NAME = this.premiumJson.COMPANY_NAME;
			this.showPremiumdata = true;
			this.route.params.subscribe(params => {
				this.providerId = params.id;
				this.offlinePaymentProcess();
			});
			if(this.premiumJson.SKVP == true){
				this.skvp_message = 'Thank You For Paying Through SKVPAY';
				console.log('skvp_message',this.skvp_message)
			}
		});
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson = data;
			this.OWNER_NAME = this.proposalJson.personalDetailForm.custTitle + ' ' + this.proposalJson.personalDetailForm.custName;
		});*/
	}
	
	offlinePaymentProcess() {
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.transactionNo = queryArr[0];
			this.proposalNo = queryArr[1]; //Or, Order No
			this.paymentStatus = queryArr[3];
			this.paymentMethod = queryArr[2];
			if( this.paymentMethod == 'null' ){
				console.log('pay', this.paymentMethod);
				this.paymentMethod	='';
			}
			
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
				this.OWNER_NAME = this.quoteJson.custName;
			})
			/*if(this.paymentStatus ==1){				
				let userTrackData={
					"unique_id":this.quoteJson.uniqueID,
					"quote_id":this.quoteJson.quoteID,
					"page_id":"7",
					"created_by":this.quoteJson.source_user,						
				};					
				this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
					console.log('Tracking data payment success confirmation',data);
				});			
			}else{				
				let userTrackData={
					"unique_id":this.quoteJson.uniqueID,
					"quote_id":this.quoteJson.quoteID,
					"page_id":"8",
					"created_by":this.quoteJson.source_user,						
				};
				
				this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
					console.log('Tracking data payment failed confirmation',data);
				});				
			}*/
			if (this.paymentMethod == 'WALLET OFFLINE') {
				this.showPaymentTable = false;
			}
		});
	}
	onNoClick() {
		this.dialogRef.close();
	}
	openDialog(content): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '200px',
		});
		this.dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}
	
	// FUNCTION TO DESTRY COMPONENET
	ngOnDestroy() {
	    this.subscribeList.unsubscribe();
	}

}

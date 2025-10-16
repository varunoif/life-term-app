import { Component, OnInit, ViewEncapsulation, Inject, ViewChild, AfterViewChecked, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../commonShare/date.adapter';
import { MatStepper } from '@angular/material/stepper';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';

import {
	MatSnackBar,
	MatSnackBarConfig,
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SeoService } from '../services/seo.service';

import { Title, Meta } from '@angular/platform-browser';
import { SubSink } from 'subsink';

export interface PeriodicElement {
	company: string;
	plan_name: string;
	settlement: string;
	maturity_age: string;
	premium: string;
}

@Component({
	selector: 'app-quote',
	templateUrl: './quote.component.html',
	styleUrls: ['./quote.component.scss', '../../assets/quote/css/main.css'],

	// encapsulation: ViewEncapsulation.None,
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
	},
	{
		provide: DateAdapter, useClass: AppDateAdapter
	},
	{
		provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
	}
	]
})
export class QuoteComponent implements OnInit, AfterViewChecked, OnDestroy {
	// ASSIGN SUBSINK
	private subscribeList = new SubSink();
	// GET RANDOM NO
	public randomNo: number = Date.now();
	deviceInfo: any;
	device_info: any;
	isLinear: boolean = true;
	typesOfShoes: string[] = ['Self', 'Son', 'Father', 'Grand Father', 'Father-in_law', 'Wife'];
	typesOfShoes1: string[] = ['Self', 'Son', 'Father', 'Grand Father', 'Father-in_law', 'Wife'];

	// CMS CONTENT TBALE DATA
	public ELEMENT_DATA: PeriodicElement[] = [
		{ company: 'Tata AIA', plan_name: 'Tata Sampoorna Raksha Lumpsum', settlement: '99.1%', maturity_age: '100 years', premium: 'Rs. 1001*/PM' },
		{ company: 'HDFC Life', plan_name: 'Hdfc Click2 Protect 3D Plus', settlement: '99%', maturity_age: '85 years', premium: 'Rs. 1023*/PM' },
		{ company: 'Max Life', plan_name: 'Smart Term Plan - Lumpsum Variant', settlement: '99.22%', maturity_age: '85 Years', premium: 'As per criteria' },
		{ company: 'ICICI Prudential', plan_name: 'iProtect Smart Lumpsum', settlement: '98.6%', maturity_age: '85 years', premium: 'Rs. 1017*/PM' },
		{ company: 'Edelweiss Tokio', plan_name: 'Zindagi Plus+ Lump sum', settlement: '97.8%', maturity_age: '80 years', premium: 'Rs. 780*/PM' },
		{ company: 'Reliance Nippon Life Insurance', plan_name: 'Reliance Digi-Term', settlement: '97.71%', maturity_age: '75 years', premium: 'Rs. 890*/PM' },
		{ company: 'Reliance Nippon Life Insurance', plan_name: 'Enhanced Life Secure', settlement: '97.71%', maturity_age: '75 years', premium: 'Rs. 1414*/PM' },
		{ company: 'Kotak Life', plan_name: 'Kotak e-Term Plan', settlement: '97.4%', maturity_age: '75 years', premium: 'Rs. 976*/PM' },
		{ company: 'Bharti Axa', plan_name: 'online term + Lumsum', settlement: '97.3%', maturity_age: '85 years', premium: 'Rs. 900*/PM' },
		{ company: 'Aditya Birla Sun Life Insurance', plan_name: 'ABSLI DigiShield Plan', settlement: '97.1%', maturity_age: '85 years', premium: 'Rs. 1037*/PM' },
		{ company: 'Exide Life', plan_name: 'Exide Life Smart', settlement: '97%', maturity_age: '65 years', premium: 'Rs. 1331*/PM' },
		{ company: 'SBI Life', plan_name: 'eShield', settlement: '96.8%', maturity_age: '80 years', premium: 'Rs. 1125*/PM' },
		{ company: 'SBI Life', plan_name: 'Poorna Suraksha', settlement: '96.8%', maturity_age: '65 years', premium: 'Rs. 2987*/PM' },
		{ company: 'DHFL', plan_name: 'Pramerica Life', settlement: '96.6%', maturity_age: '75 years', premium: 'Rs. 912*/PM' },
		{ company: 'Aegon Life', plan_name: 'iTerm Life Protect', settlement: '96.5%', maturity_age: '100 years', premium: 'Rs. 757*/PM' },
		{ company: 'Aegon Life', plan_name: 'iTerm Life Protect', settlement: '96.5%', maturity_age: '100 years', premium: 'Rs. 757*/PM' },
		{ company: 'IDBI', plan_name: 'IDBI Federal iSurance Flexi Lump Sum Plan', settlement: '96.2%', maturity_age: '80 years', premium: 'Rs. 1013*/PM' },
		{ company: 'PNB Metlife', plan_name: 'Mera Term Plan-Full Lumpsum Payout', settlement: '96.2%', maturity_age: '99 years', premium: 'Rs. 955*/PM' },
		{ company: 'Aviva Life Insurance', plan_name: 'Aviva iTerm Smart', settlement: '96%', maturity_age: '80 years', premium: 'Rs. 842*/PM' },
		{ company: 'Aviva Life Insurance', plan_name: 'iLife Total Protect', settlement: '96%', maturity_age: '75 years', premium: 'Rs. 971*/PM' },
		{ company: 'Future Generali', plan_name: 'Future Generali Flexi Online Term-Lumpsum', settlement: '95.2%', maturity_age: '75 years', premium: 'Rs. 885*/PM' },
		{ company: 'Canara HSBC OBC Life Insurance', plan_name: 'iSelect Lumpsum', settlement: '95.2%', maturity_age: '75 years', premium: 'Rs. 796/PM*' },
		{ company: 'Bajaj Allianz', plan_name: 'eTouch Lump Sum', settlement: '95%', maturity_age: '75 years', premium: 'Rs. 1128*/PM' },
		{ company: 'India First', plan_name: 'e-Term Plan', settlement: '94.2%', maturity_age: '75 years', premium: 'Rs. 780*/PM' }
	];

	displayedColumns: string[] = ['Insurance Company', 'Term Plan Name', 'Claim Settlement Ratio', 'Max Maturity Age', 'Premium (for a Cover of 1 Crore)'];
	dataSource = this.ELEMENT_DATA;
	source_user: string = "100173";

	// SET FORM DEFAULT OPTIONS
	public annualIncomeList: any[] = [
		// {id: '0', text: '< 2 Lac'},
		// {id: '1', text: '2-5 Lac'},
		{ id: '1', text: '< 5 Lac' },
		{ id: '2', text: '5-7 Lac' },
		{ id: '3', text: '7-10 Lac' },
		{ id: '4', text: '10-15 Lac' },
		{ id: '5', text: '15-20 Lac' },
		{ id: '6', text: '20 Lac & Above' }
	];

	quoteJson: any;
	userJson: any;
	firstFormGroup: FormGroup;
	// secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	customerFormStep2: FormGroup;
	customerFormStep3: FormGroup;
	customerFormStep4: FormGroup;
	customerFormStep5: FormGroup;

	// tslint:disable-next-line: no-inferrable-types
	public focusState: boolean = true;
	public quoteFormSubmitBtn: boolean = false;

	// ASSIGN STEPPER OBJECT
	@ViewChild('stepper', { static: false }) stepper: MatStepper;
	@ViewChild('vstepper', { static: false }) vstepper: MatStepper;

	// ASSIGN INPUT FORM FIELD
	@ViewChild('customerDOB', { static: false }) customerDOB: ElementRef;
	@ViewChild('custMob', { static: false }) custMob: ElementRef;
	@ViewChild('custName', { static: false }) custName: ElementRef;
	@ViewChild('custEmail', { static: false }) custEmail: ElementRef;
	@ViewChild('custQualification', { static: false }) custQualification: ElementRef;
	@ViewChild('custcustPincodeEmail', { static: false }) custPincode: ElementRef;

	public genderValue: string;

	dobMaxDate: any;
	curDate: any = new Date();
	maxDOB: any = new Date();
	minDOB: any = new Date();
	defaultCountryCode: any;
	defaultTerm: number = 25;
	defaultSumAssured: number = 50;

	completeQuoteFormData: any = {};

	// LOADER BEFORE NAVIGATE TO LISTING PAGE
	// tslint:disable-next-line: no-inferrable-types
	displayListingLoader: boolean = false;
	// TERM AGE RANGE ARRAY DETAILS
	termRange: any[] = [];
	showPageContent: boolean = false;

	pageTitle: string = 'Best Term Life Insurance : Compare & Buy 1 Cr Life Cover @ 18/day.';
	globalTerm: boolean = false;
	termBaseUrl: string = 'https://www.gibl.in/term-life-insurance/';
	public spinnerColor: any = 'primary';
	public spinnerMode: any = 'indeterminate';
	public redirectSpinnerShow: boolean = false;

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'bottom';
	// DATE FIELD MASKING REGULAR EXPRESSION FOR DD/MM/YYYY FORMAT
	dobMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
	localWindow: any;
	progressValue:number = 0;
	constructor(
		private _formBuilder: FormBuilder,
		private router: Router,
		protected localStorage: LocalStorage,
		private apiService: ApiService,
		private seoService: SeoService,
		private cdr: ChangeDetectorRef,
		private titleService: Title,
		private metaService: Meta,
		private route: ActivatedRoute,
		private _snackBar: MatSnackBar,
		private _elementRef: ElementRef,
		private deviceService: DeviceDetectorService,
	) { }

	ngAfterViewChecked() {
		this.showPageContent = true;
		this.cdr.detectChanges();
	}

	hasValues: any = (obj) => Object.values(obj).some(v => v !== null && typeof v !== 'undefined');

	ngOnInit() {
		// CALL SEO SERVICES
		this.progressValue = 0;
		this.setSeoTagsData();

		// CALL AUTO REDIRECT
		this.checkQuoteAutoRedirect();

		this.subscribeList.add(
			this.localStorage.getItem('userJson').subscribe((data) => {
				this.userJson = data;
				console.log('User my data:=>', data);
			})
		);
		this.genderValue = 'M';
		this.defaultCountryCode = 91;
		this.maxDOB.setFullYear(this.curDate.getFullYear() - 18);
		this.maxDOB.setMonth(this.curDate.getMonth());
		this.maxDOB.setDate(this.curDate.getDate());

		this.minDOB.setFullYear(this.curDate.getFullYear() - 70);
		this.minDOB.setMonth(this.curDate.getMonth());
		this.minDOB.setDate(this.curDate.getDate());

		// SET TERM AGE RANGE ARRAY
		this.termRange = [...Array(81).keys()].filter((counter) => counter > 4).map(i => i);

		this.firstFormGroup = this._formBuilder.group({
			// tslint:disable-next-line: max-line-length
			custMob: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
			// tslint:disable-next-line: max-line-length
			custCuntryCode: [this.defaultCountryCode, [Validators.required, Validators.pattern(/^\d{2,3}$/)]],
			customerDOB: ['', [Validators.required, Validators.pattern(/(\d{2})\/(\d{2})\/(\d{4})/), this.checkAgeRestriction]],
			customerFormatDOB: [''],
			custAge: ['', Validators.required],
			//termType: ['T', [ Validators.required ]],
			customerGender: [this.genderValue, [Validators.required]],
			custName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(\w.+\s).+$/), this.noWhitespaceValidator]],
			custEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), this.noWhitespaceValidator]],
			custPincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
			custQualification: ['', [Validators.required]]
		});
		this.thirdFormGroup = this._formBuilder.group({});
		this.customerFormStep2 = this._formBuilder.group({
			customerSmoker: ['', [Validators.required]]
		});
		this.customerFormStep3 = this._formBuilder.group({
			customerIncome: ['', [Validators.required, this.nonNegativeValidator]]
		});
		this.customerFormStep4 = this._formBuilder.group({
			customerEmpStatus: ['', [Validators.required]],
			// tslint:disable-next-line: max-line-length
			custTerm: [this.defaultTerm, [Validators.required, Validators.pattern(/^\d{1,2}$/), Validators.maxLength(2), Validators.minLength(1), Validators.min(5), Validators.max(81)]],
			custSumAssured: [this.defaultSumAssured, [Validators.required, Validators.pattern(/^\d{2,5}$/), Validators.min(25), Validators.max(10000)]]
		});
		this.getPreFormValue();

		// GET DEVICE DETAILS
		this.getDeviceDetails();
	}
	nonNegativeValidator(control: AbstractControl): ValidationErrors | null {
		const value = +control.value; // ensure number
		if (value < 0 || Object.is(value, -0)) {
			return { nonNegative: true };
		}
		return null;
	}
	// UPDATE SEO META TAGS
	setSeoTagsData() {
		let date = new Date();
		let day = date.getDate();
		let month = date.toLocaleString('default', { month: 'long' });
		let year = date.getFullYear();
		let full_date = `${day} ${month}, ${year}`;

		const metaKeyWords = 'term life insurance, term insurance, life insurance, best term plan, buy best term plan policy, term life plans, term plan';
		const metaDescription = `Buy the best term life insurance plan online in India for lowest price. Compare and buy the best term insurance plans starting at just Rs. 18 per day. ${full_date}`;
		this.seoService.setpageTitle(this.pageTitle + full_date);
		this.seoService.createLinkForCanonicalURL('https://www.gibl.in/term-life-insurance/');
		this.seoService.setMetaData(metaKeyWords, metaDescription);

		this.seoService.removeH1Tag();
	}

	// FUNCTION TO GET PRE FILLED FORM VALUES
	getPreFormValue() {
		// SET DEFAULT SOME FORM VALUES
		this.firstFormGroup.get('custCuntryCode').setValue(this.defaultCountryCode);
		this.customerFormStep4.get('custSumAssured').setValue(this.defaultSumAssured);
		this.customerFormStep4.get('custTerm').setValue(this.defaultTerm);
		this.firstFormGroup.get('customerGender').setValue(this.genderValue.toString());

		this.subscribeList.add(
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
				if (data) {
					// console.log('Localstorage::',this.quoteJson);
					// this.setPreFormValue();
				}
			})
		);
	}
	// SET FORM PRE FILLED VALUES
	setPreFormValue() {
		if (this.quoteJson.custCuntryCode !== '') {
			this.defaultCountryCode = this.quoteJson.custCuntryCode;
		}

		if (this.quoteJson.custSumAssured !== '') {
			this.defaultSumAssured = this.quoteJson.custSumAssured / 100000;
		}

		if (this.quoteJson.custTerm !== '') {
			this.defaultTerm = this.quoteJson.custTerm;
		}

		if (this.quoteJson.customerGender !== '') {
			this.genderValue = this.quoteJson.customerGender.toString();
		}
		console.log('local value::', this.genderValue);
		this.firstFormGroup.get('customerDOB').setValue(this.quoteJson.customerDOB);
		this.firstFormGroup.get('customerFormatDOB').setValue(this.getFormatDOB(this.quoteJson.customerDOB));
		this.firstFormGroup.get('custAge').setValue(this.quoteJson.custAge);
		this.firstFormGroup.get('custMob').setValue(this.quoteJson.custMob);
		this.firstFormGroup.get('custCuntryCode').setValue(this.defaultCountryCode);
		this.firstFormGroup.get('customerGender').setValue(this.genderValue.toString());
		this.firstFormGroup.get('custName').setValue(this.quoteJson.custName);
		this.firstFormGroup.get('custEmail').setValue(this.quoteJson.custEmail);
		this.firstFormGroup.get('custPincode').setValue(this.quoteJson.custPincode);
		this.firstFormGroup.get('custQualification').setValue(this.quoteJson.custQualification);

		this.customerFormStep2.get('customerSmoker').setValue(this.quoteJson.customerSmoker);
		this.customerFormStep3.get('customerIncome').setValue(this.quoteJson.customerIncome);
		this.customerFormStep4.get('customerEmpStatus').setValue(this.quoteJson.customerEmpStatus);
		this.customerFormStep4.get('custSumAssured').setValue(this.defaultSumAssured);
		this.customerFormStep4.get('custTerm').setValue(this.defaultTerm);
	}

	// AUTO REDIRECT TO LIST PAGE FROM VALID QUOTE PARAM
	checkQuoteAutoRedirect() {
		this.subscribeList.add(
			this.route.queryParams.subscribe(params => {
				const quoteId = params['QID'];
				// console.log('qidddd::', quoteId);
				// console.log('spinner::', this.redirectSpinnerShow);
				if (quoteId > 0) {
					this.redirectSpinnerShow = !this.redirectSpinnerShow;
					console.log('spinner::', this.redirectSpinnerShow);
					this.subscribeList.add(
						this.apiService.getQuoteTerm(quoteId)
							.subscribe((quoteResponse) => {
								if (quoteId == quoteResponse[0].quoteId) {
									console.log('Response::', quoteResponse[0]);
									let custAge = this.getAgeFromDOB(quoteResponse[0].custDOB);
									let customerFormatDOB = this.getFormatDOB(quoteResponse[0].custDOB);
									let customerQuoteJson = JSON.parse(quoteResponse[0].quoteJson);

									this.completeQuoteFormData.custAge = custAge;
									this.completeQuoteFormData.custCuntryCode = 91;
									this.completeQuoteFormData.custMob = quoteResponse[0].custMobile;
									this.completeQuoteFormData.customerDOB = quoteResponse[0].custDOB;
									this.completeQuoteFormData.custPincode = quoteResponse[0].custPincode;
									this.completeQuoteFormData.custQualification = quoteResponse[0].custQualification;
									this.completeQuoteFormData.customerFormatDOB = customerFormatDOB;
									this.completeQuoteFormData.custName = quoteResponse[0].custName;
									this.completeQuoteFormData.custEmail = quoteResponse[0].custEmail;
									this.completeQuoteFormData.customerGender = quoteResponse[0].custGender;
									this.completeQuoteFormData.customerSmoker = customerQuoteJson.customerSmoker;
									this.completeQuoteFormData.customerIncome = customerQuoteJson.customerIncome;
									this.completeQuoteFormData.customerEmpStatus = customerQuoteJson.customerEmpStatus;
									this.completeQuoteFormData.custSumAssured = customerQuoteJson.custSumAssured;
									this.completeQuoteFormData.custTerm = customerQuoteJson.custTerm;
									this.completeQuoteFormData.uniqueId = quoteResponse[0].uniqueId;

									console.log('Retrive Data::', this.completeQuoteFormData);
									this.subscribeList.add(this.localStorage.setItem('quoteJson', '').subscribe(() => {
										this.subscribeList.add(this.localStorage.setItem('quoteJson', this.completeQuoteFormData).subscribe(() => {
											this.subscribeList.add(
												this.localStorage.setItem('proposalJson', '').subscribe(() => {
													this.redirectSpinnerShow = !this.redirectSpinnerShow;
													this.router.navigate(['/listing']);
												})
											);
										}));
									}));
								} else {
									this.redirectSpinnerShow = !this.redirectSpinnerShow;
									this.openErrorMessage('Invalid request', 'close');
								}
							})
					);
				}
			})
		);
	}

	// FUNCTION HANDLE FIRST STEP
	checkFirstForm(stepper: MatStepper) {
		if (this.firstFormGroup.invalid) {
			if (this.firstFormGroup.get('customerDOB').invalid) {
				this.customerDOB.nativeElement.focus();
			} else if (this.firstFormGroup.get('custMob').invalid) {
				this.custMob.nativeElement.focus();
			} else if (this.firstFormGroup.get('custName').invalid) {
				this.custName.nativeElement.focus();
			} else if (this.firstFormGroup.get('custEmail').invalid) {
				this.custEmail.nativeElement.focus();
			}
			else if (this.firstFormGroup.get('custPincode').invalid) {
				this.custPincode.nativeElement.focus();
			} else if (this.firstFormGroup.get('custQualification').invalid) {
				this.custQualification.nativeElement.focus();
			}
			return;
		} else {
			const dob_arr = this.firstFormGroup.get('customerDOB').value.split("/");
			const selDOB = new Date(`${dob_arr[2]}-${dob_arr[1]}-${dob_arr[0]}`);
			/*const selDOB  = new Date(this.firstFormGroup.get('customerDOB').value);*/
			const dobMonth: number = selDOB.getMonth() + 1;
			const dobFormatVal = selDOB.getFullYear() + '-' + this.addLeadingZero(dobMonth) + '-' + this.addLeadingZero(selDOB.getDate());
			this.firstFormGroup.get('customerFormatDOB').setValue(this.firstFormGroup.get('customerDOB').value);
			this.progressValue = 50;
			this.stepper.next();
		}
	}
	// FUNCTION FOR CHECK SMOKE STATUS
	submitSmokerStatus(stepper: MatStepper) {
		if (this.customerFormStep2.invalid) {
			return;
		} else {
			this.vstepper.next();
		}
	}
	// FUNCTION FOR ANNUAL INCOME SUBMIT
	submitAnnualIncome(stepper: MatStepper) {
		if (this.customerFormStep3.invalid) {
			return;
		} else {
			this.vstepper.next();
		}
	}
	// FUNCTION FOR VALIDATE STEP 3
	checkStep3Form(stepper: MatStepper) {
		if (this.customerFormStep3.invalid) {
			return;
		} else {
			this.vstepper.next();
		}
	}
	// FUNCTION FOR EMPLOYEE STATUS SUBMIT
	submitEmpStatus(stepper: MatStepper) {
		if (this.customerFormStep4.invalid) {
			return;
		} else {
			// this.vstepper.next();
		}
	}
	// FUNCTION TO HANDLE QUOTE FORM SUBMITTED DATA
	submitQuoteForm(stepper: MatStepper) {
		if (this.customerFormStep4.invalid) {
			return;
		} else {
			this.displayListingLoader = true;
			this.quoteFormSubmitBtn = !this.quoteFormSubmitBtn;
			this.setQuoteFormData();
			//return;
			this.localStorage.removeItem('quoteJson');
			this.subscribeList.add(
				this.localStorage.setItem('quoteJson', '').subscribe(() => {
					this.subscribeList.add(
						this.localStorage.setItem('quoteJson', this.completeQuoteFormData).subscribe(() => {
							this.localStorage.setItem('proposalJson', '').subscribe(() => {
								console.log('New Quote::', this.completeQuoteFormData);
								this.quoteFormSubmitBtn = !this.quoteFormSubmitBtn;
								this.apiService.submitQuoteTerm(this.completeQuoteFormData).subscribe({
									next: (quoteId: any) => {
										this.displayListingLoader = false;
										this.quoteFormSubmitBtn = !this.quoteFormSubmitBtn;
										this.progressValue = 100;
										this.router.navigate(['/listing/qid', quoteId]); // Runs only after API success
									},
									error: (err) => {
										this.displayListingLoader = false;
										this.quoteFormSubmitBtn = !this.quoteFormSubmitBtn;
										console.error('Error submitting quote:', err);
									}
								});

							});
						})
					);
				})
			);
		}
	}
	// SET GIVEN FORM ENTRY DATA INTO SINGLE FORM BEFORE SUBMIT
	setQuoteFormData() {
		this.completeQuoteFormData.custAge = this.firstFormGroup.get('custAge').value;
		this.completeQuoteFormData.custCuntryCode = this.firstFormGroup.get('custCuntryCode').value;
		this.completeQuoteFormData.custMob = this.firstFormGroup.get('custMob').value;
		this.completeQuoteFormData.customerDOB = this.firstFormGroup.get('customerDOB').value;
		this.completeQuoteFormData.customerGender = this.firstFormGroup.get('customerGender').value;
		this.completeQuoteFormData.customerFormatDOB = this.firstFormGroup.get('customerFormatDOB').value;
		this.completeQuoteFormData.custName = this.apiService.toTitleCase(this.firstFormGroup.get('custName').value);
		this.completeQuoteFormData.custEmail = this.firstFormGroup.get('custEmail').value;
		this.completeQuoteFormData.custQualification = this.firstFormGroup.get('custQualification').value;
		this.completeQuoteFormData.custPincode = this.firstFormGroup.get('custPincode').value;

		this.completeQuoteFormData.customerSmoker = this.customerFormStep2.get('customerSmoker').value;
		this.completeQuoteFormData.customerIncome = this.customerFormStep3.get('customerIncome').value;
		this.completeQuoteFormData.customerEmpStatus = this.customerFormStep4.get('customerEmpStatus').value;
		this.completeQuoteFormData.custSumAssured = this.customerFormStep4.get('custSumAssured').value * 100000;
		this.completeQuoteFormData.custTerm = this.customerFormStep4.get('custTerm').value;
		this.completeQuoteFormData.uniqueId = new Date().getTime();
		this.completeQuoteFormData.source_user = this.source_user;
		this.completeQuoteFormData.userCode = 0;
		// SET DEVICE VALUE
		this.completeQuoteFormData.deviceInfo = this.device_info;
		if (this.userJson !== null) {
			this.completeQuoteFormData.userJson = this.userJson;
			this.completeQuoteFormData.userCode = this.userJson.user_code;
			this.completeQuoteFormData.source_user = this.userJson.source_user;
		}
		console.log('full quote form', this.completeQuoteFormData);
	}
	// GET DEVICE DETAILS
	getDeviceDetails() {
		this.deviceInfo = this.deviceService.getDeviceInfo();
		const isMobile = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		let source_device = '';
		if (isMobile) {
			source_device = 'MOBILE'
		}
		else if (isTablet) {
			source_device = 'TABLET'
		}
		else if (isDesktopDevice) {
			source_device = 'DESKTOP'
		}
		this.device_info = {
			visitor_source: "GIBL.IN",
			visitor_device: source_device,
			visitor_browser: this.deviceInfo.browser.toUpperCase(),
			visitor_agent: this.deviceInfo.userAgent
		}
		console.log('device_info', this.device_info);
	}

	// CHECK INPUT VALUE LENGTH
	checkLength(value, len: number, fldName: any) {
		if (value.length > len) {
			// tslint:disable-next-line: radix
			this.firstFormGroup.get(fldName).setValue(parseInt(value.substring(0, len)));
		}
	}
	// CHECK QUOTE SUM ASSURED
	sumAssuredCheck($event) {
		console.log($event.charCode);
		if ($event.charCode >= 48 && $event.charCode <= 57) {
			return true;
		} else {
			return false;
		}
	}
	// GENERIC URL REDIRECT
	redirectTo(url: string) {
		window.location.href = url;
	}
	// OPEN ERROR MESSAGE POPUP
	openErrorMessage(message: string, action: string) {
		this._snackBar.open(message, action, {
			verticalPosition: 'top',
			duration: 20000
		});
	}
	// TRIM ANY VALUE PASSES IN IT
	public noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}
	// CONVERT VALUE TO TITLE CASE
	toTitleCase = (phrase) => {
		return phrase
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	// CALCULATE AGE FROM DATE OF BIRTH
	calculateAge($event) {
		const selDOB = new Date($event.value);
		const timeDiff = Math.abs(Date.now() - selDOB.getTime());
		const custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
		this.firstFormGroup.get('custAge').setValue(custAge);
		// CALCULATE DEFAULT TERM AGE
		if (custAge < 75) {
			this.defaultTerm = 75 - custAge;
		} else {
			this.defaultTerm = 99 - custAge;
		}

		this.customerFormStep4.get('custTerm').setValue(this.defaultTerm);
		const dobMonth: number = selDOB.getMonth() + 1;
		const dobFormatVal = selDOB.getFullYear() + '-' + this.addLeadingZero(dobMonth) + '-' + this.addLeadingZero(selDOB.getDate());
		this.firstFormGroup.get('customerFormatDOB').setValue(dobFormatVal);
		// this.customerFormStep5.get('custTerm').setValue(this.defaultTerm);
	}
	// CALCULATE AGE FROM GIVEN DATE VALUE
	getAgeFromDOB(dateVal: string) {
		const dob_arr = dateVal.split("/");
		const selDOB = new Date(`${dob_arr[2]}-${dob_arr[1]}-${dob_arr[0]}`);
		const timeDiff = Math.abs(Date.now() - selDOB.getTime());
		const custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
		return custAge;
	}
	// FORMAT DATE MYSQL DB FORMAT
	getFormatDOB(dateVal: string) {
		const dob_arr = dateVal.split("/");
		const selDOB = new Date(`${dob_arr[2]}-${dob_arr[1]}-${dob_arr[0]}`);
		const dobMonth: number = selDOB.getMonth() + 1;
		const dobFormatVal = selDOB.getFullYear() + '-' + this.addLeadingZero(dobMonth) + '-' + this.addLeadingZero(selDOB.getDate());
		return dobFormatVal;
	}
	// ADD LEADING 0 TO ANY NUMBER
	addLeadingZero(numberVal: any) {
		return ('0' + numberVal).slice(-2);
	}
	// CLACULATE AGE FROM DOB
	checkDOB(dobValue: string): void {
		let dob_arr = dobValue.split("/");
		let selDOB = new Date(`${dob_arr[2]}-${dob_arr[1]}-${dob_arr[0]}`);
		let toDate = new Date();
		let custAge = toDate.getFullYear() - selDOB.getFullYear();
		if (toDate.getMonth() < selDOB.getMonth() || toDate.getMonth() == selDOB.getMonth() && toDate.getDate() < selDOB.getDate()) {
			custAge -= 1;
		}

		// let timeDiff = Math.abs(Date.now() - selDOB.getTime());
		// let custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

		if (custAge >= 18 && custAge <= 65) {
			this.firstFormGroup.get('custAge').setValue(custAge);
		}
	}
	// FUNCTION TO CHECK CUSTOMER AGE RANGE RESTRICTION
	public checkAgeRestriction(control: FormControl) {
		const dob_arr = control.value.split("/");
		const selDOB = new Date(`${dob_arr[2]}-${dob_arr[1]}-${dob_arr[0]}`);
		let toDate = new Date();
		let custAge = toDate.getFullYear() - selDOB.getFullYear();
		if (toDate.getMonth() < selDOB.getMonth() || toDate.getMonth() == selDOB.getMonth() && toDate.getDate() < selDOB.getDate()) {
			custAge -= 1;
		}
		// const timeDiff = Math.abs(Date.now() - selDOB.getTime());
		// const custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

		return (custAge >= 18 && custAge <= 65) ? null : { 'agerestrict': true };
	}
	previousStep(){
		this.progressValue = 0;
	}
	// FUNCTION TO DESTROY COMPONENET
	ngOnDestroy() {
		this.subscribeList.unsubscribe();
	}
}

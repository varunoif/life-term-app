import { Injectable, Inject } from '@angular/core';
// tslint:disable-next-line: import-spacing
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { delay, map, retry, retryWhen, take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DOCUMENT } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class ApiService implements Resolve<any> {
	IS_LIVE = 'U';
	LIC_SERVICE_URL = '';
	ICICI_SERVICE_URL = '';
	ICICI_PROPOSAL_URL = '';
	PNB_PROPOSAL_URL = '';
	MAX_SERVICE_URL = '';
	EDELWEISS_SERVICE_URL = '';
	BHARTI_AXA_SERVICE_URL = '';
	HDFC_LIFE_SERVICE_URL = '';
	PNB_LIFE_SERVICE_URL = '';
	TATA_AIA_LIFE_SERVICE_URL = '';
	HOST_NAME = '';
	OFFLINE_SERVICE_URL = '';
	OFFLINE_PAYMENT_URL = '';

	// tslint:disable-next-line: max-line-length
	aegonRedirectUrl: string = 'https://buynow.aegonlife.com/BA/index.aspx?source=gib1051';
	bhartiAxaRedirectUrl: string = 'https://buyonline.bharti-axalife.com/UIRevamp/FlexiTermPlan/Premium/PremiumCalculationFTP?s1=GIBL&s2=Portal';
	/*edelweissRedirectUrl: string  = 'http://gogo.edelweisstokio.in/zindagi-plus/buy?src=Pass_partner_code_here';*/
	edelweissRedirectUrl: string = 'http://gogo.edelweisstokio.in/zindagi-plus/buy?src=A3B9A005';

	offlineGiblPaymentBaseUrl: string = 'https://www.gibl.in/term-life/';
	offlinePaymentUrl: string = 'payment/offline/ccavRequestHandler.php';
	offlinePaymentReturnUrl: string = 'payment/offline/ccavResponseHandler.php';
	offlinePaymentCancelUrl: string = 'payment/offline/ccavResponseHandler.php';

	edelweissSrc: string = 'A3B9A005';
	public annualIncomeList: any[] = [
		{ id: '01', text: '< 5 Lac', edel_text: '3 - 5 Lakhs' },
		{ id: '02', text: '5-7 Lac', edel_text: '5 - 10 Lakhs' },
		{ id: '03', text: '7-10 Lac', edel_text: '10 - 15 Lakhs' },
		{ id: '04', text: '10-15 Lac', edel_text: '15 - 20 Lakhs' },
		{ id: '05', text: '> 15 Lac', edel_text: 'Above 20 Lakhs' }
	];

	 ui = { "hdrColor": "#055ba9", "ftrColor": "#055ba9", "logoUrl": "assets/quote/img/logo.png", "isSponsored": false };
	private uiSub = new BehaviorSubject<any>(this.ui);
	readonly getUiColors$ = this.uiSub.asObservable();


	constructor(
		private httpClient: HttpClient,
		protected localStorage: LocalStorage,
		@Inject(DOCUMENT) public document: HTMLDocument
	) { }
	ngOnInit(){
		this.setFavicon();
	}

	createLinkForCanonicalURL(URL: string) {
		let link: HTMLLinkElement = this.document.createElement('link');
		link.setAttribute('rel', 'canonical');
		this.document.head.appendChild(link);
		link.setAttribute('href', URL);
	}

	checkDomain() {
		this.HOST_NAME = document.location.hostname;
		console.log("HOST NAME =>>>>>" , this.HOST_NAME);

		switch (this.HOST_NAME) {
			case '192.168.7.128':
				this.IS_LIVE = 'N';
				break;
			case 'localhost':
				this.IS_LIVE = 'U';
				break;
			// case 'uatweb.finarray.in':
			// 	this.IS_LIVE = 'F';
			// 	break;
			// case 'uatweb.justpolicy.in':
			// 	this.IS_LIVE = 'JP';
			// 	break;
			case 'uat.gibl.in':
				this.IS_LIVE = 'OU';
				break;
			case 'uatnew.gibl.in':
				this.IS_LIVE = 'U';
				break;
			case 'gibl.in':
				this.IS_LIVE = 'L';
				break;
			case 'www.gibl.in':
				this.IS_LIVE = 'L';
				break;
			default:
				this.IS_LIVE = 'G';
				break;
		}

		return this.IS_LIVE;
	}

	getBaseURL() {
		// tslint:disable-next-line: no-conditional-assignment
		this.IS_LIVE = this.checkDomain();

		if (this.IS_LIVE === 'N') {
			this.LIC_SERVICE_URL = 'http://192.168.7.128:3000/';
		} else if (this.IS_LIVE === 'U') {
			this.LIC_SERVICE_URL = `https://uatweb.synergy-insurance.com/`;
		}
		else if (this.IS_LIVE === 'G') {
			this.LIC_SERVICE_URL = `https://${this.HOST_NAME}/`;
		}
		// else if (this.IS_LIVE === 'JP') {
		// 	this.LIC_SERVICE_URL = 'https://uatweb.justpolicy.in/';
		// }
		else if (this.IS_LIVE === 'L') {
			this.LIC_SERVICE_URL = 'https://napptl.gibl.in/';
		} else {
			this.LIC_SERVICE_URL = 'http://192.168.7.128:3000/';
		}
		return this.LIC_SERVICE_URL;
	}

	getBaseUserServiceUrl() {
		this.IS_LIVE = this.checkDomain();
		let USER_SERVICE_BASE_URL = '';
		if (this.IS_LIVE === 'N') {
			USER_SERVICE_BASE_URL = 'https://www.gibl.in/php-services/user-services/';
		} else if (this.IS_LIVE === 'U') {
			USER_SERVICE_BASE_URL = 'http://uatnew.gibl.in/php-services/user-services/'; // http://uat.gibl.in/user-services/
		} else if (this.IS_LIVE === 'L') {
			USER_SERVICE_BASE_URL = 'https://www.gibl.in/php-services/user-services/';
		} else {
			USER_SERVICE_BASE_URL = 'http://uatnew.gibl.in/php-services/user-services/';
		}
		return USER_SERVICE_BASE_URL;
	}

	getOfflineServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.OFFLINE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=SAVE_PROPOSAL';
		} else if (this.IS_LIVE === 'U') { // OU
			this.OFFLINE_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=SAVE_PROPOSAL';
		} else if (this.IS_LIVE === 'U-') {
			this.OFFLINE_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=SAVE_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			this.OFFLINE_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=SAVE_PROPOSAL';
		} else {
			this.OFFLINE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=SAVE_PROPOSAL';
		}
		return this.OFFLINE_SERVICE_URL;
	}

	getOfflinePaymentBaseUrl() {
		this.IS_LIVE = this.checkDomain();
		if (this.IS_LIVE === 'N') {
			this.offlineGiblPaymentBaseUrl = 'https://www.gibl.in/term-life/';
		} else if (this.IS_LIVE === 'OU') { // OU
			this.offlineGiblPaymentBaseUrl = 'http://uat.gibl.in/term-life/';
		} else if (this.IS_LIVE === 'U') {
			this.offlineGiblPaymentBaseUrl = 'http://uatnew.gibl.in/term-life/';
		} else if (this.IS_LIVE === 'L') {
			this.offlineGiblPaymentBaseUrl = 'https://www.gibl.in/term-life/';
		} else {
			this.offlineGiblPaymentBaseUrl = 'https://www.gibl.in/term-life/';
		}
		return this.offlineGiblPaymentBaseUrl;
	}

	getMaxServiceURL() {
		this.IS_LIVE = this.checkDomain();
		if (this.IS_LIVE === 'N') {
			this.MAX_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_MAX_QUOTE';
		} else if (this.IS_LIVE === 'U') { // OU
			this.MAX_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_MAX_QUOTE';
		} else if (this.IS_LIVE === 'U-') {
			this.MAX_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_MAX_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.MAX_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_MAX_QUOTE';
		} else {
			this.MAX_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_MAX_QUOTE';
		}
		// console.log('Service Url:', this.MAX_SERVICE_URL);
		return this.MAX_SERVICE_URL;
	}

	getICICIServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.ICICI_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_ICICI_QUOTE';
		} else if (this.IS_LIVE === 'OU') { // OU
			this.ICICI_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_ICICI_QUOTE';
		} else if (this.IS_LIVE === 'U') { // NU
			this.ICICI_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_ICICI_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.ICICI_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_ICICI_QUOTE';
		} else {
			this.ICICI_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_ICICI_QUOTE';
		}
		return this.ICICI_SERVICE_URL;
	}

	getICICIProposalURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.ICICI_PROPOSAL_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_ICICI_PROPOSAL';
		} else if (this.IS_LIVE === 'OU') { // OU
			this.ICICI_PROPOSAL_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_ICICI_PROPOSAL';
		} else if (this.IS_LIVE === 'U') { // NU
			this.ICICI_PROPOSAL_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_ICICI_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			this.ICICI_PROPOSAL_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_ICICI_PROPOSAL';
		} else {
			this.ICICI_PROPOSAL_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_ICICI_PROPOSAL';
		}
		return this.ICICI_PROPOSAL_URL;
	}

	getPnbProposalURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.PNB_PROPOSAL_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_PNB_PROPOSAL';
		} else if (this.IS_LIVE === 'OU') { // OU
			this.PNB_PROPOSAL_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_PNB_PROPOSAL';
		} else if (this.IS_LIVE === 'U') { // NU
			this.PNB_PROPOSAL_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_PNB_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			this.PNB_PROPOSAL_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_PNB_PROPOSAL';
		} else {
			this.PNB_PROPOSAL_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_PNB_PROPOSAL';
		}
		return this.PNB_PROPOSAL_URL;
	}


	getAegonProposalURL() {
		this.IS_LIVE = this.checkDomain();
		let AEGON_PROPOSAL_URL = ""
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			AEGON_PROPOSAL_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_AEGON_PROPOSAL';
		} else if (this.IS_LIVE === 'OU') { // OU
			AEGON_PROPOSAL_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_AEGON_PROPOSAL';
		} else if (this.IS_LIVE === 'U') { // NU
			AEGON_PROPOSAL_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_AEGON_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			AEGON_PROPOSAL_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_AEGON_PROPOSAL';
		} else {
			AEGON_PROPOSAL_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_AEGON_PROPOSAL';
		}
		return AEGON_PROPOSAL_URL;
	}


	getEdelweissTokioServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.EDELWEISS_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		} else if (this.IS_LIVE === 'U') { // OU
			this.EDELWEISS_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		} else if (this.IS_LIVE === 'U-') {
			this.EDELWEISS_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.EDELWEISS_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		} else {
			this.EDELWEISS_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		}
		return this.EDELWEISS_SERVICE_URL;
	}

	getBhartiAxaServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.BHARTI_AXA_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		} else if (this.IS_LIVE === 'U') { // OU
			this.BHARTI_AXA_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		} else if (this.IS_LIVE === 'U-') {
			this.BHARTI_AXA_SERVICE_URL = 'http://uatnew.gibl.in/php-services/php-services/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.BHARTI_AXA_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		} else {
			this.BHARTI_AXA_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		}
		return this.BHARTI_AXA_SERVICE_URL;
	}

	getHdfcLifeServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.HDFC_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		} else if (this.IS_LIVE === 'U') { // OU
			this.HDFC_LIFE_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		} else if (this.IS_LIVE === 'U-') {
			this.HDFC_LIFE_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.HDFC_LIFE_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		} else {
			this.HDFC_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		}
		return this.HDFC_LIFE_SERVICE_URL;
	}

	getKotakLifeServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.HDFC_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_KOTAK_LIFE_QUOTE';
		} else if (this.IS_LIVE === 'U') { // OU
			this.HDFC_LIFE_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_KOTAK_LIFE_QUOTE';
		} else if (this.IS_LIVE === 'U-') {
			this.HDFC_LIFE_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_KOTAK_LIFE_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.HDFC_LIFE_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_KOTAK_LIFE_QUOTE';
		} else {
			this.HDFC_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_KOTAK_LIFE_QUOTE';
		}
		return this.HDFC_LIFE_SERVICE_URL;
	}

	getAegonServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.PNB_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_AEGON_QUOTE';
		} else if (this.IS_LIVE === 'OU') { // OU
			this.PNB_LIFE_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_AEGON_QUOTE';
		} else if (this.IS_LIVE === 'U') {
			this.PNB_LIFE_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_AEGON_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.PNB_LIFE_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_AEGON_QUOTE';
		} else {
			this.PNB_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_AEGON_QUOTE';
		}
		return this.PNB_LIFE_SERVICE_URL;
	}

	getTataAiaServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.TATA_AIA_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		} else if (this.IS_LIVE === 'OU') { // OU
			this.TATA_AIA_LIFE_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		} else if (this.IS_LIVE === 'U') {
			this.TATA_AIA_LIFE_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.TATA_AIA_LIFE_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		} else {
			this.TATA_AIA_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		}
		return this.TATA_AIA_LIFE_SERVICE_URL;
	}

	getPnbServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'N') {
			this.PNB_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_PNB_QUOTE';
		} else if (this.IS_LIVE === 'OU') { // OU
			this.PNB_LIFE_SERVICE_URL = 'http://uat.gibl.in/life-services/index.php?action=GET_PNB_QUOTE';
		} else if (this.IS_LIVE === 'U') {
			this.PNB_LIFE_SERVICE_URL = 'http://uatnew.gibl.in/php-services/life-services/index.php?action=GET_PNB_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.PNB_LIFE_SERVICE_URL = 'https://www.gibl.in/php-services/life-services/index.php?action=GET_PNB_QUOTE';
		} else {
			this.PNB_LIFE_SERVICE_URL = 'http://192.168.7.124/gibl-services/life-services/index.php?action=GET_PNB_QUOTE';
		}
		return this.PNB_LIFE_SERVICE_URL;
	}

	resolve(route: ActivatedRouteSnapshot) {
		const curObj = this;
		const quoteJson: any = '';

		const baseURL = this.getBaseURL();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		return this.httpClient.post(`${baseURL}api/resolveData`, quoteJson, httpOptions)
			.pipe(retryWhen(errors => errors.pipe(delay(1000), take(1))));
	}

	callTest(quoteJson: any) {
		const baseURL = this.getBaseURL();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		return this.httpClient.post(`${baseURL}api/resolveDatan`, quoteJson, httpOptions).pipe(delay(1000));
	}

	signIn(callbackjson) {
		const baseURL = this.getBaseURL();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(`${baseURL}api/signin/`, callbackjson, httpOptions)
			.pipe(retryWhen(errors => errors.pipe(delay(1000), take(3))));
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('userJson');
	}

	isAuthenticated() {
		const token = localStorage.getItem('userJson');
		return token != null;
	}

	getMaxNyRegularPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getMaxServiceURL();
		quoteJson.providerId = 30;
		// console.log("max service::", quoteJson.serviceUrl);
		return this.httpClient.post(`${baseURL}maxny/api/getPremium/${quoteJson.providerId}`, quoteJson, httpOptions);
		// return this.httpClient.post(`${baseURL}maxny/api/getPremium/${quoteJson.providerId}`, quoteJson, httpOptions)
		// .pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getICICIPruRegularPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getICICIServiceURL();
		quoteJson.providerId = 31;
		return this.httpClient.post(`${baseURL}icicpru/api/getRegularQuote/${quoteJson.providerId}`, quoteJson, httpOptions);
		// return this.httpClient.post(`${baseURL}icicpru/api/getRegularQuote/${quoteJson.providerId}`, quoteJson, httpOptions)
		// .pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getICICIPruProposal(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getICICIProposalURL();
		quoteJson.providerId = 31;
		// console.log(JSON.stringify(quoteJson));
		// return false;
		return this.httpClient.post(`${baseURL}icicpru/api/getProposal/${quoteJson.providerId}`, quoteJson);
	}

	getPnbProposal(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getPnbProposalURL();
		quoteJson.providerId = 40;
		// console.log(JSON.stringify(quoteJson));
		// return false;
		return this.httpClient.post(`${baseURL}icicpru/api/getProposal/40`, quoteJson);
	}


	getAegonProposal(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getAegonProposalURL();
		quoteJson.providerId = 32;
		// console.log(JSON.stringify(quoteJson));
		// return false;
		return this.httpClient.post(`${baseURL}icicpru/api/getProposal/32`, quoteJson);
	}

	// old
	getAegonTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getICICIServiceURL();
		quoteJson.providerId = 32;
		return this.httpClient.post(`${baseURL}aegonlife/api/getPremium/${quoteJson.providerId}`, quoteJson);
		// .pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getHDFCTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getHdfcLifeServiceURL();
		quoteJson.providerId = 33;

		//console.log('HDFC Life::', JSON.stringify(quoteJson));
		// return quoteJson;

		return this.httpClient.post(`${baseURL}hdfclife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getKotakermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getKotakLifeServiceURL();
		quoteJson.providerId = 39;

		// console.log('KOTAK Life::', JSON.stringify(quoteJson));
		// return quoteJson;

		return this.httpClient.post(`${baseURL}kotaklife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getPnbPremium(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getPnbServiceURL();
		quoteJson.providerId = 40;

		// console.log('PNB Life::', JSON.stringify(quoteJson));
		// return quoteJson;

		return this.httpClient.post(`${baseURL}edelweisslife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getAegonPremium(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getAegonServiceURL();
		quoteJson.providerId = 32;

		return this.httpClient.post(`${baseURL}edelweisslife/api/getPremium/${quoteJson.providerId}`, quoteJson)
			.pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getTataAiaPremium(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getTataAiaServiceURL();
		quoteJson.providerId = 41;

		return this.httpClient.post(`${baseURL}edelweisslife/api/getPremium/${quoteJson.providerId}`, quoteJson)
			.pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getEdelweissTokioTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getEdelweissTokioServiceURL();
		quoteJson.providerId = 34;

		return this.httpClient.post(`${baseURL}edelweisslife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getEdelweissTokioTermLink(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getEdelweissTokioServiceURL() + '&type=2';
		quoteJson.providerId = 34;

		return this.httpClient.post(`${baseURL}edelweisslife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getBhartiAxaTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getBhartiAxaServiceURL();
		quoteJson.providerId = 35;

		// console.log('BhartiAxa::', JSON.stringify(quoteJson));
		// return quoteJson;

		return this.httpClient.post(`${baseURL}bhartiaxa/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}
	//new quote-form submit
	submitQuoteTerm(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		return this.httpClient.post(`${baseURL}/php-services/life-services/service.php?action=PREMIUM_SUBMIT`, quoteJson, httpOptions);
	}

	//new quote-list
	
		getQuotesList(customerJson: any, source_user: any, user_code:any,uniqueId:any,filters:any,providerId?: any, quoteId?: any, serviceUrl?: any, ) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		const requestBody = {
			...customerJson,
			quoteID: quoteId,
			...filters,
			serviceUrl: serviceUrl,
			user_code: user_code,
			source_user: source_user,
			uniqueId:uniqueId
		};
		const baseURL = this.getBaseURL();
		return this.httpClient.post(
			
			`${baseURL}php-services/life-services/service.php?action=PREMIUM_REQUEST&PROVIDER_ID=${providerId}`,
			requestBody, // payload including serviceUrl
			httpOptions
		);
	}
	//get User details

	getUserDetails(quoteId: any ) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		const requestBody = {
			quoteID: quoteId,
		};
		const baseURL = this.getBaseURL();
		return this.httpClient.post(
			
			`${baseURL}php-services/life-services/service.php?action=GET_PREMIUM&quoteID=${quoteId}`,
			 requestBody, // payload including serviceUrl
			httpOptions
			
		);
	}
	//share quote via mobile no. 
	shareQuoteContact(contact_no,quoteId){
		const httpOptions = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		const requestBody = {
			contact_no:contact_no,
			quoteId:quoteId
		};
		const baseURL = this.getBaseURL();
		return this.httpClient.post(
			
			`${baseURL}php-services/sms-services/service.php?action=send_quote_sms`,
			requestBody, // payload including serviceUrl
			httpOptions
		);
	}
	//share quote via email 
	shareQuoteMail(quoteUrl,refEmailAddress){
		const httpOptions = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		const requestBody = {
			quoteUrl:quoteUrl,
			refEmailAddress:refEmailAddress
		};
		const baseURL = this.getBaseURL();
		return this.httpClient.post(
			
			`${baseURL}php-services/life-services/service.php?action=SEND_QUOTE_EMAIL`,
			requestBody, // payload including serviceUrl
			httpOptions
		);
	}

	setFavicon() {
  const favicons: { [key: string]: string } = {
    'web.finarray.in': 'assets/broker/finArray.jpg',
    'uatweb.finarray.in': 'assets/broker/finArray.jpg',
    'web.synergy-insurance.in': 'assets/synergy-favicon.png',
    'uatweb.synergy-insurance.com': 'assets/synergy-favicon.png',
    'uatweb.justpolicy.in': 'assets/broker/justPolicy.jpeg',
    'web.justpolicy.in': 'assets/broker/justPolicy.jpeg',
    'localhost': 'assets/synergy-favicon.png'
  };

  const hostname = window.location.hostname;
  console.log('HOST',hostname)
  const faviconUrl = favicons[hostname] || 'assets/synergy-favicon.png';
console.log('FAVICON URL ',faviconUrl)
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = faviconUrl;
}
	
	updateQuoteTerm(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		// console.log(quoteJson);
		return this.httpClient.post(`${baseURL}api/updateLifeQuote/`, quoteJson, httpOptions);
	}

	getQuoteTerm(quoteId) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		let quoteData = { quoteId: quoteId };
		const baseURL = this.getBaseURL();
		return this.httpClient.post(`${baseURL}api/getQuoteDetails/`, quoteData, httpOptions);
	}

	savePaymentTerm(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		// console.log(quoteJson);
		return this.httpClient.post(`${baseURL}api/savePayment/`, quoteJson, httpOptions);
	}

	toTitleCase = (phrase) => {
		return phrase
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	getUi():Observable<any>{
		return this.localStorage.getItem('userJson').pipe(map((userJson: any) => {
			let ui: any;
			ui = JSON.parse(JSON.stringify(userJson));
			if (ui && ui.ui) {
				ui = ui.ui;
			} else {
				ui = { "hdrColor": "#055ba9", "ftrColor": "#055ba9", "logoUrl": "assets/quote/img/logo.png", "isSponsored": false };
			}
			this.uiSub.next(Object.assign([], ui));
			return ui;
		}));
	}
	
	

}

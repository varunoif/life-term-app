import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { SeoService } from '../../services/seo.service';
import { SubSink } from 'subsink';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

	// ASSIGN SUBSINK
	private subscribeList = new SubSink();
	source_user: string = "100001";
	public insuranceTypeMenuItem: any[] = [
		{ 'title': 'Car Insurance', 'link': 'https://www.gibl.in/car-insurance/' },
		{ 'title': 'Health Insurance', 'link': 'https://www.gibl.in/health-insurance/' },
		{ 'title': 'Two Wheeler Insurance', 'link': 'https://www.gibl.in/two-wheeler-insurance/' },
		{ 'title': 'Travel Insurance', 'link': 'https://www.gibl.in/travel-insurance/' },
		{ 'title': 'Personal Accident Insurance', 'link': 'https://www.gibl.in/personal-accident-insurance/' },
		{ 'title': 'Home Insurance', 'link': 'https://www.gibl.in/home-insurance/' },
		{ 'title': 'Commercial Vehicle Insurance', 'link': 'https://www.gibl.in/commercial-vehicle-insurance/' },
		{ 'title': 'Group Insurance', 'link': 'https://www.gibl.in/health-insurance/group-mediclaim-policy/' },
		{ 'title': 'Critical Illness Insurance', 'link': 'https://www.gibl.in/health-insurance/critical-illness-insurance/' },
		{ 'title': 'Gadget Insurance', 'link': 'https://www.gibl.in/gadget-insurance/' }
	];
	host_name: string = "";
	loginURL: string = "";
	registerURL: string = "";
	public insuranceCompanyList: any[] = [
		{ 'title': 'National Insurance', 'link': 'https://www.gibl.in/national-insurance/' },
		{ 'title': 'New India Assurance', 'link': 'https://www.gibl.in/new-india-assurance/' },
		{ 'title': 'United India Insurance', 'link': 'https://www.gibl.in/united-india-insurance-uiic/' },
		{ 'title': 'HDFC ERGO General Insurance', 'link': 'https://www.gibl.in/hdfc-ergo-insurance/' },
		{ 'title': 'Star Health Insurance', 'link': 'https://www.gibl.in/star-health-insurance/' },
		{ 'title': 'Oriental Insurance', 'link': 'https://www.gibl.in/oriental-insurance/' },
		{ 'title': 'Bajaj Allianz General Insurance', 'link': 'https://www.gibl.in/bajaj-allianz-insurance/' },
		{ 'title': 'Iffco Tokio General Insurance', 'link': 'https://www.gibl.in/iffco-tokio-insurance/' },
		{ 'title': 'SBI General Insurance', 'link': 'https://www.gibl.in/sbi-general-insurance/' },
		{ 'title': 'MaxBupa Health insurance', 'link': 'https://www.gibl.in/max-bupa-insurance/' },
		{ 'title': 'Apollo Munich Health Insurance', 'link': 'https://www.gibl.in/apollo-munich-insurance/' },
		{ 'title': 'Bharti AXA General Insurance', 'link': 'https://www.gibl.in/bharti-axa-insurance/' },
		{ 'title': 'Tata AIG Greneral Insurance', 'link': 'https://www.gibl.in/tata-aig-insurance/' },
		{ 'title': 'Universal Sompo General Insurance', 'link': 'https://www.gibl.in/universal-sompo-insurance/' }
	];

	public dialogRef: any;
	public panelOpenState: boolean = false;

	public retailerLogin: any = {};

	uiStyle: any;
	isSponsored: boolean = false;
	logo: string = 'assets/quote/img/logo.png';
	hdrColor: string = '#055ba9';
	role_data: any;
	isAgentLogin: boolean = false
	role_type: number;
	logoSrc: string = '';
	logoWidth: string = '135px';
	constructor(
		public dialog: MatDialog,
		private router: Router,
		protected localStorage: LocalStorage,
		private apiService: ApiService,
		private seoService: SeoService,
		private route: ActivatedRoute,
	) { }
	generateUi() {
		this.apiService.getUi().subscribe((d) => { });
		this.apiService.getUiColors$.subscribe((data) => {
			this.uiStyle = data;
			this.hdrColor = `${this.uiStyle.hdrColor}`;
			this.isSponsored = this.uiStyle.isSponsored;
			this.logo = this.uiStyle.logoUrl;

		})

	}
	ngOnInit() {
		this.isAgentLogin = false;
		this.checkParam();
		this.checkAutoLogin();
		this.generateUi();
		this.host_name = this.apiService.HOST_NAME;
		this.setLogoByHost(this.host_name);
		this.setAuthUrls();

		this.apiService.checkLoginType().subscribe({
			next: (data: any) => {
				if (data && data.status && data.user_json && data.user_json.role_type) {
					this.role_data = data;
					this.role_type = data.user_json.role_type;
					this.isAgentLogin = true;
					console.log("Login type is:", this.role_type);
				} else {
					console.warn("Unexpected response:", data);
					this.role_type = null;
					this.isAgentLogin = false;
				}
			},
			error: (err) => {
				console.error("Error checking login type:", err);
				this.role_type = null;
				this.isAgentLogin = false;
			}
		});
	}
	setLogoByHost(host: string) {

		if (host.includes('synergy')) {
			this.logoSrc = 'assets/SynergyLogoFull.png';
			this.logoWidth = '135px';
			return;
		}

		if (host.includes('justpolicy')) {
			this.logoSrc = 'assets/broker/justPolicy.jpeg';
			this.logoWidth = '135px';
			return;
		}

		if (host.includes('finarray')) {
			this.logoSrc = 'assets/broker/finArray.jpg';
			this.logoWidth = '110px';
			return;
		}

		// default / fallback
		this.logoSrc = 'assets/broker/finArray.jpg';
		this.logoWidth = '135px';
	}
	setAuthUrls() {

		if (this.host_name.includes('synergy')) {

			if (this.host_name.includes('uat')) {
				this.registerURL = 'https://uatweb.synergy-insurance.com/pos/';
				this.loginURL = 'https://uatweb.synergy-insurance.com/login.php';
			} else {
				this.registerURL = 'https://web.synergy-insurance.in/pos/';
				this.loginURL = 'https://web.synergy-insurance.in/login.php';
			}

			return;
		}

		if (this.host_name.includes('finarray')) {

			if (this.host_name.includes('uat')) {
				this.registerURL = 'https://uatweb.finarray.in/pos/';
				this.loginURL = 'https://uatweb.finarray.in/login.php';
			} else {
				this.registerURL = 'https://web.finarray.in/pos/';
				this.loginURL = 'https://web.finarray.in/login.php';
			}

			return;
		}

		if (this.host_name.includes('justpolicy')) {

			if (this.host_name.includes('uat')) {
				this.registerURL = 'https://uatweb.justpolicy.in/pos/';
				this.loginURL = 'https://uatweb.justpolicy.in/login.php';
			} else {
				this.registerURL = 'https://web.justpolicy.in/pos/';
				this.loginURL = 'https://web.justpolicy.in/login.php';
			}

			return;
		}

		// 🔁 fallback (default)
		this.registerURL = 'https://uatweb.synergy-insurance.com/pos/';
		this.loginURL = 'https://uatweb.synergy-insurance.com/login.php';
	}

	onDashboardAction() {
		// if(this.host_name == 'uatweb.synergy-insurance.com'){
		// 	this.registerURL = "https://uatweb.synergy-insurance.com/pos/";
		// 	this.loginURL = "https://uatweb.synergy-insurance.com/login.php"
		// }
		// else if(this.host_name == 'web.synergy-insurance.in'){
		// 	this.registerURL = "https://web.synergy-insurance.in/pos/";
		// 	this.loginURL = "https://web.synergy-insurance.in/login.php"
		// }
		if (this.host_name == 'uatweb.finarray.in') {
			window.open('https://uatweb.finarray.in/posp-profile/dashboard');
		}
		else if (this.host_name == 'web.finarray.in') {
			window.open('https://web.finarray.in/posp-profile/dashboard');
		}
		// else if(this.host_name == 'uatweb.justpolicy.in'){
		// 	this.registerURL = "https://uatweb.justpolicy.in/pos/";
		// 	this.loginURL = "https://uatweb.justpolicy.in/login.php"
		// }
		// else if(this.host_name == 'web.justpolicy.in'){
		// 	this.registerURL = "https://web.justpolicy.in/pos/";
		// 	this.loginURL = "https://web.justpolicy.in/login.php"
		// }

	}
	onCrmAction() {
		// if(this.host_name == 'uatweb.synergy-insurance.com'){
		// 	this.registerURL = "https://uatweb.synergy-insurance.com/pos/";
		// 	this.loginURL = "https://uatweb.synergy-insurance.com/login.php"
		// }
		// else if(this.host_name == 'web.synergy-insurance.in'){
		// 	this.registerURL = "https://web.synergy-insurance.in/pos/";
		// 	this.loginURL = "https://web.synergy-insurance.in/login.php"
		// }
		if (this.host_name == 'uatweb.finarray.in') {
			window.open('https://uatcrm.finarray.in/my-dashboard.php');
		}
		else if (this.host_name == 'web.finarray.in') {
			window.open('https://crm.finarray.in/my-dashboard.php');
		}
		// else if(this.host_name == 'uatweb.justpolicy.in'){
		// 	this.registerURL = "https://uatweb.justpolicy.in/pos/";
		// 	this.loginURL = "https://uatweb.justpolicy.in/login.php"
		// }
		// else if(this.host_name == 'web.justpolicy.in'){
		// 	this.registerURL = "https://web.justpolicy.in/pos/";
		// 	this.loginURL = "https://web.justpolicy.in/login.php"
		// }

	}

	checkAutoLogin() {
		this.subscribeList.add(
			this.localStorage.getItem('userJson').subscribe((data) => {
				// console.log('Userdata',data);
				if (data !== null) {
					let res: any = data;
					if (res.token) {
						if (res.white_label == '1') {
							this.retailerLogin.whileLabeled = true;
						}
						if (res.status == '1') {
							this.retailerLogin.isLoggedIn = true;
						}
						else {
							this.retailerLogin.isLoggedIn = false;
						}
					}
				}
			})
		);
	}

	checkParam() {
		this.route.queryParams.subscribe(params => {
			// console.log('Query params:=>',params);
			let loginJson;
			let userServiceUrl = this.apiService.getBaseUserServiceUrl();
			if (params.ref != null) {
				if (params.ref == "GIBLDNCD") {
					loginJson = {
						"uname": params.uname,
						"source": params.source,
						"msource": params.msource,
						"acode": params.acode,
						"token": params.akey,
						"serviceUrl": ""
					};
					loginJson.serviceUrl = userServiceUrl + "login.php?TYPE=2";
				}
				if (params.ref == "GIBLDNPOS") {
					// console.log('params',params);
					loginJson = {
						"uname": params.uname,
						"acode": params.acode,
						"token": params.akey,
						"serviceUrl": ""
					};
					loginJson.serviceUrl = userServiceUrl + "login.php?TYPE=3";
				}
				if (params.ref == "GIBLDNQRCODE") {
					// console.log('params',params);
					loginJson = {
						"qrcode": params.qrcode,
						"serviceUrl": ""
					};
					loginJson.serviceUrl = userServiceUrl + "login.php?TYPE=5";
				}
				if (params.ref == "GIBLDNTIEUP") {
					// console.log('params',params);
					loginJson = {
						"tcode": params.tcode,
						"serviceUrl": ""
					};
					loginJson.serviceUrl = userServiceUrl + "login.php?TYPE=6";
				}

				this.subscribeList.add(
					this.apiService.signIn(loginJson).subscribe(data => {
						let res: any = data;
						let rd = JSON.parse(JSON.stringify(res || null));
						// console.log('Autologin Response=>: ',rd);
						if (rd.token) {
							if (rd.white_label == '1') {
								this.retailerLogin.whileLabeled = true;
							}
							if (rd.status == '1') {
								this.retailerLogin.isLoggedIn = true;
							}
							else {
								this.retailerLogin.isLoggedIn = false;
							}

							let userCode = rd.user_code;
							this.subscribeList.add(
								this.localStorage.setItem('userJson', rd).subscribe(() => {
									this.generateUi();
									this.router.navigate(['/']);
								})
							);
						}
						else {
							this.retailerLogin.isLoggedIn = false;
							this.localStorage.setItem('userJson', null).subscribe(() => {
								this.generateUi();
								this.router.navigate(['/']);
							});
						}
					})
				);
			}
			else {
				if (params.source != null) {
					// console.log('params',params);
					loginJson = {
						"source": params.source,
						"serviceUrl": ""
					};

					//loginJson.serviceUrl = userServiceUrl + "login_term_life.php?TYPE=7";
					loginJson.serviceUrl = userServiceUrl + "login.php?TYPE=7";
					// console.log('loginJson',loginJson);
					this.subscribeList.add(
						this.apiService.signIn(loginJson).subscribe(data => {
							let res: any = data;
							let rd = JSON.parse(JSON.stringify(res || null));
							if (rd.token) {
								if (rd.status == '1') {
									this.retailerLogin.isLoggedIn = true;
									if (rd.white_label == '1') {
										this.retailerLogin.whileLabeled = true;
									}
								}
								else {
									this.retailerLogin.isLoggedIn = false;
								}

								let userCode = rd.user_code;
								this.localStorage.setItem('userJson', rd).subscribe(() => {
									this.generateUi();
									this.router.navigate(['/']);
								});
							}
							else {
								this.retailerLogin.isLoggedIn = false;
								this.localStorage.setItem('userJson', null).subscribe(() => {
									this.generateUi();
									this.router.navigate(['/']);
								});
							}
						})
					);
				}
			}
		});
	}

	logout() {
		// remove user from local storage to log user out
		this.localStorage.removeItem('userJson').subscribe(() => {
			this.source_user = "100001";
			this.retailerLogin.isLoggedIn = false;
			this.retailerLogin.whileLabeled = false;
		});
	}

	openMenuPopup(content): void {
		this.dialogRef = this.dialog.open(content, {});
		this.dialogRef.afterClosed().subscribe(result => {
			// console.log('The dialog was closed');
		});
	}

	// FUNCTION TO DESTRY COMPONENET
	ngOnDestroy() {
		this.subscribeList.unsubscribe();
	}

	// GENERIC URL REDIRECT
	redirectTo(url: string) {
		window.location.href = url;
	}
}

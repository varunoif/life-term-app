import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';


@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {

  selectedIndex = 0;
  detailsFormGroup: FormGroup;
  coversFormGroup: FormGroup;
  nomineeFormGroup: FormGroup;
  contactFormGroup: FormGroup;
  quoteID: any;
  userData: any;
  dobMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  source_user = "100001";
  user_code = "100001";
  premiumJson: any;
  providerId: any;
  quoteJson: any;
  proposalJson: any;
  selectedTabIndex = 0;
  public focusState: boolean = true;
  selectedDocument: any = "Pan Card";
  recalculateStatus = false;
  planVariantExsist = false;
  constructor(private http: HttpClient, private _formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.quoteID = this.route.snapshot.paramMap.get('quoteId');
    this.route.queryParams.subscribe(params => {
      if (params['tab'] !== undefined) {
        this.selectedTabIndex = +params['tab'];
      }
    });
    this.coversFormGroup = this._formBuilder.group({
      criticalIllness: [false],
      criticalIllnessOption: ['']
    })
    this.detailsFormGroup = this._formBuilder.group({
      custName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(\w.+\s).+$/), this.noWhitespaceValidator]],
      customerDOB: ['', [Validators.required,]],
      customerEmpStatus: ['', [Validators.required,]],
      userMartialStatus: ['', [Validators.required]],
      custExisting: ['', [Validators.required]],
      custFirstBuyer: ['', [Validators.required]],
    });
    this.nomineeFormGroup = this._formBuilder.group({
      nomineeTitle: ['', [Validators.required]],
      nomineeFullName: ['', [Validators.required,]],
      nomineeRelation: ['', [Validators.required,]],
      nomineeDob: ['', [Validators.required]],

    });
    this.contactFormGroup = this._formBuilder.group({
      customerDocumentType: ['panCard', Validators.required],
      customerDocumentValue: ['', Validators.required],
      addressline1: ['', [Validators.required]],
      addressline2: ['', [Validators.required]],
      addressline3: [''],
      customerCity: ['', [Validators.required]],
      customerState: ['', [Validators.required]],
      customerCountry: ['', [Validators.required]],
      customerPincode: ['', [Validators.required]],
      customerLandmark: [''],
    });

    this.getUserDetails();
    this.coversFormGroup = this._formBuilder.group({
      criticalIllness: [false],
      criticalIllnessOption: ['']
    });
    this.getProposalApi();
    const criticalIllnessCtrl = this.coversFormGroup.get('criticalIllness');
    const optionCtrl = this.coversFormGroup.get('criticalIllnessOption');

    if (criticalIllnessCtrl && optionCtrl) {
      criticalIllnessCtrl.valueChanges.subscribe((checked: boolean) => {

        if (checked) {
          optionCtrl.setValidators([Validators.required]);
        } else {
          optionCtrl.clearValidators();
          optionCtrl.reset();
        }

        optionCtrl.updateValueAndValidity();
      });
    }
    this.coversFormGroup.get('criticalIllness').valueChanges.subscribe((isChecked: boolean) => {

      const optionCtrl = this.coversFormGroup.get('criticalIllnessOption');

      if (isChecked === true) {
        optionCtrl.setValidators([Validators.required]);
      } else {
        optionCtrl.clearValidators();
        optionCtrl.setValue('');
      }

      optionCtrl.updateValueAndValidity();
      // if(this.providerId == 2){
      //   this.calculateBajajPremium();
      // }
    });
  }
  changeSelectedDocument(event) {
    console.log(event.value);
    if (event.value == 'panCard') {
      this.selectedDocument = "Pan card"
    }
    if (event.value == 'voterId') {
      this.selectedDocument = "Voter Id"
    }
    if (event.value == 'passportNumber') {
      this.selectedDocument = "Passport"
    }
    if (event.value == 'driversLicense') {
      this.selectedDocument = "Drivers License"
    }
    else if (event.value == 'aadhaarNumber') {
      this.selectedDocument = "Aadhar Number"
    }
  }
  getGenderLabel(gender: string): string {
    if (!gender) return '';
    return gender.toLowerCase() == 'm' ? 'Male' :
      gender.toLowerCase() == 'f' ? 'Female' : gender;
  }

  formatIndianNumber(value: any): string {
    if (value === null || value === undefined) return '';
    return Number(value).toLocaleString('en-IN');
  }
  getUserDetails() {
    this.apiService.getUserDetails(this.quoteID).subscribe((newData: any) => {
      console.log(newData); this.userData = newData;
    });
  }

  getProposalApi() {
    this.apiService.getProposalApi(this.quoteID).subscribe((data: any) => {
      this.premiumJson = data.premiumJson;
      this.providerId = this.premiumJson.provider_id;
      this.quoteJson = data.quoteJson;
      this.proposalJson = data.proposalJson;
      if (this.proposalJson) {
        this.detailsFormGroup.patchValue({
          custExisting: this.proposalJson.basicDetails.custExisting,
          custFirstBuyer: this.proposalJson.basicDetails.custFirstBuyer,
          custName: this.proposalJson.basicDetails.custName,
          customerDOB: this.proposalJson.basicDetails.customerDOB,
          customerEmpStatus: this.proposalJson.basicDetails.customerEmpStatus,
          userMartialStatus: this.proposalJson.basicDetails.userMartialStatus
        });
        this.nomineeFormGroup.patchValue({
          nomineeTitle: this.proposalJson.nomineeDetails.nomineeTitle,
          nomineeFullName: this.proposalJson.nomineeDetails.nomineeFullName,
          nomineeRelation: this.proposalJson.nomineeDetails.nomineeRelation,
          nomineeDob: this.proposalJson.nomineeDetails.nomineeDob,
        });
        this.contactFormGroup.patchValue({
          addressline1: this.proposalJson.contactDetails.addressline1,
          addressline2: this.proposalJson.contactDetails.addressline2,
          addressline3: this.proposalJson.contactDetails.addressline3,
          customerCity: this.proposalJson.contactDetails.customerCity,
          customerState: this.proposalJson.contactDetails.customerState,
          customerCountry: this.proposalJson.contactDetails.customerCountry,
          customerPincode: this.proposalJson.contactDetails.customerPincode,
          customerLandmark: this.proposalJson.contactDetails.customerLandmark,
          customerDocumentValue: this.proposalJson.contactDetails.customerDocumentValue,
          customerDocumentType: this.proposalJson.contactDetails.customerDocumentType,
        });
        this.coversFormGroup.patchValue({
          criticalIllness: this.proposalJson.covers.criticalIllness,
          criticalIllnessOption: this.proposalJson.covers.criticalIllnessOption,

        });

      }
      else {
        this.detailsFormGroup.patchValue({
          custName: this.quoteJson.custName,
          customerDOB: this.quoteJson.customerDOB,
          customerEmpStatus: this.quoteJson.customerEmpStatus,
        });
      }

    });
  }

  goNextTab() {

    this.selectedTabIndex = this.selectedTabIndex + 1; // 0 = Covers, 1 = Basic Details
    this.storeProposal();

  }
  goToBasicDetails() {
    if (this.coversFormGroup.valid) {
      this.selectedTabIndex = this.selectedTabIndex + 1; // 0 = Covers, 1 = Basic Details
      this.storeProposal();
    }
  }
  goToNomineeDetails() {
    if (this.detailsFormGroup.valid) {
      this.selectedTabIndex = this.selectedTabIndex + 1; // 0 = Covers, 1 = Basic Details
      this.storeProposal();
    }
  }
  goToContactDetails() {
    if (this.nomineeFormGroup.valid) {
      this.selectedTabIndex = this.selectedTabIndex + 1; // 0 = Covers, 1 = Basic Details
      this.storeProposal();
    }
  }

  goPreviousTab() {
    this.selectedTabIndex = this.selectedTabIndex - 1; // 0 = Covers, 1 = Basic Details
  }

  storeProposal() {
    console.log(this.detailsFormGroup.value);
    const proposalJson = {
      covers: {
        ...this.coversFormGroup.value
      },
      basicDetails: {
        ...this.detailsFormGroup.value
      },
      nomineeDetails: {
        ...this.nomineeFormGroup.value
      },
      contactDetails: {
        ...this.contactFormGroup.value
      }
    }
    const serviceUrl = "https://uatweb.finarray.in/php-services/life-services/service.php?action=STORE_PROPOSAL";
    this.apiService.storeProposal(this.quoteJson, proposalJson, this.premiumJson, serviceUrl).subscribe((data) => console.log(data));

  }
  async navigateToConfirmation() {
    if (this.providerId != 2 && this.contactFormGroup.valid) {
      this.storeProposal();
      this.apiService.trackButton(this.quoteID, this.quoteID, 3, 2, window.location.href, 'https://uatweb.finarray.in/php-services/life-services/service.php?action=TRACK_BUTTON').subscribe();
      this.router.navigate(['/proposal-confirmation/qid', this.quoteID]);
    }
    if (this.providerId == 2 && this.detailsFormGroup.valid) {
      if (this.providerId === 2 && this.detailsFormGroup.valid) {
        try {
          await this.calculateBajajPremium();
          await this.storeProposal();

          this.apiService.trackButton(
            this.quoteID,
            this.quoteID,
            3,
            2,
            window.location.href,
            'https://uatweb.finarray.in/php-services/life-services/service.php?action=TRACK_BUTTON'
          ).subscribe();

          this.router.navigate(['/proposal-confirmation/qid', this.quoteID]);
        } catch (e) {
          console.error('Navigation blocked due to error', e);
        }
      }
    }

  }
  // navigateToConfirmation() {
  //   if (this.providerId != 2 && this.contactFormGroup.valid) {
  //     this.storeProposal();
  //     this.apiService.trackButton(this.quoteID, this.quoteID, 3, 2, window.location.href, 'https://uatweb.finarray.in/php-services/life-services/service.php?action=TRACK_BUTTON').subscribe();
  //     this.router.navigate(['/proposal-confirmation/qid', this.quoteID]);
  //   }
  //   if (this.providerId == 2 && this.detailsFormGroup.valid) {
  //     this.storeProposal();
  //     this.apiService.trackButton(this.quoteID, this.quoteID, 3, 2, window.location.href, 'https://uatweb.finarray.in/php-services/life-services/service.php?action=TRACK_BUTTON').subscribe();
  //     this.router.navigate(['/proposal-confirmation/qid', this.quoteID]);
  //   }

  // }
  calculateICICIPremium() {
    this.recalculateStatus = true;
    this.apiService.getQuotesList(
      this.quoteJson,
      this.source_user,
      this.user_code,
      this.quoteID,
      this.userData,
      this.providerId,
      this.quoteID,
      null,
      null, null,
      this.coversFormGroup.value,
    ).subscribe((data: any) => {
      for (let i = 0; i <= data.length; i++) {
        if (data[i].product_code == this.premiumJson.product_code) {
          this.premiumJson = data[i];
          console.log("data is", data[i]);
          this.recalculateStatus = false;
        }
      }
    })
  }
  // calculateBajajPremium() {
  //   this.recalculateStatus = true;
  //   this.apiService.getQuotesList(
  //     this.quoteJson,
  //     this.source_user,
  //     this.user_code,
  //     this.quoteID,
  //     this.userData,
  //     this.providerId,
  //     this.quoteID,
  //     null,
  //     this.detailsFormGroup.get('custExisting').value,
  //     this.detailsFormGroup.get('custFirstBuyer').value,
  //     null
  //   ).subscribe((data: any) => {
  //     for (let i = 0; i <= data.length; i++) {
  //       if (data[i].product_code == this.premiumJson.product_code) {
  //         this.premiumJson = data[i];
  //         console.log("data is", data[i]);
  //         this.recalculateStatus = false;
  //       }
  //     }
  //   })
  // }
  calculateBajajPremium(): Promise<void> {
    this.recalculateStatus = true;

    return new Promise((resolve, reject) => {
      const custExisting =
        this.detailsFormGroup.get('custExisting')
          ? this.detailsFormGroup.get('custExisting').value
          : null;

      const custFirstBuyer =
        this.detailsFormGroup.get('custFirstBuyer')
          ? this.detailsFormGroup.get('custFirstBuyer').value
          : null;

      this.apiService.getQuotesList(
        this.quoteJson,
        this.source_user,
        this.user_code,
        this.quoteID,
        this.userData,
        this.providerId,
        this.quoteID,
        null,
        custExisting,
        custFirstBuyer,
        null
      ).subscribe({
        next: (data: any[]) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].product_code === this.premiumJson.product_code) {
              this.premiumJson = data[i];
              console.log('Matched premium:', data[i]);
              break;
            }
          }
          this.recalculateStatus = false;
          resolve();   // ✅ completed
        },
        error: (err) => {
          this.recalculateStatus = false;
          reject(err);
        }
      });
    });
  }
  customerSwitch(fieldName: string) {

    const custExistingCtrl = this.detailsFormGroup.get('custExisting');
    const custFirstBuyerCtrl = this.detailsFormGroup.get('custFirstBuyer');

    if (fieldName === 'exsistingCustomer') {

      if (custExistingCtrl.value === 'yes') {
        custFirstBuyerCtrl.setValue('no');
      } else if (custExistingCtrl.value === 'no') {
        custFirstBuyerCtrl.setValue('yes');
      }
      else {
        custFirstBuyerCtrl.setValue('');
      }

    } else {

      if (custFirstBuyerCtrl.value === 'yes') {
        custExistingCtrl.setValue('no');
      } else if (custFirstBuyerCtrl.value === 'no') {
        custExistingCtrl.setValue('yes');
      }
      else {
        custFirstBuyerCtrl.setValue('');
      }

    }

    //  this.calculateBajajPremium();
  }
  checkLength(value, len: number, fldName: any) {
    if (value.length > len) {
      // tslint:disable-next-line: radix
      this.nomineeFormGroup.get(fldName).setValue(parseInt(value.substring(0, len)));
    }
    if (value && value.length === 6) {
      this.getCityStateCountryFromPincode(value);
    } else {
      // reset if pincode incomplete
      this.contactFormGroup.patchValue({
        customerCity: '',
        customerState: '',
        customerCountry: ''
      });
    }
  }
  getCityStateCountryFromPincode(pincode: string) {
    const url =
      'https://uatweb.insurancepe.com/php-services/health-services/api.php' +
      `?action=get_state_city_from_pincode&pincode=${pincode}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.city && res.state) {
          this.contactFormGroup.patchValue({
            customerCity: res.city,
            customerState: res.state,
            customerCountry: 'India'
          });
        }
      },
      error: (err) => {
        console.error('Pincode API failed', err);
        this.contactFormGroup.patchValue({
          customerCity: '',
          customerState: '',
          customerCountry: ''
        });
      }
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  backToListing() {
    this.router.navigate(['/listing/qid', this.quoteID]);
  }
  // callPlanDetails(){
  //   this.apiService.getQuotesList(
  //     this.quoteJson,
  //     this.source_user,
  //     this.user_code,
  //     this.quoteID,
  //     this.filterFormGroup.getRawValue(),
  //     serviceId
  //   ).
  // }




}

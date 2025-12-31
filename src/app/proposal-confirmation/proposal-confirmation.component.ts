import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var bootstrap: any;
@Component({
  selector: 'app-proposal-confirmation',
  templateUrl: './proposal-confirmation.component.html',
  styleUrls: ['./proposal-confirmation.component.scss']
})
export class ProposalConfirmationComponent implements OnInit {
  premiumJson: any;
  quoteJson: any;
  proposalJson: any;
  quoteId:any;
  userData:any;
  source_user = "100001";
  user_code = "100001";
  nomineeDetails:any;
  quoteUrl:any;
   @ViewChild('shareDialogTemplate', { static: false }) shareDialogTemplate!: TemplateRef<any>;
  refEmailAddress: string = "";
toastMessage = '';
toastClass = 'bg-success';
  @ViewChild('confirmDialogTemplate', { static: false }) confirmDialogTemplate!: TemplateRef<any>;
   @ViewChild('toastEl', { static: false }) toastEl: any;
   copied = false;
  constructor(private router: Router, public dialog: MatDialog,private _formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute,) { }

  ngOnInit() {
    this.quoteId = this.route.snapshot.paramMap.get('quoteId');
    this.getProposalApi();

      this.quoteUrl = window.location.href;

  }
  getProposalApi() {
    this.apiService.getProposalApi(this.quoteId).subscribe((data: any) => {
      this.premiumJson = data.premiumJson;
      this.quoteJson = data.quoteJson;
      this.proposalJson = data.proposalJson;
    
      // if(this.proposalJson != ""){
      //   this.userData = this.proposalJson.basicDetails;
      // }
      // else{
        this.userData = this.quoteJson;
        this.nomineeDetails = data.proposalJson.nomineeDetails;
        this.refEmailAddress=this.userData.custEmail;
      // }
    });
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
  copyUrl(){
    //navigator.clipboard.writeText(window.location.href);
    navigator.clipboard.writeText(this.quoteUrl).then(() => {
      this.copied = true;

      // Reset the message after 2 seconds
      setTimeout(() => (this.copied = false), 2000);
    });
  }
   openConfirmationDialog():void{
     this.dialog.open(this.confirmDialogTemplate);
  }
  redirectToPayment(){
    if(this.premiumJson.provider_id !=2){
      this.apiService.getIciciProposal( 
      this.quoteJson,
      this.proposalJson,
      this.source_user,
      this.user_code,
      this.quoteId,
    ).subscribe((url: string) => {
      if (url) {
        this.apiService.trackButton(this.quoteId,this.quoteId,4,3,window.location.href,'https://uatweb.finarray.in/php-services/life-services/service.php?action=TRACK_BUTTON').subscribe();
        this.apiService.submitQuoteCrm(this.quoteJson,this.quoteJson,null,this.premiumJson).subscribe(data=>console.log(data));
        const newTab = window.open('', '_blank');
      // Redirect to the URL
      newTab.location.href = url;
      }
    });
    }
     if(this.premiumJson.provider_id == 2){
      this.apiService.submitQuoteCrm(this.quoteJson,this.quoteJson,this.quoteId,this.premiumJson).subscribe(data=>console.log(data));
      this.apiService.trackButton(this.quoteId,this.quoteId,4,3,window.location.href,'https://uatweb.finarray.in/php-services/life-services/service.php?action=TRACK_BUTTON').subscribe();
      window.open('https://blsht.in/BJAZLI/dCaWde', '_blank');
     }
    
  }
  backToListing()
  {
    this.router.navigate(['/listing/qid', this.quoteId]);
  }
 backToProposal() {
  this.router.navigate(
    ['/proposal/qid', this.quoteId],
    { queryParams: { tab: 1 } }  
  );
}
 backToProposalNominee() {
  this.router.navigate(
    ['/proposal/qid', this.quoteId],
    { queryParams: { tab: 2 } }  
  );
  }
  openShareDialog(): void {

    this.dialog.open(this.shareDialogTemplate);
  }
  sendQuoteViaEmail() {
  this.apiService.shareQuoteMail(this.quoteUrl, this.refEmailAddress)
    .subscribe(
      (res: any) => {
        this.showEmailToast(res.message, res.status);
      },
      () => {
        this.showEmailToast('Something went wrong. Please try again.', 'error');
      }
    );
  }
  showEmailToast(message: string, status: string) {
  this.toastMessage = message;

  // Change color based on status
  this.toastClass = status === 'success' ? 'bg-success' : 'bg-danger';

  const toast = new bootstrap.Toast(this.toastEl.nativeElement, {
    delay: 3000
  });

  toast.show();
}
  //  calculateBajajPremium(){
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
  // this.detailsFormGroup.get('custExisting').value,
  // this.detailsFormGroup.get('custFirstBuyer').value,
  // null
  //   ).subscribe((data:any) => {
  //     for(let i=0;i<=data.length;i++)
  //     {
  //       if(data[i].product_code == this.premiumJson.product_code){
  //         this.premiumJson = data[i];
  //         console.log("data is",data[i]);
  //         this.recalculateStatus = false;
  //       }
  //     }
  //   })
  // }
}

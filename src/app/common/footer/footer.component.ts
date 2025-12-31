import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  public panelOpenState: boolean = false;
  
	uiStyle:any;
	isSponsored:boolean=false;
	logo:string='assets/quote/img/logo.png';
	ftrColor:string='#055ba9';

  constructor(private apiService: ApiService,private http:HttpClient) { }
  generateUi(){
		this.apiService.getUiColors$.subscribe((data) => {
			this.uiStyle = data;
			this.ftrColor=`${this.uiStyle.ftrColor}`;
			this.isSponsored=this.uiStyle.isSponsored;
			this.logo=this.uiStyle.logoUrl;
		})
    
	};
	footerData: any[] = [];
  hostKey = '';
  ngOnInit() {
    this.generateUi();
	this.detectHost();
    this.loadFooterData();
  }
  detectHost() {
    const host = window.location.hostname.toLowerCase();

    if (host.indexOf('finarray') > -1) {
      this.hostKey = 'finarray';
    } else if (host.indexOf('synergy-insurance') > -1) {
      this.hostKey = 'synergy-insurance';
    } else if (host.indexOf('mutualglobal') > -1) {
    } else if (host.indexOf('justpolicy') > -1) {
      this.hostKey = 'justpolicy';
    } else if (host.indexOf('mutualglobal') > -1) {
      this.hostKey = 'mutualglobal';
    } else if (host.indexOf('insurancepe') > -1) {
      this.hostKey = 'insurancepe';
    } else if (host.indexOf('insuright') > -1) {
      this.hostKey = 'insuright';
    } else {
      this.hostKey = 'finarray'; // default fallback
    }
  }
   loadFooterData() {
    this.http.get<any>('assets/domainFooterDetails/domainFooter.json')
      .subscribe(data => {
        if (data && data[this.hostKey] && data[this.hostKey].content) {
          this.footerData = data[this.hostKey].content;
        }
      });
  }
}

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

  constructor(private apiService: ApiService) { }
  generateUi(){
		this.apiService.getUiColors$.subscribe((data) => {
			this.uiStyle = data;
			this.ftrColor=`${this.uiStyle.ftrColor}`;
			this.isSponsored=this.uiStyle.isSponsored;
			this.logo=this.uiStyle.logoUrl;
		})
    
	}
  ngOnInit() {
    this.generateUi();
  }
}

import { Component, AfterViewInit, AfterContentChecked, AfterViewChecked, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Title, Meta } from '@angular/platform-browser';

import { SeoService } from './services/seo.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
	title = 'term-life';
	pageTitle: string	= 'Term Insurance - Buy Term Insurance Plans Online in 2020';
	constructor(
		public _router: Router,
		private titleService: Title,
		private metaService: Meta,
		private route: ActivatedRoute,
		private seoService: SeoService,
		private ser : ApiService
	) {}
	showHeader: boolean= false;
  
	// UPDATE SEO META TAGS
	setSeoTagsData() {		
		let date = new Date();
		let day	=date.getDate();
		let month = date.toLocaleString('default', { month: 'long' });
		let year	=date.getFullYear();
		let full_date	=`${day} ${month}, ${year}`;
		
		const metaKeyWords	='term life insurance, term insurance, life insurance, best term plan, buy best term plan policy, term life plans, term plan';
		const metaDescription	=`Term Insurance: Buy the best term life insurance plan online in India for lowest price. Compare and buy the best term insurance plans starting at just Rs. 18 per day`;	
		this.seoService.setpageTitle(this.pageTitle);
		this.seoService.createLinkForCanonicalURL('https://www.gibl.in/term-life-insurance/');
		this.seoService.setMetaData(metaKeyWords, metaDescription);
	}
	
	ngOnInit() {
		this.setSeoTagsData();
		this.ser.setFavicon();
	}

	ngAfterViewInit() {
		const curObj  = this;
		setTimeout(function() { curObj.showHeader = true; }, 100);
	}
}

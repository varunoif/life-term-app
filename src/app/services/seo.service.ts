import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse  } from  '@angular/common/http';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  	constructor(
		private  httpClient: HttpClient,
		protected localStorage: LocalStorage,
		private titleService: Title,
		private metaService: Meta,
		@Inject( DOCUMENT ) public document: HTMLDocument
	) { }

  	setpageTitle(pageTitle: string) {
  		this.titleService.setTitle(pageTitle);
  	}

  	setMetaData(metaKeyWords: string, metaDescription: string) {
  		this.metaService.addTags([
			{name: 'keywords', content: metaKeyWords},
			{name: 'description', content: metaDescription},
			{name: 'robots', content: 'index, follow'}
		]);
  	}

	createLinkForCanonicalURL(URL: string) {
      let link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
      link.setAttribute('href', URL);
   	}
	
	removeH1Tag(){
		let rob_elem=this.document.querySelector('h1[id="default"]');
		if( rob_elem ){
			rob_elem.parentNode.removeChild(rob_elem);
		}
	}
}

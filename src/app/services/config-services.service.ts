import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigServicesService {
   private config: any;
  constructor(private http:HttpClient) { }
  loadConfig(): Promise<void> {
    const url = `assets/brokerConfig/synergy-insurance.json?v=${Date.now()}`; // cache-buster
    return this.http.get(url).toPromise().then(cfg => {
      this.config = cfg;
    });
  }

  // getServicesByHost(host: string) {
  //   if (host.includes('finarray')) {
  //     return this.config.services.finarray;
  //   }
  //   if (host.includes('synergy')) {
  //     return this.config.services.synergy;
  //   }
  //   if (host.includes('localhost')) {
  //     return this.config.services.localhost;
  //   }
  //   return {};
  // }
  getServicesByHost(host: string) {
  const servicesByHost = this.config.services || {};

  // Loop through keys like finarray, synergy-insurance, etc.
  for (const key of Object.keys(servicesByHost)) {
    if (host.includes(key)) {
      return servicesByHost[key];
    }
  }

  return {};
}
}

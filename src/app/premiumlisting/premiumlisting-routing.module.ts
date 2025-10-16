import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent} from './component/listing.component';

import { ApiService } from "../services/api.service";

const routes: Routes = [
  { 
    path: '', 
    component: ListingComponent,
    resolve:{
      movie:ApiService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiumlistingRoutingModule { }

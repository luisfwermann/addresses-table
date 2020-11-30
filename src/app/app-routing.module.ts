import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddressTableComponent} from './address/components/table/address-table.component';

const routes: Routes = [
  {path: '**', component: AddressTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

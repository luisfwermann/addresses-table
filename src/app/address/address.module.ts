import {NgModule} from '@angular/core';
import {AddressTableComponent} from './components/table/address-table.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AddressTableComponent,
  ],
  exports: [
    AddressTableComponent,
  ],
})
export class AddressModule { }

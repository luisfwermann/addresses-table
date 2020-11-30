import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {AddressService} from '../../../core/services/address.service';
import {TableVirtualScrollDataSource} from 'ng-table-virtual-scroll';
import {AddressModel} from '../../../core/models/address.model';

@Component({
  selector: 'address-table',
  templateUrl: './address-table.html',
  styleUrls: ['./address-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressTableComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  dataSource: TableVirtualScrollDataSource<AddressModel> = new TableVirtualScrollDataSource();
  tableColumns = ['streetNumber', 'street', 'city', 'zip', 'state'];
  heightViewport = 'calc(100% - 64px)';

  constructor(private service: AddressService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listAddresses();
  }

  /**
   * List the addresses of the table.
   */
  listAddresses(): void {
    this.service.getAddresses().subscribe((d) => {
      this.dataSource.data = d;
      this.dataSource.sort = this.sort;
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Saves all the addresses.
   */
  saveAdresses(): void {
    // Don't subscribes because the API does not exists
    this.service.saveAddresses(this.dataSource.data);
  }
}

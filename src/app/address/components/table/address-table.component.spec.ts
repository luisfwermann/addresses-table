import {of} from 'rxjs';
import {AddressModel} from '../../../core/models/address.model';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AddressTableComponent} from './address-table.component';
import {AddressService} from '../../../core/services/address.service';
import {SharedModule} from '../../../shared/shared.module';
import {ChangeDetectionStrategy} from '@angular/core';

// This const can be updated in the future, if the new problems are found
const ADDRESSES = [
  {streetNumber: '1', street: 'Jesse Hill Jr Street', city: 'Atlanta', state: 'TN', zip: '30309'},
  {streetNumber: '23', street: 'Peachtree Street', city: 'Atlanta', state: 'TN', zip: '30301'},
  {streetNumber: '32', street: 'Glen Iris Drive NE', city: 'Brookhaven', state: 'FL', zip: '30309'},
  {streetNumber: '12357', street: 'Glen Iris Drive NE', city: 'Sandy Sprints', state: 'FL', zip: '30327'},
  {streetNumber: '2857', street: 'Jesse Hill Jr Street', city: 'Decatur', state: 'GA', zip: '30354'},
].map(a => Object.assign(new AddressModel(), a));

describe('AddressTableComponent', () => {
  let comp: AddressTableComponent;
  let addressService: AddressService;
  let fixture: ComponentFixture<AddressTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AddressTableComponent],
      providers: [AddressService],
    }).overrideComponent(AddressTableComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
    addressService = TestBed.inject(AddressService);
    fixture = TestBed.createComponent(AddressTableComponent);
    comp = fixture.componentInstance;
    comp.heightViewport = '1000px';
    spyOn(addressService, 'getAddresses').and.returnValue(of(ADDRESSES));
  });

  const expectRowCells = (data: { htmlRow: any, expectedValues: any }): void => {
    expect(data.htmlRow.cells[0].innerText).toBe(data.expectedValues.streetNumber);
    expect(data.htmlRow.cells[1].innerText).toBe(data.expectedValues.street);
    expect(data.htmlRow.cells[2].innerText).toBe(data.expectedValues.city);
    expect(data.htmlRow.cells[3].innerText).toBe(data.expectedValues.zip);
    expect(data.htmlRow.cells[4].innerText).toBe(data.expectedValues.state);
  };

  it('should list addresses', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const tableRows = fixture.nativeElement.querySelectorAll('tr');
      expect(comp.dataSource.data).toEqual(ADDRESSES);
      expect(tableRows.length).toBe(ADDRESSES.length + 1);

      // Test headers
      expectRowCells({ htmlRow: tableRows[0], expectedValues: {
        street: 'Street', streetNumber: 'Street Number', city: 'City', zip: 'Zip', state: 'State',
      }});

      // Test rows
      ADDRESSES.forEach((d: any, k: number) => {
        expectRowCells({ htmlRow: tableRows[k + 1], expectedValues: d });
      });
    });
  }));

  const expectSortBy = (column: string): void => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp.dataSource.sort = comp.sort;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.mat-column-' + column + ' .mat-sort-header-arrow');
      button.click();
      fixture.detectChanges();
      const sortedAsc = ADDRESSES.sort((a: any, b: any) => {
        if (column === 'streetNumber' || column === 'zip') {
          return a[column] - b[column];
        }
        if (a[column] > b[column]) {
          return 1;
        }
        if (a[column] < b[column]) {
          return -1;
        }
        return 0;
      });

      sortedAsc.forEach((a: any, k: number) => {
        const row = fixture.nativeElement.querySelectorAll('tr')[k + 1];
        expectRowCells({ htmlRow: row, expectedValues: a });
      });

      button.click();
      fixture.detectChanges();
      const sortedDesc = ADDRESSES.sort((a: any, b: any) => {
        if (column === 'streetNumber' || column === 'zip') {
          return b[column] - a[column];
        }
        if (a[column] > b[column]) {
          return -1;
        }
        if (a[column] < b[column]) {
          return 1;
        }
        return 0;
      });
      sortedDesc.forEach((a: any, k: number) => {
        const row = fixture.nativeElement.querySelectorAll('tr')[k + 1];
        expectRowCells({ htmlRow: row, expectedValues: a });
      });
    });
  };

  it('should order addresses by streetNumber', waitForAsync(() => {
    expectSortBy('streetNumber');
  }));

  it('should order addresses by street', waitForAsync(() => {
    expectSortBy('street');
  }));

  it('should order addresses by city', waitForAsync(() => {
    expectSortBy('city');
  }));

  it('should order addresses by zip', waitForAsync(() => {
    expectSortBy('zip');
  }));

  it('should order addresses by state', waitForAsync(() => {
    expectSortBy('state');
  }));

  const expectEditRow = (data: { index: number; event: 'keyup' | 'click', isCancel?: boolean }) => {
    // Test every column
    const mock = { } as any;
    const address = ADDRESSES[data.index] as any;
    Object.keys(address).forEach((k) => {
      const editCell = fixture.nativeElement.querySelectorAll('.mat-cell.mat-column-' + k)[data.index];
      editCell.click();
      fixture.detectChanges();

      const input = editCell.querySelector('input');
      input.value = address[k] + (data.isCancel ? '' : data.index);
      mock[k] = input.value;
      fixture.detectChanges();

      if (data.event === 'keyup') {
        input.dispatchEvent(new KeyboardEvent('keyup', { key: data.isCancel ? 'Escape' : 'Enter' }));
      } else {
        editCell.querySelector('.cell-editable-' + (data.isCancel ? 'cancel' : 'save')).click();
      }
      fixture.detectChanges();
    });

    expectRowCells({ htmlRow: fixture.nativeElement.querySelectorAll('tr')[data.index + 1], expectedValues: mock });
    expect(comp.dataSource.data[data.index]).toEqual(Object.assign(new AddressModel(), mock));
  };

  it('should be able to edit cells of row', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expectEditRow({ index: 0, event: 'click' });
      expectEditRow({ index: 1, event: 'keyup' });
      expectEditRow({ index: 2, event: 'click' });
    });
  }));

  it('should be able to cancel the edit of the cells of a row', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expectEditRow({ index: 0, event: 'click', isCancel: true });
      expectEditRow({ index: 1, event: 'keyup', isCancel: true });
      expectEditRow({ index: 2, event: 'click', isCancel: true });
    });
  }));
});

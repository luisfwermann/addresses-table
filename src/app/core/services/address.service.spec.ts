import { TestBed } from '@angular/core/testing';

import {AddressService} from './address.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AddressModel} from '../models/address.model';

const ADDRESSES: AddressModel[] = [
  {streetNumber: '1', street: 'Jesse Hill Jr Street', city: 'Atlanta', state: 'TN', zip: '30309'},
  {streetNumber: '23', street: 'Peachtree Street', city: 'Atlanta', state: 'TN', zip: '30301'},
  {streetNumber: '32', street: 'Glen Iris Drive NE', city: 'Brookhaven', state: 'FL', zip: '30309'}
].map(a => Object.assign(new AddressModel(), a));

const ADDRESSES_STRING = '1 Jesse Hill Jr Street, Atlanta, TN 30309\n' +
  '23 Peachtree Street, Atlanta, TN 30301\n' +
  '32 Glen Iris Drive NE, Brookhaven, FL 30309'
;

describe('AddressService', () => {
  let service: AddressService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule],
      providers: [AddressService],
    });
    service = TestBed.inject(AddressService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get addresses', () => {
    service.getAddresses().subscribe((addresses) => {
      expect(ADDRESSES).toEqual(addresses);
    });

    const req = httpTestingController.expectOne(service.BASE_URL);
    expect(req.cancelled).toBeFalsy();
    req.flush(ADDRESSES_STRING);
  });

  it('should save addresses', () => {
    service.saveAddresses(ADDRESSES).subscribe((addresses) => {
      expect(addresses).toEqual(ADDRESSES_STRING);
    });

    const req = httpTestingController.expectOne(service.BASE_URL);

    expect(req.cancelled).toBeFalsy();
    req.flush(ADDRESSES_STRING);
  });

});

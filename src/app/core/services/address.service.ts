import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AddressModel} from '../models/address.model';

@Injectable()
export class AddressService {
  static baseUrl = 'https://0f1c6e64.s3.amazonaws.com/addresses.txt';

  constructor(private http: HttpClient) {}

  /**
   * Get's all addresses from the file.
   */
  getAddresses(): Observable<AddressModel[]> {
    return this.http.get(AddressService.baseUrl, { responseType: 'text' }).pipe(
      map(txt => {
        /**
         * Extracts detail about the address from a line like:
         * 1 Jesse Hill Jr Street, Atlanta, TN 30309
         *
         * Results in:
         * Group 1: 1 (streetNumber)
         * Group 2: Jesse HIll Jr Street (street)
         * Group 3: Atlanta (city)
         * Group 4: TN (state)
         * Group 5: 30390 (zip)
         */
        const pattern = /(^\d*)\s(.+?),\s(.+?),\s(.{2})\s(\d*)/gm;
        const formatted = [];

        while (true) {
          const arr = pattern.exec(txt);
          if (!arr) {
            break;
          }
          formatted.push(Object.assign(new AddressModel(), {
            streetNumber: arr[1],
            street: arr[2],
            city: arr[3],
            state: arr[4],
            zip: arr[5]
          }));
        }

        return formatted;
      }),
    );
  }

  /**
   * Creates an observable to save the data.
   *
   * @param data Addresses to save
   */
  saveAddresses(data: AddressModel[]): Observable<any> {
    /**
     * Format the values, so it matches the same structure (regex) that we used while reading the file,
     * so here we have to remove some commas and non numeric values
     * This could have been done in many different ways, maybe validating the input while the user types it
     * But since I don't  have any information on how and when this addresses must be saved, I'm assuming we
     * need the same structure as before
     */
    const txt = data.map(r => {
      let rowTxt = r.streetNumber.replace(/\D/g, '') + ' ';
      rowTxt += r.street.replace(/,/g, '') + ', ';
      rowTxt += r.city.replace(/,/g, '') + ', ';
      rowTxt += r.state.substr(0, 2) + ' ';
      rowTxt += r.zip.replace(/\D/g, '');
      return rowTxt;
    }).join('\n');

    return this.http.post(AddressService.baseUrl, txt);
  }

}


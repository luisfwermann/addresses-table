import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {TableVirtualScrollModule} from 'ng-table-virtual-scroll';
import {AppRoutingModule} from '../app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {CellEditableDirective} from './directives/cell-editable.directive';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    CellEditableDirective,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    ScrollingModule,
    TableVirtualScrollModule,
  ],
  exports: [
    BrowserAnimationsModule,
    CellEditableDirective,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    ScrollingModule,
    TableVirtualScrollModule,
  ]
})
export class SharedModule { }

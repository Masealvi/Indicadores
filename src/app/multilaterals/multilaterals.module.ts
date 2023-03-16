import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultilateralsRoutingModule } from './multilaterals-routing.module';
import { TabMainMComponent } from './tab-main-m/tab-main-m.component';
import { SummaryComponent } from './tab-main-m/summary/summary.component';
import { ComparativeComponent } from './tab-main-m/comparative/comparative.component';
import { PositioningComponent } from './tab-main-m/positioning/positioning.component';
import { AirTransportComponent } from './tab-main-m/airTransport/air-transport.component';
import { RailwaysComponent } from './tab-main-m/railways/railways.component';
import { MarineTransportComponent } from './tab-main-m/marineTransport/marine-transport.component';
import { WorldComparisonComponent } from './tab-main-m/worldComparison/world-comparison.component';
import { PatentsComponent } from './tab-main-m/patents/patents.component';
import { ComparisonByMeasuresComponent } from './tab-main-m/comparisonByMeasures/comparison-by-measures.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { ChartModule } from 'angular-highcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { HighchartsChartModule } from 'highcharts-angular'

@NgModule({
  declarations: [
    TabMainMComponent,
    SummaryComponent,
    ComparativeComponent,
    PositioningComponent,
    AirTransportComponent,
    RailwaysComponent,
    MarineTransportComponent,
    WorldComparisonComponent,
    PatentsComponent,
    ComparisonByMeasuresComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultilateralsRoutingModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatChipsModule,
    MatIconModule,
    ChartModule,
    HighchartsChartModule
  ]
})
export class MultilateralsModule { }

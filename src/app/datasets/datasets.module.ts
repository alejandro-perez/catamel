import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  DashboardComponent,
  DatablocksComponent,
  DatafilesComponent,
  DatasetDetailComponent,
  DatasetService,
  DatasetsFilterComponent,
  DatasetTableComponent
} from 'datasets/index';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  // MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatFormFieldModule,
  MatOptionModule,
} from '@angular/material';
import {SharedCatanieModule} from 'shared/shared.module';
import { SelectedListComponent } from 'datasets/selected-list/selected-list.component';
import { MatDatepickerModule } from 'saturn-datepicker';
@NgModule({
  imports : [
    MatCardModule, MatDialogModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatFormFieldModule, MatAutocompleteModule,
    MatTabsModule, MatInputModule, MatButtonModule, MatSortModule, CommonModule, FormsModule, ReactiveFormsModule,
    SharedCatanieModule, MatSelectModule, MatOptionModule, MatNativeDateModule, MatIconModule,
    MatListModule, MatDatepickerModule, MatTooltipModule
  ],
  declarations : [
    DashboardComponent, DatasetTableComponent, DatablocksComponent,
    DatafilesComponent, DatasetsFilterComponent, DatasetDetailComponent, SelectedListComponent
  ],
  providers : [ DatasetService ],
  exports : [ DatasetTableComponent, DatasetsFilterComponent ]
})
export class DatasetsModule {
}
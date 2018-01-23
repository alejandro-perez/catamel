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
  AutoCompleteModule,
  ConfirmationService,
  ConfirmDialogModule,
  DataTableModule,
  DialogModule,
  DropdownModule,
  SharedModule,
  TabViewModule,
  TreeModule,
  TreeTableModule
} from 'primeng/primeng';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
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
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {
  DatePickerModule
} from 'shared/modules/datepicker/datepicker.module';
import {SharedCatanieModule} from 'shared/shared.module';

@NgModule({
  imports : [
    MatCardModule, MatDialogModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatFormFieldModule, MatAutocompleteModule,
    MatTabsModule, MatInputModule, MatButtonModule, MatSortModule, CommonModule, FormsModule, DialogModule, ReactiveFormsModule,
    SharedCatanieModule, DataTableModule, SharedModule, TabViewModule,
    ConfirmDialogModule, TreeModule, TreeTableModule,
    DropdownModule, AutoCompleteModule,
    DatePickerModule
  ],
  declarations : [
    DashboardComponent, DatasetTableComponent, DatablocksComponent,
    DatafilesComponent, DatasetsFilterComponent, DatasetDetailComponent
  ],
  providers : [ DatasetService, ConfirmationService ],
  exports : [ DatasetTableComponent, DatasetsFilterComponent ]
})
export class DatasetsModule {
}
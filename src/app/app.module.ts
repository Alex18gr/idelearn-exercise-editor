import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppComponent } from './app.component';
import { ExerciseViewComponent } from './exercise/exercise-view/exercise-view.component';
import { from } from 'rxjs';
import { ExerciseRequirementsViewComponent } from './exercise/exercise-requirements-view/exercise-requirements-view.component';
import { ExerciseSubRequirementsViewComponent } from './exercise/exercise-sub-requirements-view/exercise-sub-requirements-view.component';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequirementEditDialogComponent } from './exercise/dialogs/requirement-edit-dialog/requirement-edit-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubRequirementEditDialogComponent } from './exercise/dialogs/sub-requirement-edit-dialog/sub-requirement-edit-dialog.component';
import { SubRequirementFormComponent } from './exercise/dialogs/sub-requirement-edit-dialog/sub-requirement-form/sub-requirement-form.component';
import { ExerciseEditDetailsDialogComponent } from './exercise/dialogs/exercise-edit-details-dialog/exercise-edit-details-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ExerciseFileService } from './exercise/file/exercise-file.service';
import { exerciseFileServiceFactory } from './exercise/file/exercise-file-service.factory';
import { ElectronService, NgxElectronModule } from 'ngx-electron';
import { StartPageComponent } from './home/start-page/start-page.component';
import { NewExerciseDialogComponent } from './exercise/dialogs/new-exercise-dialog/new-exercise-dialog.component';
import { FileUploadComponent } from './exercise/dialogs/exercise-edit-details-dialog/file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    ExerciseViewComponent,
    ExerciseRequirementsViewComponent,
    ExerciseSubRequirementsViewComponent,
    RequirementEditDialogComponent,
    SubRequirementEditDialogComponent,
    SubRequirementFormComponent,
    ExerciseEditDetailsDialogComponent,
    StartPageComponent,
    NewExerciseDialogComponent,
    FileUploadComponent,
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    DialogModule,
    BrowserAnimationsModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    HttpClientModule,
    NgxElectronModule,
    InputSwitchModule
  ],
  providers: [
    MessageService,
    { provide: ExerciseFileService, useFactory: exerciseFileServiceFactory, deps: [ElectronService] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

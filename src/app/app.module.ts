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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequirementEditDialogComponent } from './exercise/dialogs/requirement-edit-dialog/requirement-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ExerciseViewComponent,
    ExerciseRequirementsViewComponent,
    ExerciseSubRequirementsViewComponent,
    RequirementEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    DialogModule,
    BrowserAnimationsModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

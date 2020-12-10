import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppComponent } from './app.component';
import { ExerciseViewComponent } from './exercise/exercise-view/exercise-view.component';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    ExerciseViewComponent,
  ],
  imports: [
    BrowserModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

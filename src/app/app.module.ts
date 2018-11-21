import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//----------------------------- import MODULE Files -----------------------------//
import { AppRoutingModule } from './Modules/app-routing.module';
import { MaterialModule } from './Modules/material.module';
import { FirebaseModule } from './Modules/firebase.module';

//----------------------------- import Components-----------------------------//
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { ForgotpwdPageComponent } from './components/forgotpwd-page/forgotpwd-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ClickOutsideDirective } from './Directives/click-outside.directive';
import { LoginInputDirective } from './Directives/login-input.directive';
import { RenameListDirective } from './Directives/rename-list.directive';
import { EnterNewTaskDirective } from './Directives/enter-new-task.directive';
import { EditProfileDialogComponent } from './components/edit-profile-dialog/edit-profile-dialog.component';
import { RepeatingDialogComponent } from './components/repeating-dialog/repeating-dialog.component';
import { EnterNewTodaytaskDirective } from './Directives/enter-new-todaytask.directive';
import { ArchiveComponent } from './components/archive/archive.component';
import { ArchiveDetailsComponent } from './components/archive-details/archive-details.component';
import { StartingLogoComponent } from './components/starting-logo/starting-logo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent,
    ForgotpwdPageComponent,
    HomePageComponent,
    SideNavComponent,
    ClickOutsideDirective,
    LoginInputDirective,
    RenameListDirective,
    EnterNewTaskDirective,
    EditProfileDialogComponent,
    RepeatingDialogComponent,
    EnterNewTodaytaskDirective,
    ArchiveComponent,
    ArchiveDetailsComponent,
    StartingLogoComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FirebaseModule,
    MaterialModule,
  ],

  providers: [],

  bootstrap: [AppComponent],

  entryComponents: [EditProfileDialogComponent, RepeatingDialogComponent, ArchiveDetailsComponent], //for Angualr Material Dialog
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../components/login-page/login-page.component';
import { SignupPageComponent } from '../components/signup-page/signup-page.component';
import { ForgotpwdPageComponent } from '../components/forgotpwd-page/forgotpwd-page.component';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';

const routes: Routes = [
  { path: '', redirectTo: 'components/login-page', pathMatch: 'full' },
  { path: 'components/login-page', component: LoginPageComponent, data: {state: 'login'} },
  { path: 'components/signup-page', component: SignupPageComponent, data: {state: 'signup'} },
  { path: 'components/forgotpwd-page', component: ForgotpwdPageComponent, data: {state: 'forgetpwd'} },
  { path: 'components/home-page', component: HomePageComponent,data: {state: 'home'} },
  { path: 'components/side-nav', component: SideNavComponent,data: {state: 'sidenav'} },

  { path: '**', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})

export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../components/login-page/login-page.component';
import { SignupPageComponent } from '../components/signup-page/signup-page.component';
import { ForgotpwdPageComponent } from '../components/forgotpwd-page/forgotpwd-page.component';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';
import { AuthGuard } from '../Guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login-page', pathMatch: 'full' },
  { path: 'login-page', component: LoginPageComponent, data: { state: 'login' } },
  { path: 'signup-page', component: SignupPageComponent, data: { state: 'signup' } },
  { path: 'forgotpwd-page', component: ForgotpwdPageComponent, data: { state: 'forgetpwd' } },
  { path: 'home-page', component: HomePageComponent, data: { state: 'home' }, canActivate: [AuthGuard]  },
  { path: 'side-nav', component: SideNavComponent, data: { state: 'sidenav' }, canActivate: [AuthGuard] },

  { path: '**', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

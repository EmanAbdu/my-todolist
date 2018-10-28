import { ArchiveComponent } from './../components/archive/archive.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../components/login-page/login-page.component';
import { SignupPageComponent } from '../components/signup-page/signup-page.component';
import { ForgotpwdPageComponent } from '../components/forgotpwd-page/forgotpwd-page.component';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';
import { AuthGuard } from '../Guards/auth.guard';
import { Auth2Guard } from '../Guards/auth2.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login-page', pathMatch: 'full' },
  { path: 'login-page', component: LoginPageComponent, data: { state: 'login' }, canActivate: [Auth2Guard]  },
  { path: 'signup-page', component: SignupPageComponent, data: { state: 'signup' }, canActivate: [Auth2Guard]   },
  { path: 'forgotpwd-page', component: ForgotpwdPageComponent, data: { state: 'forgetpwd' }, canActivate: [Auth2Guard]  },
  { path: 'home-page', component: HomePageComponent, data: { state: 'home' }, canActivate: [AuthGuard]  },
  { path: 'side-nav', component: SideNavComponent, data: { state: 'sidenav' }, canActivate: [AuthGuard] },
  { path: 'archieve', component: ArchiveComponent, data: { state: 'archieve' }, canActivate: [AuthGuard] },

  { path: '**', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

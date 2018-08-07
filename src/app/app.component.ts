import { Component } from '@angular/core';
import { routerTransition } from './TodoAniamtions/router.animations';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition],
})
export class AppComponent {


  constructor() { }

  public getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}

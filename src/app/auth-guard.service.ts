import { Injectable } from '@angular/core';

import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './authentication.service';

 

@Injectable({

  providedIn: 'root'

})

export class AuthGuardService {

 

  constructor(private router: Router,

    private authService: AuthenticationService) { }

 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authService.isUserLoggedIn()) {

      // logged in so return true

      return true;

    }

 

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

    return false;

  }

}

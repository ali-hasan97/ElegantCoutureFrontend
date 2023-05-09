import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  isSeller = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.isUserLoggedInAtPresent().subscribe(loggedIn=>{
      this.isLoggedIn = loggedIn;
      console.log('menu ->' + this.isLoggedIn);
    });

    this.authenticationService.isSellerLoggedInAtPresent().subscribe(sellerLoggedIn=>{
      this.isSeller = sellerLoggedIn;
      console.log("seller? " + this.isSeller)
    });
  }

  handleLogout() {
    this.authenticationService.logout();
  }
}
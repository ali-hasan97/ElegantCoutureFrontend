import { Component, OnInit } from '@angular/core';

declare function retrieve(): void

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  ngOnInit(){
    retrieve();
  }
  public clear(){
    console.log("clearing storage");
    localStorage.clear();
    retrieve();
  }
}

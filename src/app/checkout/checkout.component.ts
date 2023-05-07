import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

class Product {
  productID: number;
  name: string;
  price: number;
  description: string;
  image: string;

  constructor(productID: number, name: string, price: number, description: string, image: string) {
    this.productID = productID;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  username!: any;

  constructor(private http: HttpClient) { }

  retrieve() {
    console.log("calling retrieve");

    const productList: Product[] = [];

    this.username = localStorage.getItem("userId");

    this.http.get(`http://localhost:9080/api/users/${this.username}/checkout`).subscribe(
      (response) => {
        console.log(response);

        for (const key in response) {
          const keyValue = key.split(", ");
          const productID = parseInt(keyValue[0].split("=")[1]);
          const name = keyValue[1].split("=")[1].slice(0, -1);
          const price = parseFloat(keyValue[2].split("=")[1]);
          const description = keyValue[3].split("=")[1].slice(0, -1);
          const image = keyValue[4].split("=")[1].slice(0, -1);
          const quantity = (response as any)[key];
    
          const product = new Product(productID, name, price, description, image);
          productList.push(product);
        }
    
        console.log(productList);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnInit(){
    this.retrieve();
  }
  public clear(){
    console.log("clearing storage");
    localStorage.clear();
    this.retrieve();
  }
}

import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

class Product {
  productID: number;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;

  constructor(productID: number, name: string, price: number, description: string, image: string, quantity: number) {
    this.productID = productID;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
    this.quantity = quantity;
  }
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  username!: any;
  total = 0;
  public productList: Product[] = [];
  productIDList!: number[];
  quantity!: number[];

  constructor(private http: HttpClient, private router: Router) { }

  display(productList: Product[]) {
    const cards = document.getElementById("products");
    if (cards) {
      productList.forEach(product => {
        const img = product.image != "null" ? `https://full-stack-images.s3.us-east-2.amazonaws.com/${product.image}` : "../../assets/img0.jpeg";
        const desc = typeof product.description !== undefined ? product.description : "No description provided";
        cards.innerHTML += 
        `<div class="item">
        <img src="${img}" alt="...">
        <div class="item-body">
            <h5 class="item-title" id="title${product.productID}">${product.name}</h5>
            <p class="item-text" id="desc">${desc}</p>
          <div class="item-price-quantity">
            <a class="btn btn-primary" id="btn${product.productID}" data-id="${product.productID}" data-name="${product.name}" data-price="${product.price}">$${product.price}</a>
            <h5>Qty: ${product.quantity}</h5>
          </div>
        </div>
        </div>`;

        this.total += product.quantity * product.price;
      });
    }
  }

  retrieve() {
    this.username = localStorage.getItem("userId");

    this.http.get(`http://localhost:9080/api/users/${this.username}/checkout`).subscribe(
      (response) => {

        // response format 
        // {
        //     "Listing{productID=7, name='Blah2', price=130.0, description='ruhroh5', image='null'}": 2,
        //     "Listing{productID=6, name='Blah', price=120.0, description='ruhroh5', image='null'}": 1,
        //     "Listing{productID=8, name='Blah3', price=45.0, description='ruhroh5', image='null'}": 1
        // }

        for (const key in response) {
          const keyValue = key.split(", ");
          const productID = parseInt(keyValue[0].split("=")[1]);
          const name = keyValue[1].split("=")[1].slice(1, -1);
          const price = parseFloat(keyValue[2].split("=")[1]);
          const description = keyValue[3].split("=")[1].slice(1, -1);
          const image = keyValue[4].split("=")[1].slice(1, -2);
          const quantity = (response as any)[key];
    
          const product = new Product(productID, name, price, description, image, quantity);
          this.productList.push(product);
        }
        console.log(this.productList);

        this.display(this.productList);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnInit(){
    this.retrieve();
  }

  clear() {
    console.log("clearing storage");
    this.http.delete(`http://localhost:9080/api/users/${this.username}/checkout`, {responseType: "text"}).subscribe(
      (response) => {
        // refreshing checkout page to update state
        this.router.navigateByUrl('/about', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/checkout'])
        })
      }, (error) => {
        console.error(error)
      }
    );
  }

  saveOrder() {

    // sends get request just to indicate to backend to save the temporary order for the specified username in the database
    this.http.get(`http://localhost:9080/api/orders/user/${this.username}`, {responseType: "text"}).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

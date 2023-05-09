import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

class Product {
  productID!: number;
  name!: string;
  price!: number;
  quantity!: number;
  description!: string;
  image!: string;

  constructor(productID:number, name: string, price: number, quantity: number, description: string, image: string) {
    this.productID = productID;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.description = description;
    this.image = image;
  }
}

interface Order {
  orderID: number;
  customer: string;
  products: Product[];
  total: number;
}

interface ProductQuantityPair {
  [key: string]: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  orders: Order[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    // format for get order response. productQuantityPairs is one giantly long string
    // [
    //   {
    //       "orderID": 3,
    //       "user": "genericUser",
    //       "productQuantityPairs": "{Listing{productID=6, name='Blah', price=120.0, description='This is an elegant black Sari on a beautiful lady called Zara Barlas.', image='null'}=1, Listing{productID=7, name='Blah2', price=130.0, description='ruhroh5', image='null'}=1}"
    //   },
    //   {
    //       "orderID": 4,
    //       "user": "genericUser",
    //       "productQuantityPairs": "{Listing{productID=7, name='Blah2', price=130.0, description='ruhroh5', image='null'}=1, Listing{productID=11, name='shrink', price=1.0, description='ruhroh5', image='null'}=2, Listing{productID=6, name='Blah', price=120.0, description='This is an elegant black Sari on a beautiful lady called Zara Barlas.', image='null'}=1}"
    //   }
    // ]

    this.http.get<any[]>('http://localhost:9080/api/orders').subscribe(
      response => {
        this.orders = response.map(orderData => {
          let products: Product[] = [];
          let total = 0;
          const productQuantityPairs = orderData.productQuantityPairs;
          const productQuantityPairsRegex = /Listing\{productID=\d+, name='[^']+', price=\d+\.\d+, description='[^']*', image='[^']+'\}=\d+/g;
          const productQuantityPairsArray = productQuantityPairs.match(productQuantityPairsRegex);

          productQuantityPairsArray.forEach((key: string) => {
            const keyValue = key.split(", ");
            const productID = parseInt(keyValue[0].split("=")[1]);
            const name = keyValue[1].split("=")[1].slice(1, -1);
            const price = parseFloat(keyValue[2].split("=")[1]);
            const description = keyValue[3].split("=")[1].slice(1, -1);
            const image = keyValue[4].split("=")[1].slice(1, -2);
            const quantity = parseInt(keyValue[4].split("=")[2]);
            total += quantity * price;

            const product = new Product(productID, name, price, quantity, description, image);
            products.push(product);
          })
          return {
            orderID: orderData.orderID,
            customer: orderData.user,
            products: products,
            total: total
          }
        });
        console.log(this.orders);
      },
      error => console.error(error)
    );
  }
  
  deleteOrder(order: Order) {
    this.http.delete(`http://localhost:9080/api/orders/${order.orderID}`).subscribe(response => {
      this.router.navigateByUrl('/about', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/orders'])
      })
      console.log(response);
    },
      error => console.error(error)
    )
  }
}

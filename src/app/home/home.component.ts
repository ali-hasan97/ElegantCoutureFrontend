import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// declare function create(id:number, name:string, price:number, description:string, image:string): void;

class Product{
  constructor(
    public name: string,
    public price: number
  ) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  rowData: any; // Declare rowData to store the response data
  productID!: number;
  name!: string;
  price!: number;
  description!: string;
  image!: string;
  username!: any;


  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.getRowData(1);
    const cards = document.getElementById("items");
    if (cards) {
      cards.addEventListener("click", this.handleButtonClick);
    }
    
  }

  handleButtonClick = (event: Event) => {
    const target = event.target as HTMLAnchorElement;
    if (target && target.matches('.btn-primary')) {
      const id = target.dataset['id'] ? target.dataset['id'] : "";
      const name = target.dataset['name'] ? target.dataset['name'] : "";
      const price = target.dataset['price'] ? +target.dataset['price'] : 0;
      this.store(id, name, price);
    }
  }

  create(id:number, name:string, price:number, description:string, image:string) {
    const img = image ? `https://full-stack-images.s3.us-east-2.amazonaws.com/${image}` : "../../assets/img0.jpeg";
    const desc = typeof description !== undefined ? description : "No description provided";
    const cards = document.getElementById("items");
    if (cards) {
      cards.innerHTML += 
      `<div class="item">
      <img src="${img}" alt="...">
      <div class="item-body">
        <h5 class="item-title" id="title${id}">${name}</h5>
        <p class="item-text" id="desc">${desc}</p>
        <a class="btn btn-primary" id="btn${id}" data-id="${id}" data-name="${name}" data-price="${price}">$${price}</a>
      </div>
      </div>`;
    }
  }

  store(id: string, name: string, price: number) {

      // const headers = new HttpHeaders({
      //   'Authorization': 'Basic ' + btoa(this.usernameAuth + ':' + this.password), "Content-Type":"application/json"});
  
      this.username = localStorage.getItem("userId");

      this.http.put(`http://localhost:9080/api/users/${this.username}/${id}`, {}, {}).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getRowData(id: number) {
    const url = `http://localhost:9080/api/listings`;
    this.http.get(url).subscribe(data => {
      this.rowData = data; // Store the response data in the rowData variable
      var temp = Array.from(this.rowData);
      for(var i = 0; i < temp.length; i++){
        this.productID = (temp[i] as { productID: number}).productID;
        this.name = (temp[i] as { name: string }).name;
        this.price = (temp[i] as { price: number }).price;
        this.description = (temp[i] as { description: string }).description;
        this.image = (temp[i] as { image: string }).image;
        //console.log(this.productID);
        this.create(this.productID, this.name,this.price,this.description,this.image);
      }
    });
  }  
}

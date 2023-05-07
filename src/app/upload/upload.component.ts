import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { S3ServiceService } from '../s3-service.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  fileName = '';
  file!: File;
 
  name!: string;
  price!: number;
  description!: string;
  username = this.authService.getUsername();
  password = this.authService.getPassword();


  constructor(private s3Service: S3ServiceService, private http: HttpClient, private authService: AuthenticationService) {}

  // selects file and sets fileName to its name
  public onFileSelected(e: any) {
    this.file = e.target.files[0];
    this.fileName = e.target.files[0].name;
    console.log(this.fileName);
  }

  // uploads image to S3 only after whole form has been submitted.
  public formSubmit() {
    if (this.file) {
      this.s3Service.uploadFile(this.file);
    }
  }

  public onSubmit() {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.username + ':' + this.password), "Content-Type":"application/json"});

    //console.log(this.name + this.price + this.description + this.fileName + this.username + this.password);

    this.http.post('http://localhost:9080/api/listings', {"name": `${this.name}`, "price": `${this.price}`, "description": `${this.description}`, "image": `${this.fileName}`}, {headers}).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

}

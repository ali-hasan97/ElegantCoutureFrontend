import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { environmentVars } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class S3ServiceService {
  private bucket: S3Client;

  constructor(private http: HttpClient) {
    this.bucket = new S3Client(
      {
        credentials: {
          accessKeyId: environmentVars.AWS_ACCESS_KEY_ID,
          secretAccessKey: environmentVars.AWS_SECRET_ACCESS_KEY,
        },
        region: environmentVars.AWS_REGION,
      }
    );
   }

  async uploadFile(file: File) {

  const params = {
    Bucket: 'full-stack-images',
    Key: file.name,
    Body: file,
    ACL: 'public-read',
    ContentType: file.type
  };

  try {
    const response = await this.bucket.send(new PutObjectCommand(params));
    console.log("SUCCESS", response);
  } catch(error) {
    console.log("FAILURE", error);
  }
  
}
}
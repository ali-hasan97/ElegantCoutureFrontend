import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // BASE_PATH: 'http://localhost:9080'
  USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'

  public username!: string;
  public password!: string;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private sellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router) {

  }

  // log in uses this
  authenticationService(username: string, password: string) {
    return this.http.get(`http://localhost:9080/api/basicauth`,
      { headers: { authorization: this.createBasicAuthToken(username, password) } }).pipe(map((res) => {
        this.username = username;
        this.password = password;
        this.registerSuccessfulLogin(username, password);
        this.loggedIn.next(true);

        interface GetUserResponse {
          username: string;
          password: string;
          productID: number[];
          role: { authority: string }[];
        }

        this.http.get<GetUserResponse>(`http://localhost:9080/api/users/${this.username}`).subscribe(response => {
          const authority = response.role[0].authority;
          localStorage.setItem("role", authority);
          let role = localStorage.getItem("role");
          if (role == "ROLE_seller") {
            this.sellerLoggedIn.next(true);
          } else {
            this.sellerLoggedIn.next(false);
          }
        })
      }));
  }

  // creates base 64 encoded auth token that will be sent with all future requests from this front-end
  createBasicAuthToken(username: string, password: string) {
    return 'Basic ' + window.btoa(username + ":" + password)
  }

  registerSuccessfulLogin(username:string, password:string) {
    sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username)
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.username = "";
    this.password = "";
    this.loggedIn.next(false);
    this.sellerLoggedIn.next(false);
    this.router.navigate(['/']);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user === null) return false
    return true
  }

  isSellerLoggedInAtPresent() {
    return this.sellerLoggedIn.asObservable();
  }

  // constant check for logout button
  isUserLoggedInAtPresent() {
    return this.loggedIn.asObservable();
  }

  getLoggedInUserName() {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user === null) return ''
    return user
  }

  getUsername(){
    return this.username;
  }

  getPassword(){
    return this.password;
  }
}

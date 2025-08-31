import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleLogin } from '../google-login/google-login';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Form, FormsModule } from '@angular/forms';


export interface Data {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-layout-view',
  imports: [CommonModule
            , GoogleLogin
            , FormsModule
          ] ,
  templateUrl: './layout-view.html',
  styleUrl: './layout-view.scss'
})


export class LayoutView {

  formData = {
    username: '',
    password: '',
    email:''
  };

  errorMessage = '';

    animationState = 'animated-idel';
    navAnimationState = 'nav-animated-idel';
    produitAnimationState = 'produit-animated-idel';
    isAnimating = false;
    navViewState = false;
    logViewState = false;
    produitViewState = false;

    isLoggedIn = false;
    loginError = '';

    private apiUrl = 'http://localhost:4200/page-data'; // Example API


  constructor(private http: HttpClient) {}


onSubmit(myData: any){

  this.http.post(this.apiUrl, myData, {
      reportProgress: true,
      observe: 'events',
  }).subscribe(event => {
      switch (event.type) {
          case HttpEventType.UploadProgress:
          console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
          break;
          case HttpEventType.Response:
          console.log('Finished uploading!');
          break;
      }
  });
}




  onLogin() {
    this.http.post('http://localhost:4200/auth/login', {
      email: this.formData.email,
      password: this.formData.password
    }).subscribe({
      next: (response) => {
        // Handle successful login (e.g., save token, redirect)
        console.log('Login successful', response);
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }








login() {
  // Replace with your real authentication API endpoint
  this.http.post('http://localhost:4200/auth/login', {
    email: this.formData.email,
    password: this.formData.password
  }).subscribe({
    next: (response: any) => {
      // Example: check for token or success property
      if (response.token) {
        this.isLoggedIn = true;
        this.loginError = '';
        // Optionally store token in localStorage/sessionStorage
      } else {
        this.loginError = 'Login failed';
      }
    },
    error: () => {
      this.loginError = 'Invalid credentials';
    }
  });
}







logout() {
  //localStorage.removeItem('authToken');
  this.isLoggedIn = false;
  this.formData.email = '';
  this.formData.password = '';
}





posting(myData: Data): void {

  this.http.post(this.apiUrl, myData).subscribe(response => {
      console.log('Data posted successfully:', response);
  },
      error => {
      console.error('Error posting data:', error);
  }
  );
}







submit(myData: any){

    this.http.post(this.apiUrl, myData).subscribe(
        response => {
          console.log('Data posted successfully:', response);
        },
        error => {
          console.error('Error posting data:', error);
        }
      );
    }





  postData() {
      this.http.post(this.apiUrl, this.formData)
        .subscribe(
          response => {
            console.log('Data posted successfully:', response);
          },
          error => {
            console.error('Error posting data:', error);
          }
        );
    }








    toggleAnimation() {

    //this.animationState = this.animationState === 'bounce-in' ? 'bounce-out' : 'bounce-out';

    this.isAnimating = !this.isAnimating;
  }

  animationClass() {

    if(this.navAnimationState === 'nav-animated-out'){
      this.navAnimationState = 'nav-animated-in';
    }else if(this.produitAnimationState === 'produit-animated-out'){
      this.produitAnimationState = 'produit-animated-in';
    }

    this.logViewState = !this.logViewState;

    this.animationState = this.animationState === 'animated-out' ? 'animated-in' : 'animated-out';

  }



  navAnimationClass() {

    if(this.animationState === 'animated-out'){
      this.animationState = 'animated-in';
    }else if(this.produitAnimationState === 'produit-animated-out'){
      this.produitAnimationState = 'produit-animated-in';
    }

    this.navViewState = !this.navViewState;

    this.navAnimationState = this.navAnimationState === 'nav-animated-out' ? 'nav-animated-in' : 'nav-animated-out';

  }


    produitAnimationClass() {

    if(this.animationState === 'animated-out'){
      this.animationState = 'animated-in';
    }else if(this.navAnimationState === 'nav-animated-out'){
      this.navAnimationState = 'nav-animated-in';
    }

    this.produitViewState = !this.produitViewState;

    this.produitAnimationState = this.produitAnimationState === 'produit-animated-out' ? 'produit-animated-in' : 'produit-animated-out';

  }


  openNav(){}

  closeNav(){}

}

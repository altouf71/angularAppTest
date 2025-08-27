import { Component , AfterViewInit } from '@angular/core';
import {CommonModule} from '@angular/common';

declare const google: any; // Declare 'google' to avoid TypeScript errors


@Component({
  selector: 'app-google-login',
  imports: [CommonModule],
  templateUrl: './google-login.html',
  styleUrl: './google-login.scss'
})

export class GoogleLogin  implements AfterViewInit {

  // This is the callback function that will be called when the user successfully logs in
  result: any = [];
  //declare const google: any; // Declare 'google' to avoid TypeScript errors
  //response: any;

      ngAfterViewInit(): void {
        // This is handled by the data-attributes in the HTML directly
        // The 'g_id_onload' div will automatically load the Google One Tap or button
        
        google.accounts.id.initialize({
          client_id: "92439239305-ti44n6d7u2mk0i3fh8dd73fuqc2jcr3g.apps.googleusercontent.com",
          callback: (response: any) => {
            //handle response in here
            this.result = response;
            console.log(this.result);
          }
        });
        google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { theme: "outline", size: "large" }  // customization attributes
        );
        google.accounts.id.prompt(); // also display the One Tap dialog

      }
      
      handleCredentialResponse(response: any): void {
        // Handle the credential response here (e.g., send to your backend for verification)
        console.log('Encoded JWT ID token: ' + response.credential);
      }

}

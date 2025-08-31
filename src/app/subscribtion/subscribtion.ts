import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscribtion',
  templateUrl: './subscribtion.html',
  styleUrls: ['./subscribtion.scss']
})
export class Subscribtion {
  formData = {
    email: '',
    plan: ''
  };
  subscriptionMessage = '';

  constructor(private http: HttpClient) {}

  onSubscribe() {
    this.http.post('http://localhost:4200/api/subscribe', this.formData)
      .subscribe({
        next: (response) => {
          this.subscriptionMessage = 'Subscription successful! Thank you.';
          this.formData.email = '';
          this.formData.plan = '';
        },
        error: (err) => {
          this.subscriptionMessage = 'Subscription failed. Please try again.';
        }
      });
  }
}

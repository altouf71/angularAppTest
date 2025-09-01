import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { Form, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
   imports: [CommonModule, FormsModule],
  templateUrl: './subscription.html',
  styleUrls: ['./subscription.scss']
})

export class Subscription {

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

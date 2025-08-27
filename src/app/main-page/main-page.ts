import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})

export class MainPage  implements OnInit {
  protected readonly title = signal('apptTest');
  variable!: string;
  myBolean!: boolean;
  myNumber!: number;
  myEmail!: string;
  myPassword!: string;
  myDate!: Date;


  ngOnInit() {
    // Initialization logic can go here
    this.variable = 'mon variable';
    this.myBolean = true;
    this.myNumber = 42;
    this.myEmail = '';
    this.myPassword = '';
    this.myDate = new Date();
    console.log('App component initialized with variable:', this.variable);
  }

  myswitsh() {
    this.myBolean = !this.myBolean;
    console.log('myBolean toggled to:', this.myBolean);
    this.myNumber += 1;
    console.log('myNumber incremented to:', this.myNumber);
  }

}


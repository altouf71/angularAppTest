import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dataservice, Data } from '../../services/dataservice';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-page-one',
  imports: [
    CommonModule
  ],
  templateUrl: './page-one.html',
  styleUrl: './page-one.scss'
})


export class PageOne implements OnInit {
  protected title = signal(false);
  protected isAdmin = signal(false);
  dataList: Data[] = [];
  result: Data[] = [];
  errorMessage: string = '';
  tracking!: boolean;
  count!: number;


  constructor(
        private dataService: Dataservice,
        private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.tracking = false;
    this.count = 0;
    //this.loadData();
    //this.sendPost();
  }


  loadData() {
    console.log('Loading data from service...');
    this.dataService.getDatas().subscribe({
      next: (data) => {
        this.dataList = data;
        console.log('Data loaded successfully:', this.dataList);
      },
      error: (error) => {
        this.errorMessage = 'Error loading data: ' + error.message;
        console.error(this.errorMessage);
      }
    });
  }


  sendPost(){

    this.tracking = !this.tracking;
    this.count += 1;
    console.log('Tracking toggled to:', this.tracking, 'Count:', this.count);

        // In your component or service method
    const dataToSend = { name: 'John Doe', email: 'john.doe@example.com' };
    this.dataService.postData(dataToSend).subscribe({
      next: (data) => {
        //this.result = data; // Assuming the response is an array of Data
        //this.result.push(data);
        console.log('Data sent successfully:', data);
      },
      error: (error) => {
        console.error('Error sending data:', error);
      }
    });

  }





  getData(){

    this.tracking = !this.tracking;
    this.count += 1;
    console.log('Tracking toggled to:', this.tracking, 'Count:', this.count);

        // In your component or service method
    const dataToSend = { name: 'John Doe', email: 'john.doe@example.com' };
    this.dataService.postData(dataToSend).subscribe({
      next: (response) => {
        //this.result = response; // Assuming the response is an array of Data
        //this.result.push(response);
        //this.result = response; // Assuming the response is an array of Data
        console.log('Data sent successfully:',response);
      },
      error: (error) => {
        console.error('Error sending data:', error);
      }
    });

  }



}







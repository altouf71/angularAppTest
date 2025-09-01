import { Component, signal, OnInit, NgModule} from '@angular/core';
import {RouterLink, RouterOutlet } from '@angular/router';
import { PageOne } from './page-one/page-one';
import { StorageAccess } from './storage-access/storage-access';
import { Header } from './header/header'


@Component({
  selector: 'app-root',
  imports: [Header,
    RouterOutlet
   // , StorageAccess
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})



export class App {

  protected readonly title = signal('apptTest');
}


import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutView } from './layout-view/layout-view';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule
            , FormsModule, HttpClientModule, CommonModule],
  declarations: [],
  bootstrap: [],
})
export class AppModule {}
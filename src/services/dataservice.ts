import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Data {
  id: number;
  title: string;
  completed: boolean;
}

export interface DataToSend{
  name: string;
  email:string;
}

@Injectable({
  providedIn: 'root'
})

export class Dataservice {
    private apiUrl = 'http://localhost:4200/page-data'; // Example API

    constructor(private http: HttpClient) { }

  getDatas(): Observable<Data[]> {
    return this.http.get<Data[]>(this.apiUrl);
  }

  getData(id: number): Observable<Data> {
    return this.http.get<Data>(`${this.apiUrl}/${id}`);
  }

  addData(data: Partial<Data>): Observable<Data> {
    return this.http.post<Data>(this.apiUrl, data);
  }

  postData(data: DataToSend): Observable<DataToSend> {
    return this.http.post<DataToSend>(this.apiUrl, data);
  }

  updateData(id: number, data: Partial<Data>): Observable<Data> {
    return this.http.put<Data>(`${this.apiUrl}/${id}`, data);
  }

  deleteData(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

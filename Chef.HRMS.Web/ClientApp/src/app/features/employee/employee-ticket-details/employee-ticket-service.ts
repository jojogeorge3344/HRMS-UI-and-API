import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EmployeeTicketGroup } from './employee-ticket-model';



@Injectable({
  providedIn: 'root'
})
export class EmployeeTicketService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/EmployeeTicket/`;
  }

  getAll() {
    return this.http.get<EmployeeTicketGroup[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }
  add(rel: EmployeeTicketGroup) {
    return this.http.post(this.baseUrl + 'insert', rel).pipe(map(response => { return response; }));
  }
  update(rel: EmployeeTicketGroup) {
    return this.http.post<number>(this.baseUrl + 'update', rel).pipe(map(response => { return response; }));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }
  get(id){
    return this.http.get<EmployeeTicketGroup[]>(this.baseUrl + 'Get/' + id).pipe(map(response => { return response; }));
  }
}

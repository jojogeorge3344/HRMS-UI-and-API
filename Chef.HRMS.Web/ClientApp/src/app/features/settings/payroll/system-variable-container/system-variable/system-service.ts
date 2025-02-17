import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserVariableGroup } from '@settings/payroll/user-variable/user-variable-list/user-variable.model';



@Injectable({
  providedIn: 'root'
})
export class SystemVariableService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/SystemVariable/`;
  }

  getAll() {
    return this.http.get<UserVariableGroup[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }
//   add(rel: UserVariableGroup) {
//     return this.http.post(this.baseUrl + 'insert', rel).pipe(map(response => { return response; }));
//   }
  update(rel: UserVariableGroup) {
    return this.http.post<number>(this.baseUrl + 'update', rel).pipe(map(response => { return response; }));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }
//   get(code){
//     return this.http.get<UserVariableGroup[]>(this.baseUrl + 'IsReligionCodeExist/'+ code).pipe(map(response => { return response; }));
//   }
}

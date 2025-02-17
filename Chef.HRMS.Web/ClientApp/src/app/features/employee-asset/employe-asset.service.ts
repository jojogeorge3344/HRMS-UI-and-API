import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AssetEmployeeWise } from './employee-asset.model';
import { BehaviorSubject, Observable} from 'rxjs';
import { AssetAllocated } from '@features/employee-assets/my-assets/asset-allocated.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeAssetService {
  public baseUrl: string;
  public http: HttpClient;
  private Details: BehaviorSubject<any>;
 

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.Details = <BehaviorSubject<any>>new BehaviorSubject({data: []});
    this.http = http;
    this.baseUrl = baseUrl + "api/assetEmployeeWise/";
  }

  setListDetails(data: any) {
    this.Details.next(Object.assign({}, data));
  }

  getListDetails(): Observable<any> {
    return this.Details.asObservable();
  }

 

  add(allocate: any[]){
    return this.http.post<any>(this.baseUrl + 'insert', allocate).pipe(map(response => { return response; }));
  }

  insertAllocate(changeorswap: any[]){
    return this.http.post<any>(this.baseUrl + 'InsertAllocate', changeorswap).pipe(map(response => { return response; }));
  }

  updateStatus(id,status) {
    return this.http.put(this.baseUrl + 'UpdateStatus',{},                                                
    { params: { id: id, status : status } }).pipe(map(response => { return response; }));
  }

  getAll(){
    return this.http.get<AssetEmployeeWise[]>(this.baseUrl + 'GetAll').pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<AssetEmployeeWise>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  getEmployeeRequestById(id) {
    return this.http.get<any>(this.baseUrl + 'GetEmployeeRequestById/' + id).pipe(map(response => { return response; }));
  }

  getAllocatedAssetsById(id) {
    return this.http.get(this.baseUrl + 'GetAllocatedAssetById/' + id).pipe(map(response => { return response; }));
  }

  GetAllCount() {
    return this.http.get<any>(this.baseUrl + 'GetAllCount').pipe(map(response => { return response; }));
  }

  getEmployeeNameById(id:number){
    return this.http.get<any>(this.baseUrl + 'GetEmployeeNameById/' +id).pipe(map(response => { return response; }));
  }

  getUnallocatedAssets(id:number){
    console.log(">>>>>>> ",typeof(id), id)
    return this.http.get<any[]>(this.baseUrl + 'GetAssetDetailsById/' + id);
  }

  GetAssetAndMetadataDetails(id:number){
    console.log(">>>>>>> ",typeof(id), id)
    return this.http.get<any[]>(this.baseUrl + 'GetMetadataDetailsById/' + id);
  }


  manageRequest(id,status) {
    return this.http.put(this.baseUrl + 'UpdateApproveReject',{},                                                
    { params: { id: id, status : status } }).pipe(map(response => { return response; }));
  }


  updateAllocateStatus(id,assetRaiseRequestId,status) {
    return this.http.put(this.baseUrl + 'UpdateAllocateStatus',{},                                                
    { params: { id: id,assetRaiseRequestId:assetRaiseRequestId, status : status } }).pipe(map(response => { return response; }));
  }
  getEmployeeDetailsById(id) {
    return this.http.get(this.baseUrl + 'GetEmployeeDetailsById/' + id).pipe(map(response => { return response; }));
  }

  recall(empid,assetId,status) {
    return this.http.put(this.baseUrl + 'UpdateStatusRecalled',{},                                                
    { params: { empid: empid, assetId: assetId , status: status } }).pipe(map(response => { return response; }));
  }

  getRequestById(id:number) {
    return this.http.get<any[]>(this.baseUrl + 'GetRequestById/' + id).pipe(map(response => { return response; }));
  }

  getAllocationDetails(reqId:number) {
    return this.http.get<any>(this.baseUrl + 'GetAllocationDetailsById/' + reqId).pipe(map(response => { return response; }));
  }

  getAssetId(id:number){
    return this.http.get(this.baseUrl + 'GetAssetId/' + id).pipe(map(response => { return response; }));
  }

  getReasonAndDescription(assetRaiseRequestId,status,assetid){
    return this.http.get(this.baseUrl + 'GetReasonAndDescription/' + assetRaiseRequestId +'/' + status +'/'+ assetid).pipe(map(response => { return response; }));
  }

  updateReturnStatus(AssetId,status,assetraiserequestid) {
    return this.http.put(this.baseUrl + 'UpdateReturnStatus',{},                                                
    { params: { AssetId: AssetId, status : status, assetraiserequestid: assetraiserequestid } }).pipe(map(response => { return response; }));
  }
}

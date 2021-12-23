import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AssetType } from '../../asset/asset-type/asset-type.model';
import { AssetTypeMetadata } from './asset-metadata.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssetMetadataService {

  public baseUrl: string;
  public http: HttpClient;


  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl + "api/assetTypeMetadata/";
  }

  

  add(metadata: AssetTypeMetadata) {
    return this.http.post<AssetTypeMetadata[]>(this.baseUrl + 'insert', metadata).pipe(map(response => { return response; }));
  }
  getAllMetadata() {
    return this.http.get<AssetTypeMetadata[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }
  update(metadata: AssetTypeMetadata) {
    return this.http.post<AssetTypeMetadata[]>(this.baseUrl + 'update', metadata).pipe(map(response => { return response; }));
  }

  delete(id:number){
    return this.http.delete<AssetTypeMetadata>(this.baseUrl + 'delete/'+id).pipe(map(response => { return response; }));
  }


  // getAssetTypeId(assetName){
  //   return this. http.get(this.baseUrl + 'getAssetTypeId/',assetName).pipe(map(response => { return response; }));
  // }


  // getAll(){
  //   return this.http.get<AssetType[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  // }

  // get(id) {
  //   return this.http.get<AssetType>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  // }
}

import { Model } from '@shared/models/model';

export interface AssetEmployeewiseRequest extends Model {  
    employeeID: number;
    assetRaiseRequestId :number;
    requestNo :string;
    requestFor : number;
    requestType :string;
    status :string;
    requestedOn:Date;
    requestedBy :string;
  }
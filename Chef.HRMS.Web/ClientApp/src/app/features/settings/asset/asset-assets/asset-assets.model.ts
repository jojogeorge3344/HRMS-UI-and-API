import { Model } from '@shared/models/model';
import { AssetMetadataValue } from './assetmetadatavalue.model';

export interface AssetAssets extends Model {  
  assetTypeId:number;
  assetTypeMetadataId:number;
  assetName:string;
  date:Date;
  description:string;
  status: string;
  isActive:boolean;
  valueId: Number;
  // assetId:number;
  // metaData:string; 
  assetMetadataValues: AssetMetadataValue[];
  }
  

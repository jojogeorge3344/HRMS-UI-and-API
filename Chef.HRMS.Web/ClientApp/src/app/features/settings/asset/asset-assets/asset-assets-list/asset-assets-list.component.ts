import { Component, NgModuleRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  AssetTypeMetadata } from '@settings/asset/asset-metadata/asset-metadata.model';
import { AssetType } from '@settings/asset/asset-type/asset-type.model';
import { AssetTypeService } from '@settings/asset/asset-type/asset-type.service';
import { ConfirmModalComponent } from '@shared/dialogs/confirm-modal/confirm-modal.component';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { AssetStatus } from 'src/app/models/common/types/assetstatus';
import { AssetAssetsCreateComponent } from '../asset-assets-create/asset-assets-create.component';
import { AssetAssetsEditComponent } from '../asset-assets-edit/asset-assets-edit.component';
import { AssetAssetsViewComponent } from '../asset-assets-view/asset-assets-view.component';
import { AssetAssets } from '../asset-assets.model';
import { AssetAssetsService } from '../asset-assets.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'hrms-asset-assets-list',
  templateUrl: './asset-assets-list.component.html'
})
export class AssetAssetsListComponent implements OnInit {
  assetStatus=AssetStatus;
  assetId:AssetAssets;
  TypeId:AssetTypeMetadata;
  assetList: AssetAssets[];
  assetTypeNames: string[];
  assetTypes: AssetType[];
  assetMetaDataNames : string[];
  assetMetadata:AssetTypeMetadata[];
  searchKey: any;
  searchAssets: any;


  constructor(
    private assetassetService: AssetAssetsService,
    private assetTypeService : AssetTypeService,
    public modalService: NgbModal,
    private toastr: ToasterDisplayService
     ) { }

  ngOnInit(): void {
   this.getAllAssetList();
   this.getAllAssetTypeList();
  }
  openCreate(){
    const modalRef = this.modalService.open(AssetAssetsCreateComponent,
      { centered: true, backdrop: 'static' });

    modalRef.componentInstance.assetTypeNames = this.assetTypeNames;

    modalRef.result.then((result) => {
      if (result == 'submit') {
        this.getAllAssetList();
      }
    });
  }

  //
  openView(assetType,assetTypename) {
   // console.log(assetType);
   // console.log(assetTypename);
    
    const modalRef = this.modalService.open(AssetAssetsViewComponent,
      { centered: true, backdrop: 'static' });
    modalRef.componentInstance.assetType = assetType;
    modalRef.componentInstance.assetId = assetType.id;
    modalRef.componentInstance.assetTypeId = assetType.assetTypeId;
    //console.log(modalRef.componentInstance.assetTypename);
    
    modalRef.componentInstance.assetTypename = this.getAssetTypeName(assetType);
   // console.log(this.getAssetTypeName(assetType));
    
    modalRef.result.then((result) => {
      if (result == 'submit') {
       this.getAllAssetList();
      }
    });
  }
  


  openEdit(assetasset,assetTypename ) {
    // console.log(assetType);
    const modalRef = this.modalService.open(AssetAssetsEditComponent,
      { centered: true, backdrop: 'static' });
    modalRef.componentInstance.assetId = assetasset.id;
   // console.log(modalRef.componentInstance.assetId);
    
    modalRef.componentInstance.assetTypeName = assetTypename;
    // modalRef.componentInstance.TypeId = assetType;
     modalRef.componentInstance.assetTypeId = assetasset;
    //  console.log( modalRef.componentInstance.typeId);
    //  console.log(modalRef.componentInstance.TypeId);
    
    modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getAllAssetList();
        }
    });
  }

  getAllAssetTypeList() {
    this.assetTypeService.getAllAssetTypeList().subscribe(result => {
      this.assetTypes = result;
      this.assetTypeNames = this.assetTypes.map(a => a.assettypename.toLowerCase());
      console.log(this.assetTypes);
    },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to Fetch the Asset Type Details');
    });

  }
  //filtering assetType corresponds to assetname
  getAssetTypeName(asset){
    return this.assetTypes?.find(val=>val.id == asset.assetTypeId)?this.assetTypes?.find(val=>val.id == asset.assetTypeId).assettypename:'-'
  }



 
  getAllAssetList() {
    this.assetassetService.getAllAssetList().subscribe(result => {
      console.log("res",result);
      this.assetList = result; 
      this.searchAssets=result
      console.log(this.assetList);
      
      //this.assetTypeNames = this.assetTypes.map(a => a.assettypename.toLocaleLowerCase());
    },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to Fetch the Asset Details');
    });
  }


  //delete

  delete(assetType: AssetType) {
    console.log(assetType);
    
    const modalRef = this.modalService.open(ConfirmModalComponent,
      { centered: true, backdrop: 'static' });

    modalRef.componentInstance.confirmationMessage = `Are you sure you want to delete the Asset ${assetType['assetName']}?`;
    modalRef.result.then((userResponse) => {
      if (userResponse == true) {
        this.assetassetService.delete(assetType.id).subscribe(() => {
          this.toastr.showSuccessMessage('Asset Deleted Successfully!');
          this.getAllAssetList();
        });
      }
    });
  }
  searchAsset(): void {
    debugger
    this.assetList = this.searchAssets.filter(
      (x) =>
        x.assetName?.toLowerCase().includes(this.searchKey.toLowerCase()) ||
        x.description?.toLowerCase().includes(this.searchKey.toLowerCase()) ||
        (formatDate(x.date, 'dd-MM-yyyy', 'en-Us')).includes(this.searchKey) ||
        this.getAssetTypeName(x)?.toLowerCase().includes(this.searchKey.toLowerCase()) ||
        this.assetStatus[x.status]?.toLowerCase().includes(this.searchKey.toLowerCase()) ||
        (x.isActive==true?"Yes" : "No")?.toLowerCase().includes(this.searchKey.toLowerCase()) 
    );
  }
}

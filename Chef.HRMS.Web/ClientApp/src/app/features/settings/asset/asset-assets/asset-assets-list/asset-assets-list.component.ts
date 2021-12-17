import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetTypeMetadata } from '@settings/asset/asset-metadata/asset-metadata.model';
import { AssetType } from '@settings/asset/asset-type/asset-type.model';
import { AssetTypeService } from '@settings/asset/asset-type/asset-type.service';
import { ConfirmModalComponent } from '@shared/dialogs/confirm-modal/confirm-modal.component';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { AssetAssetsCreateComponent } from '../asset-assets-create/asset-assets-create.component';
import { AssetAssetsEditComponent } from '../asset-assets-edit/asset-assets-edit.component';
import { AssetAssetsViewComponent } from '../asset-assets-view/asset-assets-view.component';
import { AssetAssets } from '../asset-assets.model';
import { AssetAssetsService } from '../asset-assets.service';

@Component({
  selector: 'hrms-asset-assets-list',
  templateUrl: './asset-assets-list.component.html'
})
export class AssetAssetsListComponent implements OnInit {

  assetList: AssetAssets[];
  assetTypeNames: string[];
  assetTypes: AssetType[];
  assetMetaDataNames : string[];
  assetMetadata:AssetTypeMetadata[];


  constructor(
    private assetassetService: AssetAssetsService,
    private assetTypeService : AssetTypeService,
    public modalService: NgbModal,
    private toastr: ToasterDisplayService
     ) {
    
   }

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


  openViewList(assetType: AssetType) {
    const modalRef = this.modalService.open(AssetAssetsListComponent,
      { size: 'lg', centered: true, backdrop: 'static' });

    modalRef.componentInstance.assetType = assetType;

    modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getAllAssetList();
        }
    });
  }

  openEdit(assetType: AssetType) {
    const modalRef = this.modalService.open(AssetAssetsEditComponent,
      { size:'lg', centered: true, backdrop: 'static' });

    modalRef.componentInstance.assetTypeId = assetType.id;
    modalRef.componentInstance.assetTypeNames = this.assetTypeNames.filter(v => v !== assetType.assettypename.toLowerCase());

    modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getAllAssetList();
        }
    });
  }

  openView(assetType: AssetType) {
    const modalRef = this.modalService.open(AssetAssetsViewComponent,
      { size: 'lg', centered: true, backdrop: 'static' });

    modalRef.componentInstance.assetType = assetType;

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
      this.toastr.showErrorMessage('Unable to fetch the asset type Details');
    });

  }

  getAssetTypeName(asset){
    return this.assetTypes.find(val=>val.id == asset.assetTypeId)?this.assetTypes.find(val=>val.id == asset.assetTypeId).assettypename:'-'
  }

  // displayMetadata(type){
  //   var metData=this.assetMetadata.filter(item => item.assettypeId === type.id);
  //     var data=metData.map(val=>val.metadata)
  //     return data ? data.join(",") : "-";
  //   }
  // getMetadataName(asset){
  //   return this.assetMetadata.find(val =>val.id == asset.assetMetadata)?this.assetMetaDataNames.find(val =>val.id == asset.assetTypeMetaDataId).assetmetadataname:'-'
  // }
 
  getAllAssetList() {
    this.assetassetService.getAllAssetList().subscribe(result => {
      console.log("res",result);
      this.assetList = result; 
      //this.assetTypeNames = this.assetTypes.map(a => a.assettypename.toLocaleLowerCase());
    },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to fetch the Asset Details');
    });
  }


  //delete

  delete(assetTypes: AssetType) {
    const modalRef = this.modalService.open(ConfirmModalComponent,
      { centered: true, backdrop: 'static' });

    modalRef.componentInstance.confirmationMessage = `Are you sure you want to delete the asset ${assetTypes.assettypename}?`;
    modalRef.result.then((userResponse) => {
      if (userResponse == true) {
        this.assetassetService.delete(assetTypes.id).subscribe(() => {
          this.toastr.showSuccessMessage('asset deleted successfully!');
          this.getAllAssetList();
        });
      }
    });
  }
}
// delete(assetType: AssetType) {
//   const modalRef = this.modalService.open(ConfirmModalComponent,
//     { centered: true, backdrop: 'static' });

//   modalRef.componentInstance.confirmationMessage = `Are you sure you want to delete the asset type ${assetType.assettypename}?`;
//   modalRef.result.then((userResponse) => {
//       if (userResponse == true) {
//         this.assetTypeService.delete(assetType.id).subscribe(() => {
//           this.toastr.showSuccessMessage('The asset type deleted successfully!');
//           this.getAssetTypeList();
//         });
//       }
//   });
// }


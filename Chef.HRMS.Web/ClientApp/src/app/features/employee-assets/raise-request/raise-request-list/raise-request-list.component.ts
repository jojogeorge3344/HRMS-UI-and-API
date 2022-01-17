import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { AssetType } from '../../../settings/asset/asset-type/asset-type.model';
import { AssetTypeService } from '../../../settings/asset/asset-type/asset-type.service';
import { RaiseRequestService } from '../../raise-request/raise-request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/dialogs/confirm-modal/confirm-modal.component';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { AssetRaiseRequest } from '../../raise-request/raise-request.model';
import { RaiseRequestCreateComponent } from '../raise-request-create/raise-request-create.component';
import { RaiseRequestEditComponent } from '../raise-request-edit/raise-request-edit.component';
import { RaiseRequestViewComponent } from '../raise-request-view/raise-request-view.component';
import { getCurrentUserId } from '@shared/utils/utils.functions';
import { RequestFor } from 'src/app/models/common/types/requestfor';
import { AssetStatus } from 'src/app/models/common/types/assetstatus';



@Component({
  selector: 'hrms-raise-request-list',
  templateUrl: './raise-request-list.component.html'
})
export class RaiseRequestListComponent implements OnInit {

  raiseRequestList: any;
  assetType: AssetType[];
  assetTypeNames: AssetType[];
  currentUserId:number;
  raiseRequesttype = RequestFor;
  raiseRequestStatus =AssetStatus;
 
  

  constructor(
    private raiseRequestService: RaiseRequestService,
    private assetTypeService: AssetTypeService,
    public modalService: NgbModal,
    private toastr: ToasterDisplayService,
  ) { }

  ngOnInit(): void {
    this.currentUserId = getCurrentUserId();
    // this.getAllRaiseRequestList(this.currentUserId);
    this.getAssetTypeList();  
  }

  getAllRaiseRequestList(currentUserId) {
    this.raiseRequestService.getAllRaiseRequestList(currentUserId).subscribe(result => {
      this.raiseRequestList = result;
      console.log(result);
      
      this.raiseRequestList.map(item =>{
      item.assetTypeName =  _.find(this.assetType, ['id', item.assetTypeId]).assettypename;
      })
     },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the asset type Details');
      });
  }

  getAssetTypeList() {
    this.assetTypeService.getAllAssetTypeList().subscribe(result => {
      this.assetType = result;
       this. getAllRaiseRequestList(this.currentUserId);
    }),
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the asset type Details');
      };
  }

  openCreate() {
      const modalRef = this.modalService.open(RaiseRequestCreateComponent,
        { size: 'lg', centered: true, backdrop: 'static' });
      // modalRef.componentInstance.assetTypeNames = this.assetTypeNames;
      modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getAllRaiseRequestList(this.currentUserId);
        }
      });
    }

  openEdit(raiseRequest: AssetRaiseRequest) {
      const modalRef = this.modalService.open(RaiseRequestEditComponent,
        { centered: true, backdrop: 'static' });

      modalRef.componentInstance.raiseRequestId = raiseRequest;
      // modalRef.componentInstance.assetTypeNames = this.assetTypeNames.filter(v => v !== assetType.assettypename.toLowerCase());
      modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getAllRaiseRequestList(this.currentUserId);
        }
      });
    }

  openViewList(raiseRequest: AssetRaiseRequest) {
      const modalRef = this.modalService.open(RaiseRequestViewComponent,
        { size: 'lg', centered: true, backdrop: 'static' });
      modalRef.componentInstance.assetType = raiseRequest;
      modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getAllRaiseRequestList(this.currentUserId);
        }
    });
  }

  isDisabled(i) {
    return this.raiseRequestList[i].status==1
  }


  delete (raiseRequest: AssetRaiseRequest) {
      const modalRef = this.modalService.open(ConfirmModalComponent,
        { centered: true, backdrop: 'static' });
      modalRef.componentInstance.confirmationMessage = `Are you sure you want to delete the raise request for ${raiseRequest.assetTypeId}?`;
      modalRef.result.then((userResponse) => {
        if (userResponse == true) {
          this.raiseRequestService.delete(raiseRequest.id).subscribe(() => {
            this.toastr.showSuccessMessage('The raise request deleted successfully!');
            this.getAllRaiseRequestList(this.currentUserId);
          });
        }
      });
    }
}

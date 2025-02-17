import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ConfirmModalComponent } from '@shared/dialogs/confirm-modal/confirm-modal.component';
import { EosSlabGroup } from '../eos-slab.model';
import { EosSlabService } from '../eos-slab.service';
import { EosSlabCreateComponent } from '../eos-slab-create/eos-slab-create.component';
import { EosSlabEditComponent } from '../eos-slab-edit/eos-slab-edit.component';
import { EosSlabViewComponent } from '../eos-slab-view/eos-slab-view.component';

@Component({
  selector: 'hrms-eos-slab-list',
  templateUrl: './eos-slab-list.component.html',
  styleUrls: ['./eos-slab-list.component.scss']
})
export class EosSlabListComponent implements OnInit {

  
  eosSlabDetails: EosSlabGroup[] = [];

  constructor(
    public modalService: NgbModal,
    private eosSlabService:EosSlabService,
    private toastr: ToasterDisplayService,
  ) { }

  ngOnInit(): void {
    this.getEosSlablist()
  }

  getEosSlablist() {
    this.eosSlabService.getAll().subscribe(result => {
      this.eosSlabDetails = result;
      this.eosSlabDetails=this.eosSlabDetails.sort((a, b) => a.bfName.toLowerCase().localeCompare(b.bfName.toLowerCase()));
    },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to fetch the EosSlab List Details');
    });
  }
  openCreate() {
    const modalRef = this.modalService.open(EosSlabCreateComponent,
      {size: 'lg', centered: true, backdrop: 'static' });
    // modalRef.componentInstance.code = this.Codes;
    // modalRef.componentInstance.name= this.Names;
    modalRef.componentInstance.eosSlabDetails= this.eosSlabDetails;
    modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getEosSlablist()
        }
    });  
  }
  openEdit(relDetails: EosSlabGroup) {
    const modalRef = this.modalService.open(EosSlabEditComponent,
      { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.relDetails= relDetails;
    modalRef.componentInstance.eosSlabDetails= this.eosSlabDetails;
    // modalRef.componentInstance.code = this.Codes;
    // modalRef.componentInstance.name = this.Names;

    modalRef.result.then((result) => {
      if (result == 'submit') {
        this.getEosSlablist()
      }
    });
  }
  openView(relDetails: EosSlabGroup) {
    const modalRef = this.modalService.open(EosSlabViewComponent,
      { size: 'lg',centered: true, backdrop: 'static' });

    modalRef.componentInstance.relDetails = relDetails;
    // modalRef.componentInstance.code = this.Codes;
    // modalRef.componentInstance.name = this.Names;

    modalRef.result.then((result) => {
      if (result == 'submit') {
        this.getEosSlablist();
      }
    });
  }

delete(relDetails: EosSlabGroup) {
  const modalRef = this.modalService.open(ConfirmModalComponent,
    { centered: true, backdrop: 'static' });
  modalRef.componentInstance.confirmationMessage = `Are you sure you want to delete the Eos ${relDetails.bfName}`;
  modalRef.result.then((userResponse) => {
    if (userResponse == true) {
      this.eosSlabService.delete(relDetails.id).subscribe(() => {
        this.toastr.showSuccessMessage('Eos deleted successfully!');
        this.getEosSlablist()
      });
    }
  });
}


}










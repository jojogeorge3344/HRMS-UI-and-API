import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { ConfirmModalComponent } from '@shared/dialogs/confirm-modal/confirm-modal.component';
import { PayrollCalculationEditComponent } from '../payroll-calculation-edit/payroll-calculation-edit.component';
import { PayrollCalculationService } from '../payroll-calculation.service';
import { PayrollStructureService } from '../../payroll-structure/payroll-structure.service';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { PayHeadBaseUnitType } from 'src/app/models/common/types/paybaseunittype';

@Component({
  templateUrl: './payroll-calculation-list.component.html'
})
export class PayrollCalculationListComponent implements OnInit {

  payrollCalculation: any;
  payrollCalculationKeys: string[];
  firstOpen: number;
  assignedPayrollStructures: number[] = [ ];
  payHeadBaseUnitType = PayHeadBaseUnitType;
  searchKey: any;
  searchPayrollCalculations: any;

  constructor(
    private toastr: ToasterDisplayService,
    private modalService: NgbModal,
    private payrollcalculationService: PayrollCalculationService,
    private payrollStructureService: PayrollStructureService
  ) { }

  ngOnInit(): void {
    this.getPayrollCalculationDetails();
    this.getAssignedPayrollStructures();
  }

  getAssignedPayrollStructures() {
    this.payrollStructureService.getAssignedPayrollStructures().subscribe(res => {
      this.assignedPayrollStructures = res;
    },
    error => {
      console.error(error);
    });
  }

  isDisabled(component, payrollStructureId) {
    return !component.isFixed || this.assignedPayrollStructures.includes(payrollStructureId) || component.payHeadContractValueType!=2;
  }

  getPayrollCalculationDetails() {
    this.payrollcalculationService.getAll().subscribe(result => {
      if (result.length) {
        this.firstOpen = result[0].payrollStructureId;
      }
      this.payrollCalculation = _.chain(result)
    .groupBy('payrollStructureName')
    .map((value: any, key) => ({ structure: key, structureId: value[0].payrollStructureId, components: value }))
    .value();
    this.searchPayrollCalculations=_.chain(result)
      .groupBy('payrollStructureName')
      .map((value: any, key) => ({ structure: key, structureId: value[0].payrollStructureId, components: value }))
      .value();
    },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to fetch the Payroll Calculation Components Details');
    });
  }

  openAddCalculationOvertime(seletedPayroll, selectedComponentId, selectedComponentName, selectedComponentCode,structureId) {
    const selectedPayrollComponents = seletedPayroll.filter((item) => item.payrollComponentId !== selectedComponentId);
    const selectedPayrollComponent = seletedPayroll.filter((item) => item.payrollComponentId == selectedComponentId);

    const modalRef = this.modalService.open(PayrollCalculationEditComponent,
      { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.selectedPayrollComponents = selectedPayrollComponents;
    modalRef.componentInstance.selectedPayrollComponent = selectedPayrollComponent;
    modalRef.componentInstance.selectedComponentName = selectedComponentName;
    modalRef.componentInstance.selectedComponentCode = selectedComponentCode;
    modalRef.componentInstance.structureId = structureId;
    modalRef.result.then((result) => {
      if (result == 'submit') {
        this.getPayrollCalculationDetails();
      }
    });
  }
  searchPayrollCalculation(): void {
    this.payrollCalculation = this.searchPayrollCalculations.filter(
      (x) =>
        x.structure?.toLowerCase().includes(this.searchKey.toLowerCase()) 
    );
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { EmployeeDependentDetailsService } from '../employee-dependent-details.service';
import { GenderType } from '../../../../models/common/types/gendertype';
import { RelationshipType } from '../../../../models/common/types/relationshiptype';
import { getCurrentUserId } from '@shared/utils/utils.functions';
import { EmployeeDependentDetails } from '../employee-dependent-details.model';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateformaterService } from "@shared/services/dateformater.service";

@Component({
  templateUrl: './employee-dependent-details-edit.component.html',
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    {provide: NgbDateParserFormatter, useClass: DateformaterService}],
})
export class EmployeeDependentDetailsEditComponent implements OnInit {

  @Input() currentUserId: number;
  @Input() id: number;
  @Input() dependent: EmployeeDependentDetails;
  editForm: FormGroup;
  maxDate;


  genderTypes = GenderType;
  relationshipTypes = RelationshipType;

  genderTypeKeys: number[];
  relationshipTypeKeys: number[];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToasterDisplayService,
    private dependentService: EmployeeDependentDetailsService,
    public activeModal: NgbActiveModal) {
    this.genderTypeKeys = Object.keys(this.genderTypes).filter(Number).map(Number);
    this.relationshipTypeKeys = Object.keys(this.relationshipTypes).filter(Number).map(Number);
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {
    debugger
    this.currentUserId = getCurrentUserId();
    const tempObj: any = this.dependent;
    if (tempObj.phone) {
      const phone = tempObj.phone;
      const code = phone.split('-')[0].substr(1);
      tempObj.phone = tempObj.phone.split('-')[1];
      tempObj.phoneCode = code;
    }
    tempObj.dateOfBirth = new Date(tempObj.dateOfBirth);
    this.editForm = this.createFormGroup();
    this.editForm.patchValue(tempObj);
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      dateOfBirth: [null, [
        Validators.required,
      ]],
      name: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
      phone: ['', [Validators.required,
              Validators.pattern("[0-9 ]{10}")
      ]],
      phoneCode: ['', [Validators.required,
        Validators.pattern("[0-9 ]{2}")]],
      gender: [null, [
        Validators.required,
      ]],
      relationship: [null, [
        Validators.required,
      ]],
      profession: ['', [Validators.maxLength(32),

      ]],
      createdDate: []
    });
  }
  onSubmit() {
    const updateDependentForm = this.editForm.value;

    if (updateDependentForm.phoneCode && updateDependentForm.phone) {
      updateDependentForm.phone = `+${updateDependentForm.phoneCode}-${updateDependentForm.phone}`;
    } else {
      updateDependentForm.phone = '';
    }

    updateDependentForm.employeeId = this.currentUserId;
    updateDependentForm.id = this.id;
    this.dependentService.update(updateDependentForm).subscribe((result: any) => {
      if (result === -1) {
        this.toastr.showErrorMessage('Dependent already exists!');
      } else {
        this.activeModal.close('submit');
        this.toastr.showSuccessMessage('Dependent is updated successfully!');
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to update the Dependent');
      });

  }

}

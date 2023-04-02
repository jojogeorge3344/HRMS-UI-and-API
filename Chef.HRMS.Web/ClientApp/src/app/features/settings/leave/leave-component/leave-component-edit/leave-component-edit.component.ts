import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LeaveComponentService } from '../leave-component.service';
import { LeaveComponent } from '../leave-component.model';
import { GenderType } from '../../../../../models/common/types/gendertype';
import { MaritalStatusType } from '../../../../../models/common/types/maritalstatustype';
import { duplicateNameValidator } from '@shared/utils/validators.functions';
import { getCurrentUserId } from '@shared/utils/utils.functions';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { BaseType } from '@settings/leave/basetype.enum';
import { EligiblityBase } from '@settings/leave/Eligibilitybase.enum';
import { LeaveCutoffType } from '@settings/leave/leavecuttoff.enum';
import { LeaveType } from '@settings/leave/leavetype.enum';
import { Loptype } from '@settings/leave/lopdays.enum';
import { LeaveEligiblityService } from '../leave-eligiblity.service';

@Component({
  selector: 'hrms-leave-component-edit',
  templateUrl: './leave-component-edit.component.html'
})
export class LeaveComponentEditComponent implements OnInit {

  editForm: FormGroup;
  editForm2:FormGroup;
  currentUserId: number;
  genderTypes = GenderType;
  maritalStatusTypes = MaritalStatusType;
  basetype =BaseType;
  eligiblitybase=EligiblityBase;
  leavecutofftype =LeaveCutoffType;
  leavetypes=LeaveType;
  lopdays =Loptype;
  leavetypearray:number[];
  lopday:number[];
  leavecutoff:number[];
  basetypes:number[];
  eligiblitybases:number[];
  dedecutionarray:[];
  leaves:[];
  @Input() leaveComponent: LeaveComponent;
  @Input() isDisabled: boolean;
  @Input() leaveComponentNames: string[];
  @Input() leaveComponentCodes: string[];


  genderTypeKeys: number[];
  maritalStatusTypeKeys: number[];

  constructor(
    private leaveComponentService: LeaveComponentService,
    private leaveeligiblityservice:LeaveEligiblityService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastr: ToasterDisplayService) {
  }

  ngOnInit(): void {
    this.genderTypeKeys = Object.keys(this.genderTypes).filter(Number).map(Number);
    this.maritalStatusTypeKeys = Object.keys(this.maritalStatusTypes).filter(Number).map(Number);
    this.eligiblitybases = Object.keys(this.eligiblitybase).filter(Number).map(Number);
    this.leavecutoff = Object.keys(this.leavecutofftype).filter(Number).map(Number);
    this.leavetypearray = Object.keys(this.leavetypes).filter(Number).map(Number);
    this.lopday = Object.keys(this.lopdays).filter(Number).map(Number);
    this.basetypes = Object.keys(this.basetype).filter(Number).map(Number);
    this.currentUserId = getCurrentUserId();
    this.editForm = this.createFormGroup();
    this.editForm2 = this.createFormGroup2();
    this.toggleGender(this.leaveComponent.isRestrictedToGender);
    this.toggleMaritalStatus(this.leaveComponent.isRestrictedToMaritalStatus);
    this.getdeductiontype();
    this.getconfiguredata();
    this.editForm.patchValue(this.leaveComponent);
    
    console.log("this.leaveComponent",this.leaveComponent)
    // console.log("this.leaveComponent",this.leaveComponent)
    console.log("this.editForm2.value",this.editForm.value)
    this.getLeavetype();
  }
  getdeductiontype(){
    this.leaveComponentService.getbenefitcategory().subscribe((result: any) => {
      this.dedecutionarray =result;
  console.log("result",result)
  
  })
  
  }
  getconfiguredata(){
    
    this.leaveeligiblityservice.get(this.leaveComponent.id).subscribe(res => {

      
      let result =res[0]
      this.editForm2.patchValue(result);
     
    })
  }
  toggleGender(checked) {
    if (checked) {
      this.editForm.addControl('restrictedToGender', new FormControl({value: null, disabled: this.isDisabled}, Validators.required));
    } else {
      this.editForm.removeControl('restrictedToGender');
    }
  }

  toggleMaritalStatus(checked) {
    if (checked) {
      this.editForm.addControl('restrictedToMaritalStatus', new FormControl({value: null, disabled: this.isDisabled}, Validators.required));
    } else {
      this.editForm.removeControl('restrictedToMaritalStatus');
    }
  }

  get name() { return this.editForm.get('name'); }

  get code() { return this.editForm.get('code'); }

  onSubmit() {
    this.leaveComponentService.update(this.editForm.getRawValue()).subscribe((result: any) => {
      if (result === -1) {
        this.toastr.showErrorMessage('Leave component already exists!');
      } else {
        // this.activeModal.close('submit');
        this.toastr.showSuccessMessage('Leave component is updated successfully!');
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to update the leave component');
      });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern('^([a-zA-Z0-9 ])+$'),
        duplicateNameValidator(this.leaveComponentNames)
      ]],
      code: [null, [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('^([a-zA-Z0-9])+$'),
        duplicateNameValidator(this.leaveComponentCodes)
      ]],
      description: [null, [
        Validators.required,
        Validators.maxLength(256)
      ]],
      showLeaveDescription: [{value: false, disabled: this.isDisabled}],
      isPaidLeave: [{value: false, disabled: this.isDisabled}],
      isSickLeave: [{value: false, disabled: this.isDisabled}],
      isStatutoryLeave: [{value: false, disabled: this.isDisabled}],
      isRestrictedToGender: [{value: false, disabled: this.isDisabled}],
      isRestrictedToMaritalStatus: [{value: false, disabled: this.isDisabled}],
      createdDate: [],
      benefitCategoryId:[null,Validators.required],
      benefitTypeId:[null,Validators.required],
    });
  }
  createFormGroup2(): FormGroup {
    return this.formBuilder.group({
      eligibleDays:[null],
      eligibilityBase:[null],
      maxLeaveAtATime:[null],
      vacationSalaryFormula:[null],
      encashBFCode:[null],
      encashLimitDays:[null],
      cfLimitDays:[null],
      baseType:[null],
      includeLOPDays:[null],
      leaveType:[null],
      leaveCutOffType:[null],
      accrueLeaveAmt:[false],
      encash:[false],
      carryForward:[false],
      leaveComponentId:[null]
    })
  }
  getLeavetype(){
    
  
    let categoryid=this.editForm.value.benefitCategoryId
    this.leaveComponentService.getbenefittype(categoryid).subscribe((result: any) => {
      this.leaves =result;

  
  })
  }
  onSubmit2(){
    this.editForm2.patchValue({
      leaveComponentId:this.leaveComponent.id
    })
    this.leaveeligiblityservice.update(this.editForm2.getRawValue()).subscribe((result: any) => {
      
        // this.activeModal.close('submit');
        this.toastr.showSuccessMessage('Leave component is updated successfully!');
      
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to update the leave component');
      });
  }
}


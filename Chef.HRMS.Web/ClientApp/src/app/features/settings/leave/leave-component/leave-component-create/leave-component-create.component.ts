import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { LeaveComponentService } from '../leave-component.service';
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



@Component({
  selector: 'hrms-leave-component-create',
  templateUrl: './leave-component-create.component.html'
})
export class LeaveComponentCreateComponent implements OnInit {


  addForm: FormGroup;
  addForm2:FormGroup;
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
  leavetype:[];
  genderTypeKeys: number[];
  maritalStatusTypeKeys: number[];

  @Input() leaveComponentNames: string[];
  @Input() leaveComponentCodes: string[];
  @ViewChild('myTabSet') tabSet: NgbTabset;

  constructor(
    private leaveComponentService: LeaveComponentService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastr: ToasterDisplayService) {
  }

  ngOnInit(): void {
    debugger
    this.genderTypeKeys = Object.keys(this.genderTypes).filter(Number).map(Number);
    this.basetypes = Object.keys(this.basetype).filter(Number).map(Number);
    this.maritalStatusTypeKeys = Object.keys(this.maritalStatusTypes).filter(Number).map(Number);
    this.eligiblitybases = Object.keys(this.eligiblitybase).filter(Number).map(Number);
    this.leavecutoff = Object.keys(this.leavecutofftype).filter(Number).map(Number);
    this.leavetypearray = Object.keys(this.leavetypes).filter(Number).map(Number);
    this.lopday = Object.keys(this.lopdays).filter(Number).map(Number);
    this.currentUserId = getCurrentUserId();
    this.addForm = this.createFormGroup();
    this.addForm2 = this.createFormGroup2();
    this.getdeductiontype();
  }
getdeductiontype(){
  this.leaveComponentService.getbenefitcategory().subscribe((result: any) => {
    this.dedecutionarray =result;
console.log("result",result)

})

}
getLeavetype(e){
  debugger
  console.log(this.addForm.value.BenefitCategoryId)
  let categoryid=this.addForm.value.BenefitCategoryId
  this.leaveComponentService.getbenefittype(categoryid).subscribe((result: any) => {
    this.leavetype =result;
console.log("result",result)

})
}
  toggleGender(checked) {
    if (checked) {
      this.addForm.addControl('restrictedToGender', new FormControl(null, Validators.required));
    } else {
      this.addForm.removeControl('restrictedToGender');
    }
  }

  toggleMaritalStatus(checked) {
    if (checked) {
      this.addForm.addControl('restrictedToMaritalStatus', new FormControl(null, Validators.required));
    } else {
      this.addForm.removeControl('restrictedToMaritalStatus');
    }
  }

  get name() { return this.addForm.get('name'); }

  get code() { return this.addForm.get('code'); }

  onSubmit() {
    this.leaveComponentService.add(this.addForm.value).subscribe((result: any) => {
      if (result.id === -1) {
        this.toastr.showErrorMessage('Leave component already exists!');
      } else {
        // this.activeModal.close(result);
        
        this.toastr.showSuccessMessage('Basic Leave Component is created successfully!');
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to add the Basic Leave Component');
      });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
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
      showLeaveDescription: [false],
      isPaidLeave: [false],
      isSickLeave: [false],
      isStatutoryLeave: [false],
      isRestrictedToGender: [false],
      isRestrictedToMaritalStatus: [false],
      BenefitCategoryId:[0],
      BenefitTypeId:[0],
     
    });
  }
  createFormGroup2(): FormGroup {
    return this.formBuilder.group({
      EligibleDays:[0],
      EligibilityBase:[0],
      MaxLeaveAtATime:[0],
      VacationSalaryFormula:[null],
      EncashBFCode:[null],
      EncashLimitDays:[0],
      CFLimitDays:[0],
      BaseType:[],
      IncludeLOPDays:[false],
      LeaveType:[],
      LeaveCutOffType:[],
      AccrueLeaveAmt:[false],
      Encash:[false],
      carryforward:[false]
    })
  }
  onSubmit2() {

    this.leaveComponentService.add(this.addForm2.value).subscribe((result: any) => {
      if (result.id === -1) {
        this.toastr.showErrorMessage('Configure Leave component already exists!');
      } else {
        // this.activeModal.close(result);
        
        this.toastr.showSuccessMessage('Configure Leave Component is created successfully!');
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to add the Leave Component');
      });
  }
}

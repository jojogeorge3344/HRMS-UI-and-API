import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

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
import { OvertimePolicyCalculationComponent } from '@settings/overtime/overtime-policy-configuration/overtime-policy-calculation/overtime-policy-calculation.component';
import { LeaveSlabService } from '../leave-slab-service';
import { valueTypeOff } from 'src/app/models/common/types/leaveSlabOff';
import { LeaveSlabGroup } from '../leave-slab.model';
import { LeaveSlabCreateComponent } from '../leave-slab-create/leave-slab-create.component';
import { LeaveSlabEditComponent } from '../leave-slab-edit/leave-slab-edit.component';
import { LeaveSlabViewComponent } from '../leave-slab-view/leave-slab-view.component';
import { ConfirmModalComponent } from '@shared/dialogs/confirm-modal/confirm-modal.component';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { forkJoin } from 'rxjs';
@Component({
  selector: "hrms-leave-component-edit",
  templateUrl: "./leave-component-edit.component.html",
  styleUrls: ['./leave-component-edit.component.scss']

})
export class LeaveComponentEditComponent implements OnInit {
  @Input() leaveComponent: LeaveComponent;
  @Input() isDisabled: boolean;
  @Input() leaveComponentNames: string[];
  @Input() leaveComponentCodes: string[];
  leaveSlabDetails: LeaveSlabGroup[] = [];
  @ViewChild("myTabSet") tabSet: NgbTabset;

  editForm: FormGroup;
  editForm2: FormGroup;
  editForm3:FormGroup;

  genderTypes = GenderType;
  maritalStatusTypes = MaritalStatusType;
  basetype = BaseType;
  eligiblitybase = EligiblityBase;
  leavecutofftype = LeaveCutoffType;
  leavetypes = LeaveType;
  lopdays = Loptype;

  currentUserId: number;
  leavetypearray: number[];
  lopday: number[];
  leavecutoff: number[];
  basetypes: number[];
  eligiblitybases: number[];
  dedecutionarray: [];
  leaves: [];
  genderTypeKeys: number[];
  maritalStatusTypeKeys: number[];

  isCfLimit: boolean = true;
  isEncash: boolean = true;
  isAnnual: boolean = true;
  isEncashBf: boolean = true;
  isEncashLimit: boolean = true;
  detectionTypeList: any;
  accrualList: any;
  accuralBenefitList: any;
  isLoading=false;
  disableAccrualBfCode:boolean;
  disableEncashBfCode:boolean;
  AnnualAccrualBfObj;
  encashBfObj;

  configId: any;
  encashBfList: any;
  isSaveDisable: boolean=false;
  isSaveDisableConfig:boolean=false
  leaveDetails: any;
  valuetype: object;
  valueSlabOffTypeKeys: number[];
  valueSlabOffType = valueTypeOff;
  leaveComponentsList: any
  activeTab: string = "basic";
  isSlabdisabled: boolean=false;
  leaveDetectionSettings:IDropdownSettings={};
  selectedLeaveDetection:any[] = [];
  leaveDeduction;
  isMandatoryAccruel:boolean
  isAccurel:boolean=true
  

  constructor(
    private leaveComponentService: LeaveComponentService,
    private leaveEligiblityService: LeaveEligiblityService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    public leaveSlabService: LeaveSlabService,) {
  }

  ngOnInit(): void {
    this.genderTypeKeys = Object.keys(this.genderTypes)
      .filter(Number)
      .map(Number);
    this.basetypes = Object.keys(this.basetype).filter(Number).map(Number);
    this.valueSlabOffTypeKeys = Object.keys(this.valueSlabOffType).filter(Number).map(Number);
    this.maritalStatusTypeKeys = Object.keys(this.maritalStatusTypes)
      .filter(Number)
      .map(Number);
    this.eligiblitybases = Object.keys(this.eligiblitybase)
      .filter(Number)
      .map(Number);
    this.leavecutoff = Object.keys(this.leavecutofftype)
      .filter(Number)
      .map(Number);
    this.leavetypearray = Object.keys(this.leavetypes)
      .filter(Number)
      .map(Number);
    this.lopday = Object.keys(this.lopdays).filter(Number).map(Number);

    this.currentUserId = getCurrentUserId();
    this.editForm = this.createFormGroup();
    this.editForm2 = this.createFormGroup2();
    //this.editForm3 = this.createFormGroup3();
    this.toggleGender(this.leaveComponent.isRestrictedToGender);
    this.toggleMaritalStatus(this.leaveComponent.isRestrictedToMaritalStatus);
    // this.getAccrualBenefitType();
    // this.getAccrualType();
    this.fillDropDowns();
    this.getDeductionType();
    this.getDetectionListType();
    this.getEncashBF();
    this.editForm.patchValue(this.leaveComponent);
    this.getLeaveSlablist(this.leaveComponent.id)
    this.getLeaveType();
    if(this.editForm.value.isUnpaidLeave==true){
    this.isSlabdisabled=true;
    }
  }

  getDeductionType() {
    this.leaveComponentService.getbenefitcategory().subscribe((result: any) => {
      this.dedecutionarray = result;
    });
  }

  getConfigureData() {
    this.leaveEligiblityService.get(this.leaveComponent.id).subscribe((res) => {
      let result = res[0];
      this.configId = res[0].id;
      this.editForm2.patchValue({
        id: this.configId,
      });
      if(result){
        for(let i=0;i<result.leaveComponentLopDetails.length;i++){
          this.selectedLeaveDetection.push({id:result.leaveComponentLopDetails[i].payrollComponentId,
          name:result.leaveComponentLopDetails[i].payrollComponentName})
        }
      }
      this.editForm2.patchValue(result);
      debugger
      this.AnnualAccrualBfObj = this.accrualList.find((item)=>this.editForm2.controls.annualLeave.value==item.id)
      this.encashBfObj = this.accuralBenefitList.find((item)=>this.editForm2.get('encashBFCode').value==item.id)

      if (res[0].leaveType == 1) {
        this.editForm2.get("leaveEncashment").enable();
        // this.editForm2.get("annualLeave").enable();
        this.disableAccrualBfCode=false;
        this.editForm2.get("accruedLeaveAmount").enable();
        this.isMandatoryAccruel=true
        this.editForm2.patchValue({
           accruedLeaveAmount:result.accruedLeaveAmount
          
        })
      } else {
        this.editForm2.get("leaveEncashment").disable();
        this.disableAccrualBfCode=true;
        this.editForm2.get("accruedLeaveAmount").disable();
        this.isMandatoryAccruel=false
      }
      if (res[0].isEncash == true) {
        this.disableEncashBfCode=false;
        this.editForm2.get("encashLimitDays").enable();
      } else {
        this.disableEncashBfCode=true;
        this.editForm2.get("encashLimitDays").disable();
      }
      if (res[0].isCarryForward == true) {
        this.editForm2.get("cfLimitDays").enable();
      } else {
        this.editForm2.get("cfLimitDays").disable();
      }
    });
  }

  toggleGender(checked) {
    if (checked) {
      this.editForm.addControl(
        "restrictedToGender",
        new FormControl(
          { value: null, disabled: this.isDisabled },
          Validators.required
        )
      );
    } else {
      this.editForm.removeControl("restrictedToGender");
    }
  }

  toggleMaritalStatus(checked) {
    if (checked) {
      this.editForm.addControl(
        "restrictedToMaritalStatus",
        new FormControl(
          { value: null, disabled: this.isDisabled },
          Validators.required
        )
      );
    } else {
      this.editForm.removeControl("restrictedToMaritalStatus");
    }
  }

  get name() {
    return this.editForm.get("name");
  }

  get code() {
    return this.editForm.get("code");
  }

  onSubmit() {
    if(this.editForm.value.isPaidLeave==true || this.editForm.value.isUnpaidLeave==true || this.editForm.value.isSickLeave==true)
      {
    this.leaveComponentService.update(this.editForm.getRawValue()).subscribe(
      (result: any) => {
        if (result === -1) {
          this.toastr.showErrorMessage("Leave component already exists!");
        } else {
          this.toastr.showSuccessMessage(
            "Leave component is updated successfully!"
          );
          this.isSaveDisable = true;
          this.activeTab = "configure";
        }
      },
      (error) => {
        console.error(error);
        this.toastr.showErrorMessage("Unable to update the leave component");
      }
    );
      }else{
        this.toastr.showWarningMessage("Please choose  one leave category!");
      }
  }

  getDetectionListType() {
    this.leaveComponentService.getDetectiontype().subscribe((res) => {
      this.detectionTypeList = res;
      this.leaveDetectionSettings = {
        idField:'id',
        textField:'name',
        allowSearchFilter: true
      };  
    });
  }

  getAccrualType() {
    debugger
    this.isLoading=true;
    this.leaveComponentService.getAccrualtype().subscribe((res:any) => {
      let temp = { id: undefined, name: 'test', isLastRow: true }
      // lastrow
      this.accrualList = [...res, temp];
      this.AnnualAccrualBfObj = res.find((item)=>this.editForm2.get('annualLeave').value==item.id)
      this.isLoading=false;
    });
  }
  getAccrualBenefitType() {
    debugger
    this.isLoading=true;
    this.leaveComponentService.getAccrualBenefittype().subscribe((res:any) => {
      let temp = { id: undefined, name: 'test', isLastRow: true }
      // lastrow
      this.accuralBenefitList = [...res, temp];
      this.encashBfObj = res.find((item)=>this.editForm2.get('encashBFCode').value==item.id)
      this.isLoading=false;
    });
  }
  selectAccrualBfCode(args){
    debugger
    if(args.value && args.value.id){
      this.editForm2.patchValue({
        annualLeave:args.value.id,
        })
    }else{
      this.editForm2.patchValue({
        annualLeave: 0,
      })  
    }

  }
  selectEncashBfCode(args){
    debugger
    if(args.value && args.value.id){
      this.editForm2.patchValue({
        encashBFCode:args.value.id,
        })
     
    }else{
      this.editForm2.patchValue({
        encashBFCode: 0,
      })  
    }

  }

  refreshAccrualBfCode(event){
    event.stopPropagation();
    event.preventDefault();
    this.getAccrualType();
  }
  refreshEncashBfCode(event){
    event.stopPropagation();
    event.preventDefault();
    this.getAccrualBenefitType();
  }
  getCarry(event) {
    if (event == "true") {
      this.editForm2.get("cfLimitDays").enable();
      this.isCfLimit = false;
    } else {
      this.editForm2.get("cfLimitDays").disable();
      this.isCfLimit = true;
      //this.editForm2.controls['cfLimitDays'].reset();
      this.editForm2.patchValue({
        cfLimitDays: 0,
      });
    }
  }

  getLeave(event) {
    if (event == 1) {
      this.editForm2.get("leaveEncashment").enable();
      this.disableAccrualBfCode=false;
      this.editForm2.get("accruedLeaveAmount").enable();
      this.isMandatoryAccruel=true
      this.isAccurel=false
      this.isEncash = false;
      this.isAnnual = false;
    } else {
      this.editForm2.get("leaveEncashment").disable();
      this.disableAccrualBfCode=true;
      this.editForm2.get("accruedLeaveAmount").disable();
      this.isMandatoryAccruel=false
      this.isAccurel=true
      this.editForm2.patchValue({
        leaveEncashment: 0,
        annualLeave: 0,
        accruedLeaveAmount:null
      });
      this.isEncash = true;
      this.isAnnual = true;
      // this.addForm.controls['cfLimitDays'].reset();
    }
  }
  fillDropDowns() {
    debugger
    forkJoin([
      this.leaveComponentService.getAccrualtype(),
      this.leaveComponentService.getAccrualBenefittype()
    ]).subscribe((res:any)=> {
      let temp = { id: undefined, name: 'test',isLastRow: true };
      this.accrualList = [...res[0], temp];
      this.accuralBenefitList = [...res[1], temp];
      this.getConfigureData()
    })
  }
  getcash(event) {
    if (event == "true") {
      this.disableEncashBfCode=false;
      this.editForm2.get("encashLimitDays").enable();
      this.isEncashBf = false;
      this.isEncashLimit = false;
    } else {
      this.disableEncashBfCode=true;
      this.editForm2.get("encashLimitDays").disable();
      this.isEncashBf = true;
      this.isEncashLimit = true;
      this.editForm2.patchValue({
        encashBFCode: 0,
        encashLimitDays: 0,
      });
      // this.addForm.controls['cfLimitDays'].reset();
    }
  }

  openFormulaEditor(type: string) {
    const modalRef = this.modalService.open(
      OvertimePolicyCalculationComponent,
      { size: "lg", centered: true, backdrop: "static" }
    );

    modalRef.componentInstance.formulaType = type;
    modalRef.componentInstance.formula =
      this.editForm2.value.vacationSalaryFormula;

    modalRef.result.then((result) => {
      console.log(result);
      if (result !== "Close click") {
        this.editForm2.get(type).patchValue(result);
      }
    });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern("^([a-zA-Z0-9 ])+$"),
          duplicateNameValidator(this.leaveComponentNames),
        ],
      ],
      code: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          //Validators.pattern('^([a-zA-Z0-9])+$'),
          duplicateNameValidator(this.leaveComponentCodes),
        ],
      ],
      description: [null, [Validators.required, Validators.maxLength(256)]],
      showLeaveDescription: [{ value: false, disabled: this.isDisabled }],
      isPaidLeave: [{ value: false, disabled: this.isDisabled }],
      isUnpaidLeave:[{ value: false, disabled: this.isDisabled }],
      isSickLeave: [{ value: false, disabled: this.isDisabled }],
      isStatutoryLeave: [{ value: false, disabled: this.isDisabled }],
      isRestrictedToGender: [{ value: false, disabled: this.isDisabled }],
      isRestrictedToMaritalStatus: [
        { value: false, disabled: this.isDisabled },
      ],
      createdDate: [],
      benefitCategoryId: [0, Validators.required],
      benefitTypeId: [0, Validators.required],
    });
  }

  createFormGroup2(): FormGroup {
    return this.formBuilder.group({
      eligibleDays: [null,[Validators.required]],
      eligibilityBase: [0, [Validators.required]],
      maxLeaveAtATime: [0],
      vacationSalaryFormula: [null],
      encashBFCode: [0,{ disabled: this.isEncashBf }],
      encashLimitDays: [{ value: 0, disabled: this.isEncashLimit }],
      cfLimitDays: [{ value: 0, disabled: this.isCfLimit }],
      baseType: [null, [Validators.required]],
      isIncludeLOPDays: [null, [Validators.required]],
      leaveType: [null, [Validators.required]],
      leaveCutOffType: [null, [Validators.required]],
      accruedLeaveAmount: [{ value: null, disabled: this.isAccurel }, [Validators.required]],
      isEncash: [false, [Validators.required]],
      // isCarryForward: [false, [Validators.required]],
      leaveComponentId: [null],
      // leaveDeduction: [0,[Validators.required]],
      leaveComponentLopDetails:[],
      leaveEncashment: [{ value: 0, disabled: this.isEncash }],
      annualLeave: [0,{ disabled: this.isAnnual }],
      id: [0],
    });
  }

  getLeaveType() {
    let categoryid = this.editForm.value.benefitCategoryId;
    this.leaveComponentService
      .getbenefittype(categoryid)
      .subscribe((result: any) => {
        this.leaves = result;
      });
  }

  onSubmit2() {
    debugger
    let selectedIds=this.selectedLeaveDetection
    let arrValue = selectedIds.map(({id}) =>id);
    this.leaveDeduction = arrValue.join()
    var payrollcomponet =[]
    selectedIds.forEach((key) => {
      payrollcomponet.push({id:0,leaveComponentId:this.leaveComponent.id,payrollComponentId : key.id})
    });
    this.editForm2.patchValue({
      leaveComponentLopDetails : payrollcomponet,
    })
    if(this.activeTab=="slab"){
      this.activeTab = "configure";
     }
    this.editForm2.patchValue({
      leaveComponentId: this.leaveComponent.id,
      id: this.configId,
    });
    this.leaveEligiblityService.update(this.editForm2.getRawValue()).subscribe(
      (result: any) => {
       // this.activeModal.close(true);
       if(this.editForm.value.isPaidLeave==true || this.editForm.value.isSickLeave==true){
        this.isSlabdisabled=false
        this.activeTab = "slab";
        this.isSaveDisableConfig=true
      }else{
        this.activeModal.close(true);
      }
        this.toastr.showSuccessMessage(
          "Leave component is updated successfully!"
        );
        
      },
      (error) => {
        console.error(error);
        this.toastr.showErrorMessage("Unable to update the leave component");
      }
    );
  }

  getEncashBF() {
    this.leaveEligiblityService.getBenefitType().subscribe((res) => {
      this.encashBfList = res;
    });
  }

  
  getLeaveSlablist(id) {
    this.leaveSlabService.getLeaveComponentDetails(id).subscribe(result => {
      this.leaveSlabDetails = result;
      this.leaveSlabDetails=this.leaveSlabDetails.sort((a, b) => a.leaveComponentName.toLowerCase().localeCompare(b.leaveComponentName.toLowerCase()));
    },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to fetch the LeaveSlab List Details');
    });
  }
  openCreate() {
    debugger
    const modalRef = this.modalService.open(LeaveSlabCreateComponent,
      {size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.code = this.editForm.value.code;
    modalRef.componentInstance.name= this.editForm.value.name;
    modalRef.componentInstance.id= this.leaveComponent.id;
    modalRef.result.then((result) => {
        if (result == 'submit') {
          this.getLeaveSlablist(this.leaveComponent.id)
        }
    });  
  }
  openEdit(relDetails: LeaveSlabGroup) {
    const modalRef = this.modalService.open(LeaveSlabEditComponent,
      { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.relDetails= relDetails;
    modalRef.componentInstance.code = this.editForm.value.code;;
    modalRef.componentInstance.name = this.editForm.value.name;
    modalRef.componentInstance.id= this.leaveComponent.id;

    modalRef.result.then((result) => {
      if (result == 'submit') {
        this.getLeaveSlablist(this.leaveComponent.id)
      }
    });
  }
  openView(relDetails: LeaveSlabGroup) {
    const modalRef = this.modalService.open(LeaveSlabViewComponent,
      { size: 'lg',centered: true, backdrop: 'static' });

    modalRef.componentInstance.relDetails = relDetails;
    // modalRef.componentInstance.code = this.Codes;
    // modalRef.componentInstance.name = this.Names;

    modalRef.result.then((result) => {
      if (result == 'submit') {
        this.getLeaveSlablist(this.leaveComponent.id);
      }
    });
  }

delete(relDetails: LeaveSlabGroup) {
  const modalRef = this.modalService.open(ConfirmModalComponent,
    { centered: true, backdrop: 'static' });
  modalRef.componentInstance.confirmationMessage = `Are you sure you want to delete the LeaveSlab ${relDetails.leaveComponentName}`;
  modalRef.result.then((userResponse) => {
    if (userResponse == true) {
      this.leaveSlabService.delete(relDetails.id).subscribe(() => {
        this.toastr.showSuccessMessage('LeaveSlab deleted successfully!');
        this.getLeaveSlablist(this.leaveComponent.id)
      });
    }
  });
}


// createFormGroup3(): FormGroup {
  //   return this.formBuilder.group({
  //     leaveComponentCode: ['', [
  //       Validators.required
  //     ]],
  //     leaveComponentName: ['', [
  //       Validators.required
  //     ]],
  //     lowerLimit: ['', [
  //       Validators.required
  //     ]],
  //     upperLimit: ['', [
  //       Validators.required
  //     ]],
  //     valueVariable: ['', [
  //       Validators.required
  //     ]],
  //     valueType: ['', [
  //       Validators.required
  //     ]],
  //     leaveComponentId: ['', ],
  //     id:[0]
  //   })
  // }


  // onSubmit3(){
  //   this.editForm3.patchValue({
  //     leaveComponentId:this.leaveComponent.id,
  //     //id:this.configId
  //   })
  //   this.leaveSlabService.update(this.editForm3.getRawValue()).subscribe((result: any) => {
      
  //       this.activeModal.close('submit');
  //       this.toastr.showSuccessMessage('Leave component is updated successfully!');
        
  //   },
  //     error => {
  //       console.error(error);
  //       this.toastr.showErrorMessage('Unable to update the leave component');
  //     });
  // }
  // getWholeDetails(){
  //   debugger
  // this.leaveComponentService.getAll().subscribe(res => {
  //   this.leaveComponentsList = res
  // })}
  // getLeaveDetails() {
  //   debugger
  //   this.leaveSlabService.getAll().subscribe((result) => {
  //     this.leaveDetails = result
  //     let a=this.leaveDetails.filter((value)=>value.leaveComponentId==this.leaveComponent.id)
        
  //       this.editForm3.patchValue({
  //         // leaveComponentId: a[0].leaveComponentId,
  //         leaveComponentName: a[0].leaveComponentName,
  //         leaveComponentCode:a[0].leaveComponentCode,
  //         lowerLimit:a[0].lowerLimit,
  //         upperLimit:a[0].upperLimit,
  //         valueVariable:a[0].valueVariable,
  //         valueType:a[0].valueType,
  //         id:a[0].id
  //       })
      
  //       console.log(this.editForm3)
  //   })
  // }
  // getLeaveName(event){
  //   debugger
  //   if(event){
  //    let a=this.leaveComponentsList.filter((value)=>value.code==event)
  //    this.editForm3.patchValue({
  //     leaveComponentName:a[0].name,
  //     leaveComponentId:this.leaveComponent.id,
      
      
  //    })
  //   }

  // }

  paidLeaveChecked(event){
    if(event=='on'){
      this.editForm.patchValue({
        isUnpaidLeave:false,
        isSickLeave:false
      })
     
    }

  }
  unpaidLeaveChecked(event){
    if(event=='on'){
      this.editForm.patchValue({
        isPaidLeave:false,
        isSickLeave:false
      })
    }

  }
  sickLeaveChecked(event){
    if(event=='on'){
      this.editForm.patchValue({
        isUnpaidLeave:false,
        isPaidLeave:false
      })
    }

  }
}

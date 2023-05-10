import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { LoanRequestService } from '../loan-request.service';
import { LoanSettingsService } from '@settings/loan/loan-settings.service';
import { getCurrentUserId } from '@shared/utils/utils.functions';
import { LoanRequest } from '../loan-request.model';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';

@Component({
  templateUrl: './loan-request-edit.component.html',
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class LoanRequestEditComponent implements OnInit {


  editForm: FormGroup;
  emiMinDate;
  loanTypeKeys: number[];
  paymentTypeKeys: number[];
  loanNo: string;
  expectedOnUpdated: any;
  years: any;
  months: any;
  currentUserId: number;
  loanSettingId: number;
  minDate = undefined;
  showLoanSchedules:boolean=false
  loanDetails:any=[]
  scheduleArray:any=[]
  @Input() loanTypes: any;
  @Input() paymentTypes: any;
  @Input() loanId: any;
  @Input() loanRequest: LoanRequest;
  @Input()  isApproved:any

  constructor(
    private loanRequestService: LoanRequestService,
    private loanSettingsService: LoanSettingsService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToasterDisplayService) {
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    const start = current.getFullYear();
    const end = start + 3;
    this.years = Array.from({ length: end - start }, (x, i) => i + start);
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }

  ngOnInit(): void {
   console.log('isApproved',this.isApproved)
 
    this.currentUserId = getCurrentUserId();
    this.editForm = this.createFormGroup(); 
    if(this.isApproved == "4"){
      this.editForm.controls.loanType.disable();
      this.editForm.controls.paymentType.disable();
      this.editForm.controls.emiStartsFromMonth.disable();
      this.editForm.controls.emiStartsFromYear.disable();
    }
    this.loanTypeKeys = Object.keys(this.loanTypes).filter(Number).map(Number);
    this.paymentTypeKeys = Object.keys(this.paymentTypes).filter(Number).map(Number);
    this.loanRequestService.get(this.loanId).subscribe(result => {
      result.requestedDate = new Date(result.requestedDate);
      result.expectedOn = new Date(result.expectedOn);
      this.loanNo = result.loanNo;
      this.editForm.patchValue(result);
      console.log('editform',result)
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the loan request');
      });

    this.loanSettingsService.getLoanSettingId().subscribe(result => {
      this.loanSettingId = result;
    });
    this.editForm.valueChanges.subscribe(res => {
      const expectedOnYear = new Date(res.expectedOn).getFullYear();
      const expectedOnMonth = new Date(res.expectedOn).getMonth() + 1;
      if (expectedOnYear == res.emiStartsFromYear && res.emiStartsFromMonth && res.emiStartsFromMonth <= expectedOnMonth) {
        this.editForm.get('emiStartsFromMonth').setErrors({ emiMonth: true });
      } else if (res.emiStartsFromMonth) {
        this.editForm.get('emiStartsFromMonth').setErrors(null);
      }
    });
    this.editForm.controls.expectedOn.valueChanges.subscribe(res => {
      const expectedOnYear = new Date(res.expectedOn).getFullYear();
      const expectedOnMonth = new Date(res.expectedOn).getMonth() + 1;
      this.years = Array.from({ length: 3 }, (x, i) => i + new Date(res).getFullYear());
      this.editForm.patchValue({ emiStartsFromYear: this.years[0] }, { emitEvent: false });
    });

    //this.GetLoanRequestDetails()
  }

  onSubmit() {
    debugger
    if(this.editForm.invalid){

      return
         
       }
    const editloanRequestForm = this.editForm.value;
    editloanRequestForm.loanNo = this.loanNo;
    editloanRequestForm.loanSettingId = this.loanSettingId;
    editloanRequestForm.id = this.loanId;
    editloanRequestForm.isapproved = 4;
    editloanRequestForm.emiStartsFromMonth = parseInt(this.editForm.value.emiStartsFromMonth, 10);
    editloanRequestForm.emiStartsFromYear = parseInt(this.editForm.value.emiStartsFromYear, 10);
    this.loanRequestService.update(editloanRequestForm).subscribe(result => {
      this.toastr.showSuccessMessage('The loan request is updated successfully!');
      this.activeModal.close('submit');
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('There is an error in updating loan request');
      });
  }
  draftSave() {
    if(this.editForm.invalid){

      return
         
       }
    const editloanRequestForm = this.editForm.value;
    editloanRequestForm.loanNo = this.loanNo;
    editloanRequestForm.loanSettingId = this.loanSettingId;
    editloanRequestForm.id = this.loanId;
    editloanRequestForm.isapproved = 1;
    editloanRequestForm.emiStartsFromMonth = parseInt(this.editForm.value.emiStartsFromMonth, 10);
    editloanRequestForm.emiStartsFromYear = parseInt(this.editForm.value.emiStartsFromYear, 10);
    this.loanRequestService.update(editloanRequestForm).subscribe(result => {
      this.toastr.showSuccessMessage('The loan request is updated successfully!');
      this.activeModal.close('submit');
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('There is an error in updating loan request');
      });
  }
  validateNumber(ev) {
    const keyCode = ev.keyCode;
    const excludedKeys = [8, 110, 190];
    if (
      !(
        (keyCode >= 48 && keyCode <= 57) ||
        (keyCode >= 96 && keyCode <= 105) ||
        excludedKeys.includes(keyCode)
      )
    ){
      ev.preventDefault();
    }
  }
  generateSchedule_forNonApproved(){
    this.scheduleArray=[]
  
      
      let totalperiod = this.editForm.value.repaymentTerm
      let amountperMonth 
      amountperMonth =this.editForm.value.loanAmount/totalperiod
      amountperMonth = parseInt(amountperMonth)
      amountperMonth = parseFloat(amountperMonth)
      amountperMonth = Math.round( amountperMonth)
  
  
  
      var startingMonth = parseInt(this.editForm.value.emiStartsFromMonth)
      var startYear = this.editForm.value.emiStartsFromYear
      var startDate = new Date(startYear,  startingMonth -1);
     
     
  
  
    for(var i=1;i<= totalperiod;i++){
      if(i == 1){
      var month =  startDate.getMonth() + 1 
      var year = startDate.getFullYear()
      this.scheduleArray.push({Year : year,Month : this.months[month -1],Amount :amountperMonth,Status :'Pending'})
      }else{
        var startingMonth = parseInt(this.editForm.value.emiStartsFromMonth)
        var startYear = this.editForm.value.emiStartsFromYear
        var startDate = new Date(startYear,  startingMonth -1);
        var upComingDate = new Date(startDate.setMonth(startDate.getMonth() + i-1));
         month =  upComingDate.getMonth() +1
         year = upComingDate.getFullYear()
         this.scheduleArray.push({Year : year,Month : this.months[month-1],Amount :amountperMonth,Status :'Pending'})
      }
      
    }
    
  
    this.showLoanSchedules =  true
  
  
  
    }

    generateSchedule(){
      if(this.isApproved == true){
            this.GetLoanRequestDetails()
            // this.editForm.controls..disable()
             
  
      }else {
        this.generateSchedule_forNonApproved()
      }
    }

  // generateSchedule_forApproved(){

  //   this.scheduleArray=[]
  //   let loanAmt = this.loanDetails.loanAmount
  //   let amtPerMonth = this.loanDetails.emiAmount
  //   let tenureNumber = this.loanDetails.tenureNumber
  //   let remainingtenure = this.loanDetails.remainingTenure
  //   let paidedtenure = tenureNumber - remainingtenure
  //   let balanceAmt = this.loanDetails.balanceAmount


  //   var startingMonth = this.loanDetails.emiStartsFromMonth
  //   var startYear = this.loanDetails.emiStartsFromYear
  //   var startDate = new Date(startYear,  startingMonth -1);
   
  //   let totalperiod = tenureNumber + this.editForm.value.extendedMonth
   


  // for(var i=1;i<= totalperiod;i++){
  //   if(i == 1){
  //     if(i <= paidedtenure){
  //       var month =  startDate.getMonth() + 1 
  //       var year = startDate.getFullYear()
  //       this.scheduleArray.push({Year : year,Month : this.months[month -1],Amount :amtPerMonth.toFixed(2),Status :'Processed'})
  //     }
  //   }else{

  //     if(i <= paidedtenure){
  //       var startingMonth = this.loanDetails.emiStartsFromMonth
  //       var startYear = this.loanDetails.emiStartsFromYear
  //       var startDate = new Date(startYear,  startingMonth -1);
  //       var upComingDate = new Date(startDate.setMonth(startDate.getMonth() + i-1));
  //       month =  upComingDate.getMonth() +1
  //       year = upComingDate.getFullYear()
  //       this.scheduleArray.push({Year : year,Month : this.months[month-1],Amount :amtPerMonth.toFixed(2),Status :'Processed'})
  //     }else {
  //       amtPerMonth = balanceAmt/(remainingtenure + this.editForm.value.extendedMonth)
  //       var startingMonth = this.loanDetails.emiStartsFromMonth
  //       var startYear = this.loanDetails.emiStartsFromYear
  //       var startDate = new Date(startYear,  startingMonth -1);
  //       var upComingDate = new Date(startDate.setMonth(startDate.getMonth() + i-1));
  //       month =  upComingDate.getMonth() +1
  //       year = upComingDate.getFullYear()
  //       this.scheduleArray.push({Year : year,Month : this.months[month-1],Amount :amtPerMonth.toFixed(2),Status :'Pending'})

  //     }
  //   }
    
  // }
  

  // this.showLoanSchedules =  true

  // }

  GetLoanRequestDetails(){
    this.loanRequestService.GetLoanRequestDetails(this.loanId).subscribe((res:any) =>{
    this.loanDetails = res
    
    this.scheduleArray=[]
    let loanAmt = this.loanDetails.loanAmount
    let amtPerMonth = this.loanDetails.emiAmount
    let tenureNumber = this.loanDetails.tenureNumber
    let remainingtenure = this.loanDetails.remainingTenure
    let paidedtenure = tenureNumber - remainingtenure
    let balanceAmt = this.loanDetails.balanceAmount


    var startingMonth = this.loanDetails.emiStartsFromMonth
    var startYear = this.loanDetails.emiStartsFromYear
    var startDate = new Date(startYear,  startingMonth -1);
   
    let totalperiod = tenureNumber + this.editForm.value.extendedMonth
   


  for(var i=1;i<= totalperiod;i++){
    if(i == 1){
      if(i <= paidedtenure){
        var month =  startDate.getMonth() + 1 
        var year = startDate.getFullYear()
        this.scheduleArray.push({Year : year,Month : this.months[month -1],Amount :Math.round(amtPerMonth),Status :'Processed'})
      }
    }else{

      if(i <= paidedtenure){
        var startingMonth = this.loanDetails.emiStartsFromMonth
        var startYear = this.loanDetails.emiStartsFromYear
        var startDate = new Date(startYear,  startingMonth -1);
        var upComingDate = new Date(startDate.setMonth(startDate.getMonth() + i-1));
        month =  upComingDate.getMonth() +1
        year = upComingDate.getFullYear()
        this.scheduleArray.push({Year : year,Month : this.months[month-1],Amount :Math.round(amtPerMonth),Status :'Processed'})
      }else {
        amtPerMonth = balanceAmt/(remainingtenure + this.editForm.value.extendedMonth)
        var startingMonth = this.loanDetails.emiStartsFromMonth
        var startYear = this.loanDetails.emiStartsFromYear
        var startDate = new Date(startYear,  startingMonth -1);
        var upComingDate = new Date(startDate.setMonth(startDate.getMonth() + i-1));
        month =  upComingDate.getMonth() +1
        year = upComingDate.getFullYear()
        this.scheduleArray.push({Year : year,Month : this.months[month-1],Amount :Math.round(amtPerMonth),Status :'Pending'})

      }
    }
    
  }
  

  this.showLoanSchedules =  true
    
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch Loan Details.');
      });
    }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      loanNo: this.loanNo,
      loanType: [null, [Validators.required]],
      loanAmount: ['', [Validators.required,Validators.max(2000000)]],
      paymentType: [null, [Validators.required]],
      expectedOn: [new Date(Date.now()), [
        Validators.required,
      ]],
      emiStartsFromYear: [null, [Validators.required]],
      emiStartsFromMonth: [null, [Validators.required]],
      repaymentTerm: ['', [Validators.max(36), Validators.required]],
      comments: ['', [Validators.required,Validators.maxLength(200)]],
      employeeID: [this.currentUserId],
      loanSettingId: [this.loanSettingId],
      createdDate: [],
      extendedMonth:[0]


    });
  }
}

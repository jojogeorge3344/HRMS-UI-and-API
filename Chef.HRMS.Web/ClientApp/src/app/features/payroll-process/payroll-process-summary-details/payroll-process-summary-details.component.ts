import { Component, OnInit } from '@angular/core';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { PayrollProcessService } from '../payroll-process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'hrms-payroll-process-summary-details',
  templateUrl: './payroll-process-summary-details.component.html',
  styleUrls: ['./payroll-process-summary-details.component.scss']
})
export class PayrollProcessSummaryDetailsComponent implements OnInit {
  payrollmonth:any
  payrollyear:any
  payrollcutoff:any
  id:any
  paygroupId:any
  month:any
  summaryDetails:any=[]
  overTimeCutOff:any
  treeData: any=[];
  payrollProcessId:any
  constructor(
    private payrollProcessService: PayrollProcessService,
    private toastr: ToasterDisplayService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
   
   }

  ngOnInit(): void {
   
    this.route.queryParams.subscribe(params => {
      this.id = parseInt(params.id, 10);
      this.payrollmonth =  params.month
      this.payrollyear =params.year
      this.payrollcutoff = params.cutOffDay
      this.paygroupId = parseInt(params.payGroup, 10);
      this.month = params.date.split('-')[0];
      this.overTimeCutOff = params.overTimeCutOff
      this.payrollProcessId = params.processId
    });
    this.updatePayrollSummaryDetails()
  }

  updatePayrollSummaryDetails(){
    this.payrollProcessService.updatePayrollSummaryDetails(this.paygroupId,this.payrollProcessId,this.datePipe.transform(new Date(),"yyyy-MM-dd")).subscribe(res => {
        this.getPayrollProcessingSummaryDetails()
         
      },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to Insert Payroll Summary Details.');
      });
  }

   getPayrollProcessingSummaryDetails(){
    this.summaryDetails=[]
    this.payrollProcessService.getPayrollProcessingSummaryDetails(this.payrollProcessId)
    .subscribe(result => {
      this.summaryDetails = result
      console.log('summarydetails',this.summaryDetails)
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch Summary  Details.');
      });
   }

   onSubmit(){
    this.payrollProcessService.completePayrollProcess(this.payrollProcessId).subscribe(res => {
        this.toastr.showSuccessMessage('Payroll Process Completed Successfully.');
         
      },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to Complete  Payroll Process.');
      });
  }

   

}

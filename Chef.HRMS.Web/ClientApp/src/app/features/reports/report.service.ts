import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeListReport } from './employee-list-report/employee-list-reports.model';
import { EmployeeBasicComponentBreakup } from './employee-basic-component-report/employeebasiccomponentbreakup.model';
import { mergeMap, groupBy, toArray, map, distinct } from 'rxjs/operators';
import { GroupedObservable, Observable, zip, of } from 'rxjs';
import { ProcessedSalaryReport } from './processed-salary-report/processed-salary-reports.model';
import { LeaveReport } from './leave-report/leave-reports.model';
import { AttendanceReport } from './attendance-report/attendance-reports.model';
import { Months } from 'src/app/models/common/types/months';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private data = [];  
  public baseUrl: string;
  public http: HttpClient;
  public apiUrl:string;
  public jobUrl:string;
  overtimeData:any

  months = Months;
  payslipData: any;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl + 'api/report/';
    this.apiUrl=baseUrl + 'api/payrollComponentDetails/'
    this.jobUrl = baseUrl + "api/jobdetails/";

  }

  getEmployeeList(offset) {
    return this.http.get<EmployeeListReport[]>(this.baseUrl + 'employeereport/getAll/' + offset).pipe(map(response => response));
  }

  getLeaveReportDetailsList(offset) {
    return this.http.get<LeaveReport[]>(this.baseUrl + 'LeaveReport/GetLeaveReportDetails/' + offset).pipe(map(response => response));
  }

  
  getProcessedSalaryDetailsList(offset) {
    return this.http.get<ProcessedSalaryReport[]>(this.baseUrl + 'ProcessedSalaryReport/GetProcessedSalaryDetails/' + offset)
      .pipe(
        map(response => {
          return response.map(report => {
            return {
              ...report,
              total: report.basicComponent + report.bonus + report.loanOrAdvance
                - report.loanRepayment - report.adhocDeduction - report.lopDeduction
            };
          });
        }
        )
      );
  }

  getPaysipYears(){
    return this.http.get<any>( this.apiUrl +'getPayslipYears' ).pipe(map(response => response));
  }
  getAttendanceListDetailsList(startDate, endDate) {
    return this.http.get<AttendanceReport[]>(this.baseUrl + 'AttendanceReport/GetAll/' + startDate + '/' + endDate).pipe(map(response => response));
  }

  getEmployeeBasicComponentBreakupList(month, year) {
    return this.http.get<{ id: number, values: EmployeeBasicComponentBreakup[] }[]>(this.baseUrl + 'EmployeeBasicComponentBreakup/getAll/' + month + '/' + year)
      .pipe(
        map((res: any[]) => res.map(comp => {
          comp[comp.shortCode] = comp.monthlyAmount;
          return comp;
        })),
        mergeMap((res: any) => res),
        groupBy((component: any) => component.employeeId,),
        mergeMap((group: GroupedObservable<string, Observable<any>>) =>
          zip(of(group.key), group.pipe(toArray()))),
        map(arr => (
          { id: parseInt(arr[0]), values: arr[1] }
        )),
        toArray(),
      );
  }
  setOption(reportType,paygroupIds,
    departmentIds,
    designationIds,
    employeeIds,
    locationIds,employeeCategory,leaveComponentIds,fromDate,ToDate) 
    { 
debugger
this.data=[]
    this.data.push({reportType:reportType,paygroupIds:paygroupIds,
      departmentIds:departmentIds,
      designationIds:designationIds,employeeIds:employeeIds,
      locationIds:locationIds,
      employeeCategory:employeeCategory,
      leaveComponentIds:leaveComponentIds,
      fromDate:fromDate,
      ToDate:ToDate
    });  

  }  
  getOption() {  
    return this.data;  
  } 
  getCategory() {
    return this.http.get<any>(this.jobUrl + 'getGroupCategory' ).pipe(map(response => { return response; }));
  }
  getOvertime(overtimeDetails){
  this.overtimeData=overtimeDetails
  }
  setOvertime(){
    return this.overtimeData
  }
  getPaySlip(){
    return this.payslipData
  }
  setPaySlip(paygroupId,department,designation,employeeId,fromDate,ToDate){
    this.payslipData=[]
    this.payslipData.push({
      paygroupId:paygroupId,
      department:department,
      designation:designation,
      employeeId:employeeId,
      fromDate:fromDate,
      ToDate:ToDate
    })
  }
}

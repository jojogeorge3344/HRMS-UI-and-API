import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import {
  NgbActiveModal,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeLeaveService } from "../employee-leave.service";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDate,
  NgbCalendar,
} from "@ng-bootstrap/ng-bootstrap";
import {
  LeaveBalanceValidator,
  calculateDaysInBetween,
  getCurrentUserId,
} from "@shared/utils/utils.functions";
import { Observable, forkJoin } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from "rxjs/operators";
import { LeaveComponent } from "@settings/leave/leave-component/leave-component.model";
import { Employee } from "@features/employee/employee.model";
import { EmployeeService } from "@features/employee/employee.service";
import { SignalrService } from "@shared/services/signalr.service";
import { ToasterDisplayService } from "src/app/core/services/toaster-service.service";
import { HolidayService } from "@settings/holiday/holiday.service";
import { formatDate, DatePipe } from "@angular/common";
import { ConfirmModalComponent } from "@shared/dialogs/confirm-modal/confirm-modal.component";
import { DocumentService } from "@shared/services/document.service";
import { DocumentUploadService } from "@shared/services/document-upload.service";
import { EmployeeLeaveDocumentsService } from "../employee-leave-documents.service";
import { RequestStatus } from 'src/app/models/common/types/requeststatustype';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DateformaterService } from "@shared/services/dateformater.service";

@Component({
  selector: 'hrms-employee-leave-request-edit',
  templateUrl: './employee-leave-request-edit.component.html',
  styleUrls: ['./employee-leave-request-edit.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    {provide: NgbDateParserFormatter, useClass: DateformaterService}],
})
export class EmployeeLeaveRequestEditComponent implements OnInit {

  addForm: FormGroup;
  leaveComponents: LeaveComponent[];

  @Input() requestId: any;
  @Input() leaveBalance: any = [];
  @Input() leaveSettings: any;
  @Input() isEmployeeLeave: boolean;
  @Input() leaveRequest:any

  fromDate: Date;
  toDate: Date;
  numberOfDays = 0;
  isSingleDay: boolean;
  selectedButton: any;
  selectedLeaveComponent: any;
  minDateFrom;
  maxDateFrom;
  minDateTo;
  maxDateTo;
  currentDate;
  flag = 0;
  isValid = true;
  fulldayLeaves = [];
  firsthalfLeaves: string[] = [];
  secondhalfLeaves = [];
  leaveObj;
  employeeList: Employee[];
  selectedItems = [];
  @ViewChild('notifyPersonnel') notifyPersonnel: ElementRef;
  employeeDetails: Employee;
  taken = ["", ""];
  @Input() leaves;
  @Input() wfh;
  @Input() onDuty;
  holidaydate: any;
  leaveInfo: any;
  currentUserId: number;
  employeeId: number;
  fileName: string;

  documentToUpload: File = null;
  documentPath = "";
  companyName = "Company";
  branchName = "Branch";
  directoryName = "c:";
  documentSave;
  leaveDocument: any;
  requestTypes = RequestStatus;
  fileId: any;
  loginUserDetail:any
  isLoading=false;
  validateDate:boolean=true;
  attachmentDetails: any;
  constructor(
    private employeeLeaveService: EmployeeLeaveService,
    private employeeService: EmployeeService,
    private signalrService: SignalrService,
    private documentService: DocumentService,
    private documentUploadService: DocumentUploadService,
    private employeeLeaveDocumentsService: EmployeeLeaveDocumentsService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToasterDisplayService,
    private holidayService: HolidayService,
    private datepipe: DatePipe,
    public modalService: NgbModal
  ) {
    const current = new Date();
    this.minDateFrom = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.maxDateFrom = {
      year: current.getFullYear() + 1,
      month: 3,
      day: 31,
    };
    this.minDateTo = {
      year: current.getFullYear(),
      month: 4,
      day: 1,
    };
    this.maxDateTo = {
      year: current.getFullYear() + 1,
      month: 3,
      day: 31,
    };
    this.currentDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
  }
  alreadySelectedItem=[];
  notifyPersonList=[]
  ngOnInit(): void {
    debugger
    console.log(this.leaves)
    this.currentUserId = getCurrentUserId();
    this.documentPath = `${this.directoryName}\\${this.companyName}\\${this.branchName}\\Leave\\${this.currentUserId}\\`;

    // this.employeeId = this.requestId;
    this.addForm = this.createFormGroup();
    this.addForm.patchValue(this.leaveRequest)
    this.addForm.patchValue({
      fromDate: new Date(this.leaveRequest.fromDate),
      toDate: new Date(this.leaveRequest.toDate),
      rejoinDate:new Date(this.leaveRequest.rejoinDate),
      leaveComponentId:this.leaveRequest.leaveComponentId,
      id:this.leaveRequest.id
    });
    console.log(this.addForm)
    this.getLeaveBalance();
    this.getEmployeeDetails();
    this.getEmployeeList();
    this.subscribeToChanges();
    this.getEmployeeHoliday();
    //this.getAllInfoLeave(this.employeeId);
    this.formatLeaves();
    // this.getAttachmentDetails()
    if(!this.isEmployeeLeave){
      this.getFileDetailsByGroup()
    }else{
      this.getFileDetailsByIndividual()
    }
    
    
  }

  formatLeaves() {
    this.leaves.forEach((leave) => {
      if (
        new Date(leave.fromDate).setHours(0, 0, 0, 0) ==
        new Date(leave.toDate).setHours(0, 0, 0, 0)
      ) {
        if (leave.isfullday) {
          this.fulldayLeaves = [...this.fulldayLeaves, leave.fromDate];
        } else if (leave.isFirstDayFirstHalf) {
          this.firsthalfLeaves = [...this.firsthalfLeaves, leave.fromDate];
        } else if (leave.isFirstDaySecondHalf) {
          this.secondhalfLeaves = [...this.secondhalfLeaves, leave.fromDate];
        }
      } else {
        let d = new Date(leave.fromDate).setHours(0, 0, 0, 0);
        for (
          d;
          d <= new Date(leave.toDate).setHours(0, 0, 0, 0);
          d = d + 86400000
        ) {
          if (d == new Date(leave.fromDate).setHours(0, 0, 0, 0)) {
            if (leave.isFirstDayFirstHalf) {
              this.firsthalfLeaves = [...this.firsthalfLeaves, leave.fromDate];
            } else if (leave.isFirstDaySecondHalf) {
              this.secondhalfLeaves = [
                ...this.secondhalfLeaves,
                leave.fromDate,
              ];
            } else {
              this.fulldayLeaves = [...this.fulldayLeaves, leave.fromDate];
            }
          } else if (d == new Date(leave.toDate).setHours(0, 0, 0, 0)) {
            if (leave.isSecondDayFirstHalf) {
              this.firsthalfLeaves = [...this.firsthalfLeaves, leave.toDate];
            } else if (leave.isSecondDaySecondHalf) {
              this.secondhalfLeaves = [...this.secondhalfLeaves, leave.toDate];
            } else {
              this.fulldayLeaves = [...this.fulldayLeaves, leave.toDate];
            }
          } else {
            this.fulldayLeaves = [
              ...this.fulldayLeaves,
              `${formatDate(d, "yyyy-MM-dd", "en-US")}T00:00:00`,
            ];
          }
        }
      }
    });
  }

  subscribeToChanges() {
    this.addForm.valueChanges.subscribe((res) => {
      this.fromDate = this.addForm.get("fromDate").value;
      this.toDate = this.addForm.get("toDate").value;
      if (
        this.fromDate &&
        this.toDate &&
        typeof this.fromDate !== "string" &&
        typeof this.toDate !== "string"
      ) {
        this.numberOfDays = calculateDaysInBetween(this.fromDate, this.toDate);
        this.isSingleDay = this.numberOfDays === 1;
        if (this.isSingleDay) {
          if (res.singleDay === 1) {
            this.numberOfDays = 1;
            this.addForm.patchValue(
              {
                isFullDay: true,
                isFirstDayFirstHalf: false,
                isFirstDaySecondHalf: false,
              },
              { emitEvent: false }
            );
          } else if (res.singleDay === 2) {
            this.numberOfDays = 0.5;
            this.addForm.patchValue(
              {
                isFullDay: false,
                isFirstDayFirstHalf: true,
                isFirstDaySecondHalf: false,
              },
              { emitEvent: false }
            );
          } else if (res.singleDay === 3) {
            this.numberOfDays = 0.5;
            this.addForm.patchValue(
              {
                isFullDay: false,
                isFirstDayFirstHalf: true,
                isFirstDaySecondHalf: false,
              },
              { emitEvent: false }
            );
          }
        } else {
          if (res.firstDay === 1) {
            this.addForm.patchValue(
              {
                isFirstDayFirstHalf: true,
                isFirstDaySecondHalf: false,
              },
              { emitEvent: false }
            );
          } else if (res.firstDay === 2) {
            this.addForm.patchValue(
              {
                isFirstDayFirstHalf: false,
                isFirstDaySecondHalf: true,
              },
              { emitEvent: false }
            );
          }
          if (res.lastDay === 1) {
            this.addForm.patchValue(
              {
                isSecondDayFirstHalf: true,
                isSecondDaySecondHalf: false,
              },
              { emitEvent: false }
            );
          } else if (res.lastDay === 2) {
            this.addForm.patchValue(
              {
                isSecondDayFirstHalf: false,
                isSecondDaySecondHalf: true,
              },
              { emitEvent: false }
            );
          }
          if (res.firstDay === 2 && res.lastDay === 1) {
            this.numberOfDays -= 1;
          } else if (res.firstDay === 2 || res.lastDay === 1) {
            this.numberOfDays -= 0.5;
          }
        }
      }
      this.validateRequest();
    });
  }

  getEmployeeDetails() {
    this.employeeService.getDetails(this.requestId).subscribe(
      (result) => {
        this.employeeDetails = result;
        this.addForm.patchValue(
          {
            leaveStructureId: this.employeeDetails.leaveStructureId,
            // employeeName: this.employeeDetails.fullName,
          },
          {
            emitEvent: false,
          }
        );
        // if (result && result.documentName.length > 40) {
        //   this.fileName = result.documentName.substr(0, 40) + "...";
        // } else {
        //   this.fileName = result.documentName;
        // }
      },
      (error) => {
        console.error(error);
      }
    );
    this.getLeaveRequestNotifyPersonnel()
  }

  getLeaveBalance() {
    this.isLoading=true;
    this.employeeLeaveService.getAllLeaveBalance(this.leaveRequest.employeeId).subscribe(
      (result) => {
        let temp = { id: undefined, leaveComponentName: 'test', isLastRow: true }
        // lastrow
        this.leaveBalance = [...result, temp]; 
        this.isLoading=false;
        this.leaveObj=this.leaveBalance.find((item) => item.leaveComponentId == this.leaveRequest.leaveComponentId)
      },
      (error) => {
        console.error(error);
        this.toastr.showErrorMessage("Unable to fetch the Leave Balance");
      }
    );
  }

  getEmployeeList() {
    this.employeeService.getAll().subscribe(
      (result) => {
        this.loginUserDetail=result
        this.employeeList = result.filter(
          (employee) => employee.id !== this.requestId
        );
        console.log(this.employeeList)
        if(!this.isEmployeeLeave){
          let a= result.filter(x=>x.id==this.leaveRequest.employeeId)
          this.addForm.patchValue({
            employeeName:a[0].firstName,
          });
        }
      
      },
      (error) => {
        console.error(error);
      }
    );
    this.getLeaveRequestNotifyPersonnel()
  }
  getEmployeeId(event){
    debugger
    let a=this.employeeList.filter(x=>x.firstName==event)
    this.addForm.patchValue({
      employeeId:a[0].id,
      employeeName:a[0].firstName

    })
  }
  getLeaveRequestNotifyPersonnel(){
    debugger
    this.employeeLeaveService.getAllNotifyPersonnalsIndividual(this.leaveRequest.id).subscribe((res:any) =>{
      this.selectedItems = this.employeeList?.filter(({ id: id1 }) => 
      
      res.some(({ notifyPersonnel: id2 }) => id2 === id1)
      
      );
      this.alreadySelectedItem = [...this.selectedItems]
      this.notifyPersonList = res
      console.log(this.selectedItems )
      // this.alreadySelectedItem = [...this.selectedItems]
      // this.notifyPersonList = res
      
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Notify personnel');
      });
  }

  isAlreadyApplied(date) {
    const currentDate = `${date.year}-${date.month
      .toString()
      .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}T00:00:00`;
    if (this.leaves.includes(currentDate)) {
      return { color: "blueviolet" };
    }
    if (this.wfh.includes(currentDate)) {
      return { color: "darkcyan" };
    }
    if (this.onDuty.includes(currentDate)) {
      return { color: "chocolate" };
    }
    return;
  }

  formatter = (employee) => employee.firstName;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.employeeList
          .filter((employee) => new RegExp(term, "mi").test(employee.firstName))
          .slice(0, 10)
      )
    );

  selected($event) {
    $event.preventDefault();
    if (this.selectedItems.indexOf($event.item) === -1) {
      this.selectedItems.push($event.item);
    }
    this.notifyPersonnel.nativeElement.value = "";
  }

  remove(item) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
  }

  onFromDateSelection(date: NgbDate) {
    this.minDateTo = date;
    this.validateDate =true
  }

  onToDateSelection(date: NgbDate) {
    this.maxDateFrom = date;
    this.addForm.patchValue({
      rejoinDate: new Date(date.year, date.month - 1, date.day + 1),
    });
    this.validateDate =true;
  }

  checkDates() {
    if (
      this.fromDate &&
      this.toDate &&
      typeof this.fromDate !== "string" &&
      typeof this.toDate !== "string"
    ) {
      const d = new Date(this.fromDate);
      for (d; d <= this.toDate; d.setDate(d.getDate() + 1)) {
        const currentDate = `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${d
          .getDate()
          .toString()
          .padStart(2, "0")}T00:00:00`;
        if (this.wfh.includes(currentDate)) {
          this.taken[0] = currentDate;
          this.taken[1] = "WFH";
          break;
        }
        if (this.fulldayLeaves.includes(currentDate)) {
          this.taken[0] = currentDate;
          this.taken[1] = "leave";
          this.flag = 1;
          break;
        }
        const [date] = currentDate.split("T");
        if (
          (this.addForm.get("singleDay").value == 2 ||
            this.addForm.get("firstDay").value == 1 ||
            this.addForm.get("lastDay").value == 1) &&
          this.firsthalfLeaves.some((d) => d.startsWith(date))
        ) {
          this.taken[0] = currentDate;
          this.taken[1] = "firsthalfleave";
          this.flag = 1;
          break;
        }
        if (
          (this.addForm.get("singleDay").value == 3 ||
            this.addForm.get("firstDay").value == 2 ||
            this.addForm.get("lastDay").value == 2) &&
          this.secondhalfLeaves.some((d) => d.startsWith(date))
        ) {
          this.taken[0] = currentDate;
          this.taken[1] = "secondhalfleave";
          this.flag = 1;
          break;
        }

        if (this.onDuty.includes(currentDate)) {
          this.taken[0] = currentDate;
          this.taken[1] = "on duty";
          break;
        }
      }
      if (this.toDate < d) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  getNumberOfDaysInMonth() {
    const daysInMonths = [];
    if (
      this.fromDate &&
      this.toDate &&
      typeof this.fromDate !== "string" &&
      typeof this.toDate !== "string" &&
      this.fromDate.getMonth() == this.toDate.getMonth()
    ) {
      daysInMonths.push(this.toDate.getDate() - this.fromDate.getDate());
    } else {
      for (
        const d = new Date(this.fromDate);
        d <= this.toDate;
        d.setMonth(d.getMonth() + 1)
      ) {
        d.getMonth();
        this.toDate.getMonth();
        if (d.getMonth() == this.toDate.getMonth()) {
          daysInMonths.push(this.toDate.getDate());
        } else if (this.fromDate.getMonth() == d.getMonth()) {
          const numberOfDays =
            new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() -
            this.fromDate.getDate();
          daysInMonths.push(numberOfDays);
        } else {
          daysInMonths.push(
            new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
          );
        }
      }
    }
    return daysInMonths;
  }

  validateRequest() {
    const selectedLeaveComponentId = this.addForm.value.leaveComponentId;
    const selectedLeaveComponent = this.leaveBalance.find(
      (leaveComponent) =>
        leaveComponent.leaveComponentId == selectedLeaveComponentId
    );
    if (selectedLeaveComponent && selectedLeaveComponent.shortCode != "LOP") {
      if (this.numberOfDays > selectedLeaveComponent.leaveBalance) {
        this.addForm.controls.numberOfDays.setErrors({ numberOfDays: true });
      } else {
        this.addForm.controls.numberOfDays.setErrors(null);
      }
    } else {
      this.addForm.controls.numberOfDays.setErrors(null);
    }
    if (!this.addForm.controls.numberOfDays.errors) {
      const isDaysTaken = this.checkDates();
      if (!isDaysTaken) {
        this.addForm.controls.numberOfDays.setErrors({ daysTaken: true });
      } else {
        this.addForm.controls.numberOfDays.setErrors(null);
      }
    }
    const daysInMonths = this.getNumberOfDaysInMonth();
    if (!this.addForm.controls.numberOfDays.errors) {
      if (
        daysInMonths.some(
          (res) => res > this.leaveSettings.maxNumberOfDaysPerMonth
        ) ||
        !this.leaveSettings.maxNumberOfDaysPerMonth
      ) {
        this.addForm.controls.numberOfDays.setErrors({ daysPerMonth: true });
        return;
      } else {
        this.addForm.controls.numberOfDays.setErrors(null);
        this.isValid = true;
      }
    }
    if (!this.addForm.controls.numberOfDays.errors) {
      if (
        this.leaveSettings.maxConsecutiveDays < this.numberOfDays ||
        !this.leaveSettings.maxConsecutiveDays
      ) {
        this.addForm.controls.numberOfDays.setErrors({ consecutiveDays: true });
      } else {
        this.addForm.controls.numberOfDays.setErrors(null);
      }
    }
  }

  handleFileInput(files: FileList) {
    if (files.length == 0) {
      return;
    }

    this.documentToUpload = files.item(0) as File;
    const documentExtension = this.documentToUpload.type.substring(
      this.documentToUpload.type.lastIndexOf("/") + 1
    );

    if (this.documentToUpload.size >= 2097152) {
      (this.addForm.get("document") as FormGroup).controls.size.setErrors({
        filesize: true,
      });
      return;
    }

    const validExtensions = ["pdf", "png", "jpg", "jpeg", "doc", "docx"];
    if (!validExtensions.includes(documentExtension)) {
      (this.addForm.get("document") as FormGroup).controls.extension.setErrors({
        filetype: true,
      });
      return;
    }

    this.fileName = this.documentToUpload.name;
    this.documentSave = new FormData();

    this.addForm.patchValue({ document: { name: this.fileName } });
    this.addForm.patchValue({
      document: { path: this.documentPath + this.documentToUpload.name },
    });
    this.addForm.patchValue({ document: { extension: documentExtension } });
    this.addForm.patchValue({ document: { size: this.documentToUpload.size } });

    this.documentSave.append("document", this.documentToUpload);
    this.documentSave.append("path", this.documentPath);
  }

  removeFile() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static",
    });

    modalRef.componentInstance.confirmationMessage =
      "Are you sure you want to delete this document ?";

    modalRef.result.then((userResponse) => {
      if (userResponse == true) {
        this.resetFileData();
      }
    });
  }

  resetFileData() {
    this.documentToUpload = null;
    this.documentSave = null;
    this.fileName = "";
    this.addForm.get("document").reset();
  }

  onSubmit() {
    debugger
    console.log(this.addForm)
    if(this.addForm.invalid){

      return
         
       }
       if(this.addForm.controls.fromDate.value > this.addForm.controls.toDate.value){
        this.validateDate = false;
        return;
      }
    this.addForm.value.document.id=this.fileId
    let addForm = this.addForm.value;
    addForm.leaveStatus=this.requestTypes.Approved
    addForm.numberOfDays = this.numberOfDays;
    addForm = {
      ...addForm,
      currentDate: this.datepipe.transform(Date.now(), "yyyy-MM-dd hh:mm:ss"),
      toDate: new Date(addForm.toDate.setHours(12)),
      fromDate: new Date(addForm.fromDate.setHours(12)),
      rejoinDate: new Date(addForm.rejoinDate.setHours(12)),
      leaveComponentId: parseInt(addForm.leaveComponentId, 10),
    };

    if (this.flag !== 1) {
      // if (this.addForm.get("document.name").value === null) {
        if (this.addForm.value.document.name === null) {
        this.employeeLeaveService.update(addForm).subscribe((result) => {
          this.notify(result);
          this.leaveDocument = {
            leaveId: this.leaveRequest.id,
            documentId: this.attachmentDetails.documentId,
            isArchived:true,
            id:this.attachmentDetails.leaveDocumentId
          };
          this.employeeLeaveDocumentsService
          .update(this.leaveDocument)
          .subscribe(
            (result: any) => {
            },
            (error) => {
              console.error(error);
              this.toastr.showErrorMessage(
                "Unable to submit Leave Request"
              );
            }
          );
        });
      } else {
        if(this.attachmentDetails.documentName==null){
          if(this.addForm.value.document)
          this.addForm.patchValue({
            document:{id:0},
          leaveStatus:this.requestTypes.Approved
          })
          forkJoin([
          this.employeeLeaveService.update(this.addForm.value),
          this.documentService.add(this.addForm.value.document),
          this.documentUploadService.upload(this.documentSave)
        ]).subscribe(
          ([leaveRequest, document])=>{
            this.leaveDocument = {
              leaveId: this.leaveRequest.id,
              documentId: document,
            };
            this.employeeLeaveDocumentsService
            .add(this.leaveDocument)
            .subscribe(
              (result: any) => {
                this.notify(leaveRequest);
              },
              (error) => {
                console.error(error);
                this.toastr.showErrorMessage(
                  "Unable to submit Leave Request"
                );
              }
            );
          },
          (error) => {
            console.error(error);
            this.toastr.showErrorMessage("Unable to submit Leave Request");
          }
        )
          
        }
        else{
          forkJoin([
            this.employeeLeaveService.update(this.addForm.value),
            this.documentService.update(this.addForm.value.document),
          ]).subscribe(
            ([leaveRequest, document]) => {
              this.leaveDocument = {
                leaveId: this.leaveRequest.id,
                documentId: document,
              };
              console.log("leaveRequest", leaveRequest);
              console.log("document", document);
  
              this.employeeLeaveDocumentsService
                .update(this.leaveDocument)
                .subscribe(
                  (result: any) => {
                    this.notify(leaveRequest);
                  },
                  (error) => {
                    console.error(error);
                    this.toastr.showErrorMessage(
                      "Unable to submit Leave Request"
                    );
                  }
                );
            },
            (error) => {
              console.error(error);
              this.toastr.showErrorMessage("Unable to submit Leave Request");
            }
          );
        }
   
      }
    }
  }
  draftSave() {
    debugger
    console.log(this.addForm)
    if(this.addForm.invalid){

      return
         
       }
       if(this.addForm.controls.fromDate.value > this.addForm.controls.toDate.value){
        this.validateDate = false;
        return;
      }
    this.addForm.value.document.id=this.fileId
    let addForm = this.addForm.value;
    addForm.leaveStatus=this.requestTypes.Draft
    addForm.numberOfDays = this.numberOfDays;
    addForm = {
      ...addForm,
      currentDate: this.datepipe.transform(Date.now(), "yyyy-MM-dd hh:mm:ss"),
      toDate: new Date(addForm.toDate.setHours(12)),
      fromDate: new Date(addForm.fromDate.setHours(12)),
      rejoinDate: new Date(addForm.rejoinDate.setHours(12)),
      leaveComponentId: parseInt(addForm.leaveComponentId, 10),
    };

    if (this.flag !== 1) {
      // if (this.addForm.get("document.name").value === null) {
        if (this.addForm.value.document.name === null) {
        this.employeeLeaveService.update(addForm).subscribe((result) => {
          this.notify(result);
          this.leaveDocument = {
            leaveId: this.leaveRequest.id,
            documentId: this.attachmentDetails.documentId,
            isArchived:true,
            id:this.attachmentDetails.leaveDocumentId
          };
          this.employeeLeaveDocumentsService
          .update(this.leaveDocument)
          .subscribe(
            (result: any) => {
            },
            (error) => {
              console.error(error);
              this.toastr.showErrorMessage(
                "Unable to submit Leave Request"
              );
            }
          );
        });
      } else {
        if(this.attachmentDetails.documentName==null){
          if(this.addForm.value.document)
          this.addForm.patchValue({
            document:{id:0}
          })
          forkJoin([
          this.employeeLeaveService.update(this.addForm.value),
          this.documentService.add(this.addForm.value.document),
          this.documentUploadService.upload(this.documentSave)
        ]).subscribe(
          ([leaveRequest, document])=>{
            this.leaveDocument = {
              leaveId: this.leaveRequest.id,
              documentId: document,
            };
            this.employeeLeaveDocumentsService
            .add(this.leaveDocument)
            .subscribe(
              (result: any) => {
                this.notify(leaveRequest);
              },
              (error) => {
                console.error(error);
                this.toastr.showErrorMessage(
                  "Unable to submit Leave Request"
                );
              }
            );
          },
          (error) => {
            console.error(error);
            this.toastr.showErrorMessage("Unable to submit Leave Request");
          }
        )
          
        }else{
          forkJoin([
            this.employeeLeaveService.update(this.addForm.value),
            this.documentService.update(this.addForm.value.document),
            
          ]).subscribe(
            ([leaveRequest, document]) => {
              this.leaveDocument = {
                leaveId: this.leaveRequest.id,
                documentId: document,
              };
              console.log("leaveRequest", leaveRequest);
              console.log("document", document);
  
              this.employeeLeaveDocumentsService
                .update(this.leaveDocument)
                .subscribe(
                  (result: any) => {
                    this.notify(leaveRequest);
                  },
                  (error) => {
                    console.error(error);
                    this.toastr.showErrorMessage(
                      "Unable to submit Leave Request"
                    );
                  }
                );
            },
            (error) => {
              console.error(error);
              this.toastr.showErrorMessage("Unable to submit Leave Request");
            }
          );
        }
        
      }
    }
  }

  notify(leaveRequestId): void {
    debugger
    const notifyPersonnelForm = this.selectedItems.map((notifyPerson) => ({
      //leaveId: leaveRequestId,
      leaveId : this.addForm.controls.id.value,
      notifyPersonnel: notifyPerson.id
    }));
    var removedNotifyPersons = this.alreadySelectedItem.filter(o=> !this.selectedItems.some(i=> i.id === o.id));
    var addedNotifyPerson  = this.selectedItems.filter(o=> !this.alreadySelectedItem.some(i=> i.id === o.id));
     const removeNotify  = removedNotifyPersons.map(notifyPerson => ({
       // leaveId: leaveRequestId,
        leaveId : this.addForm.controls.id.value,
         notifyPersonnel: notifyPerson.id,
         isarchived:true,
         id:notifyPerson.id
       }));
       removeNotify.forEach((x)=>{
         var data = this.notifyPersonList.find(o => o.notifyPersonnel == x.id);
         x.id = data.id
       })
       if(removeNotify.length > 0){
         notifyPersonnelForm.push(removeNotify[0])
       }
     const addNotify = addedNotifyPerson.map(notifyPerson => ({
      //leaveId: leaveRequestId,
      leaveId : this.addForm.controls.id.value,
      notifyPersonnel: notifyPerson.id
   }));

   if(addNotify.length > 0){
    this.employeeLeaveService.addNotifyPersonnel(addNotify).subscribe(() => {

     },
     error => {
       this.toastr.showErrorMessage('Unable to add notify person.');
     });
   }

    this.signalrService
      .invokeConnection(leaveRequestId)
      .then(() => console.log("invoked"))
      .catch((err) => console.log("Error while invoking connection: " + err));
    this.employeeLeaveService.updateNotifyPersonnel(notifyPersonnelForm).subscribe(
      () => {
        this.getLeaveBalance();
        this.toastr.showSuccessMessage("Leave Request submitted successfully");
        this.activeModal.close("submit");
      },
      (error) => {
        console.error(error);
        this.toastr.showErrorMessage("Unable to submit Leave Request");
      }
    );
  }

  markDisabled = (date: NgbDateStruct) => {
    const d = new Date(date.year, date.month - 1, date.day);
    let holidays = [];
    if (this.holidaydate?.length) {
      this.holidaydate.map((item) => {
        var myDate = item.split("-");
        var newDate = new Date(
          myDate[0],
          myDate[1] - 1,
          myDate[2].split("T")[0]
        );
        holidays.push(newDate.getTime());
      });
    }

    return holidays.indexOf(d.getTime()) != -1; // return date.month !== current.month;  };
  };

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id:[null],
      leaveComponentId: [
        null,
        [
          // LeaveBalanceValidator(this.leaveBalance, this.numberOfDays),
          Validators.required,
        ],
      ],
      leaveStructureId: [],
      employeeId: ['', [Validators.required]],
      employeeName: [""],
      // approvedBy: [1],
      // approvedDate: [new Date(Date.now())],
      description: ["", [Validators.required, Validators.maxLength(128)]],
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]],
      numberOfDays: [""],
      leaveStatus: [3, [Validators.required]],
      singleDay: [1],
      firstDay: [1],
      lastDay: [2],
      isFullDay: [false],
      isFirstDayFirstHalf: [false],
      isFirstDaySecondHalf: [false],
      isSecondDayFirstHalf: [false],
      isSecondDaySecondHalf: [false],
      rejoinDate: [null, [Validators.required]],
      document: this.formBuilder.group({
        name: [],
        path: [],
        extension: [],
        size: [null],
        id: [null],
      }),
    });
  }
  getEmployeeHoliday() {
    this.holidayService.getAll().subscribe((res) => {
      let holidaydata = res;
      this.holidaydate = [];
      holidaydata.filter((y) => {
        this.holidaydate.push(y.date);
      });
      console.log("leavessting", this.leaveSettings);
    });
  }
  // getAttachmentDetails() {
  //   this.identityDetailsService
  //     .getAllByEmployeeId(
  //       this.identityDetails.employeeId,
  //       this.identityDetails.documentId
  //     )
  //     .subscribe((result) => {
  //       console.log("result", result);

  //       this.identityDetails = result[0];
  //       if (this.identityDetails && this.identityDetails.fileName.length > 40) {
  //         this.fileName = this.identityDetails.fileName.substr(0, 40) + "...";
  //       } else {
  //         this.fileName = this.identityDetails.fileName;
  //       }
  //     });
  // }
  getFileDetailsByIndividual() {
    this.employeeService.getDetailsByFile(this.requestId,this.leaveRequest.id).subscribe(
      (result) => {
        this.fileId=result.documentId
        this.attachmentDetails=result
        this.addForm.value.document.name=result.documentName
        this.addForm.value.document.path=result.documentPath
        this.addForm.value.document.extension=result.extension
       
        if (result && result.documentName.length > 40) {
          this.fileName = result.documentName.substr(0, 40) + "...";
        } else {
          this.fileName = result.documentName;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  selectAvailLeave(args){
    this.addForm.patchValue({
      leaveComponentId:args.value.leaveComponentId,
    })
  }
  refreshAvailLeave(event){
    event.stopPropagation();
    event.preventDefault();
    this.getLeaveBalance();
  }
  getFileDetailsByGroup(){
    this.employeeService.getDetailsByFile(this.leaveRequest.employeeId,this.leaveRequest.id).subscribe(
      (result) => {
        this.fileId=result.documentId
        this.attachmentDetails=result
        this.addForm.value.document.name=result.documentName
        this.addForm.value.document.path=result.documentPath
        this.addForm.value.document.extension=result.extension
        if (result && result.documentName.length > 40) {
          this.fileName = result.documentName.substr(0, 40) + "...";
        } else {
          this.fileName = result.documentName;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  } 
}



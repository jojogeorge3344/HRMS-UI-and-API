import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToasterDisplayService } from "src/app/core/services/toaster-service.service";
import { DomSanitizer } from "@angular/platform-browser";
import { DocumentService } from "@shared/services/document.service";
import { DocumentUploadService } from "@shared/services/document-upload.service";
import { ConfirmModalComponent } from "@shared/dialogs/confirm-modal/confirm-modal.component";

import { forkJoin } from "rxjs";
import { EmployeeEducationalDetails } from "../employee-educational-details.model";
import { EmployeeEducationalDetailsService } from "../employee-educational-details.service";
import { EmployeeEducationalDocumentsCreateComponent } from "../employee-educational-documents-create/employee-educational-documents-create.component";
import { EmployeeEducationalDocumentsEditComponent } from "../employee-educational-documents-edit/employee-educational-documents-edit.component";
import { EmployeeEducationalDocumentsViewComponent } from "../employee-educational-documents-view/employee-educational-documents-view.component";
import { formatDate } from "@angular/common";

@Component({
  selector: "hrms-employee-educational-documents-list",
  templateUrl: "./employee-educational-documents-list.component.html",
})
export class EmployeeEducationalDocumentsListComponent implements OnInit {
  @Input() employeeId: number;
  @Input() isView: boolean;

  educationDetails: EmployeeEducationalDetails[];
  searchEducationDetails: any;
  searchKey: any;

  constructor(
    private employeeEducationalDetailsService: EmployeeEducationalDetailsService,
    private documentService: DocumentService,
    private documentUploadService: DocumentUploadService,
    private sanitizer: DomSanitizer,
    public modalService: NgbModal,
    private toastr: ToasterDisplayService
  ) {}

  ngOnInit(): void {
    this.getEducationalDetails();
  }

  getEducationalDetails() {
    this.educationDetails=[]
    this.employeeEducationalDetailsService
      .getByEmployeeId(this.employeeId)
      .subscribe(
        (result: any) => {
          if (result.length) {
            this.educationDetails = result;
            this.searchEducationDetails=result
          }
        },
        (error) => {
          console.error(error);
          this.toastr.showErrorMessage("Unable to fetch the Education Details");
        }
      );
  }

  getDownloadPath(path) {
    if (path) {
      path = path.replace("c:", "http://127.0.0.1:8887");
      return this.sanitizer.bypassSecurityTrustUrl(path);
    }
  }

  openAdd() {
    const modalRef = this.modalService.open(
      EmployeeEducationalDocumentsCreateComponent,
      { size: "lg", centered: true, backdrop: "static" }
    );

    modalRef.componentInstance.employeeId = this.employeeId;

    modalRef.result.then((result) => {
      if (result == "submit") {
        this.getEducationalDetails();
      }
    });
  }

  openEditEducationalDetails(educationDetails: EmployeeEducationalDetails) {
    const modalRef = this.modalService.open(
      EmployeeEducationalDocumentsEditComponent,
      { size: "lg", centered: true, backdrop: "static" }
    );

    modalRef.componentInstance.educationDetails = educationDetails;

    modalRef.result.then((result) => {
      if (result == "submit") {
        this.getEducationalDetails();
      }
    });
  }

  openViewEducationalDetails(educationDetails: EmployeeEducationalDetails) {
    const modalRef = this.modalService.open(
      EmployeeEducationalDocumentsViewComponent,
      { size: "lg", centered: true, backdrop: "static" }
    );

    modalRef.componentInstance.educationDetails = educationDetails;
  }

  deleteEducationalDetails(educationDetails) {
    const documentPath = new FormData();
    documentPath.append("path", educationDetails.path);

    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static",
    });

    modalRef.componentInstance.confirmationMessage =
      "Are you sure you want to delete this document";

    modalRef.result.then((userResponse) => {
      if (userResponse == true) {
        forkJoin([
          this.employeeEducationalDetailsService.delete(
            educationDetails.educationId
          ),
          this.documentService.delete(educationDetails.documentId),
          this.documentUploadService.delete(documentPath),
        ]).subscribe(
          () => {
            this.toastr.showSuccessMessage("Document deleted successfully!");
            this.getEducationalDetails();
          },
          (error) => {
            console.error(error);
            this.toastr.showErrorMessage(
              "There is an error in deleting document"
            );
          }
        );
      }
    });
  }
  searchEducationalDocuments(): void {
    this.educationDetails = this.searchEducationDetails.filter(
      (x) =>
        x.degree?.toLowerCase().includes(this.searchKey.toLowerCase()) ||
        x.specialization?.toLowerCase().includes(this.searchKey.toLowerCase()) ||
        (formatDate(x.yearOfJoining, 'dd-MM-yyyy', 'en-Us')).includes(this.searchKey) ||
        (formatDate(x.yearOfCompletion, 'dd-MM-yyyy', 'en-Us')).includes(this.searchKey) ||
        x.percentage.toString().includes(this.searchKey)||
        x.university?.toLowerCase().includes(this.searchKey.toLowerCase())
    );
  }
}

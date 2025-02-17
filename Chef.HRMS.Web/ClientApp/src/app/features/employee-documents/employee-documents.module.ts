import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgBootstrapFormValidationModule,
  CUSTOM_ERROR_MESSAGES,
} from "ng-bootstrap-form-validation";
import { CUSTOM_ERRORS } from "@shared/utils/validators.messages";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { DirectivesModule } from "src/app/directives/directives.module";

import { EmployeeDrivingLicenseCreateComponent } from "./employee-driving-license/employee-driving-license-create/employee-driving-license-create.component";
import { EmployeeDrivingLicenseEditComponent } from "./employee-driving-license/employee-driving-license-edit/employee-driving-license-edit.component";
import { EmployeeDrivingLicenseActionsComponent } from "./employee-driving-license/employee-driving-license-actions/employee-driving-license-actions.component";
import { EmployeeDrivingLicenseViewComponent } from "./employee-driving-license/employee-driving-license-view/employee-driving-license-view.component";

import { EmployeePANCardCreateComponent } from "./employee-pan-card/employee-pan-card-create/employee-pan-card-create.component";
import { EmployeePANCardEditComponent } from "./employee-pan-card/employee-pan-card-edit/employee-pan-card-edit.component";
import { EmployeePANCardActionsComponent } from "./employee-pan-card/employee-pan-card-actions/employee-pan-card-actions.component";
import { EmployeePANCardViewComponent } from "./employee-pan-card/employee-pan-card-view/employee-pan-card-view.component";

import { EmployeePassportCreateComponent } from "./employee-passport/employee-passport-create/employee-passport-create.component";
import { EmployeePassportEditComponent } from "./employee-passport/employee-passport-edit/employee-passport-edit.component";
import { EmployeePassportActionsComponent } from "./employee-passport/employee-passport-actions/employee-passport-actions.component";
import { EmployeePassportViewComponent } from "./employee-passport/employee-passport-view/employee-passport-view.component";

import { EmployeeUIDCreateComponent } from "./employee-uid/employee-uid-create/employee-uid-create.component";
import { EmployeeUIDEditComponent } from "./employee-uid/employee-uid-edit/employee-uid-edit.component";
import { EmployeeUIDActionsComponent } from "./employee-uid/employee-uid-actions/employee-uid-actions.component";
import { EmployeeUIDViewComponent } from "./employee-uid/employee-uid-view/employee-uid-view.component";

import { EmployeeBankDetailsCreateComponent } from "./employee-bank-details/employee-bank-details-create/employee-bank-details-create.component";
import { EmployeeBankDetailsEditComponent } from "./employee-bank-details/employee-bank-details-edit/employee-bank-details-edit.component";
import { EmployeeBankDetailsActionsComponent } from "./employee-bank-details/employee-bank-details-actions/employee-bank-details-actions.component";
import { EmployeeBankDetailsViewComponent } from "./employee-bank-details/employee-bank-details-view/employee-bank-details-view.component";
import { EmployeeIdentityDetailsService } from "@shared/employee-document-section/employee-identity-documents/employee-identity-details.service";
import { EmployeeIdentityDocumentsService } from "@shared/employee-document-section/employee-identity-documents/employee-identity-documents.service";
import { EmployeeDocumentsComponent } from "./employee-documents/employee-documents.component";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  declarations: [
    EmployeeDocumentsComponent,
    EmployeeDrivingLicenseCreateComponent,
    EmployeeDrivingLicenseEditComponent,
    EmployeeDrivingLicenseActionsComponent,
    EmployeeDrivingLicenseViewComponent,
    EmployeePANCardCreateComponent,
    EmployeePANCardEditComponent,
    EmployeePANCardActionsComponent,
    EmployeePANCardViewComponent,
    EmployeePassportCreateComponent,
    EmployeePassportEditComponent,
    EmployeePassportActionsComponent,
    EmployeePassportViewComponent,
    EmployeeUIDCreateComponent,
    EmployeeUIDEditComponent,
    EmployeeUIDActionsComponent,
    EmployeeUIDViewComponent,
    EmployeeBankDetailsCreateComponent,
    EmployeeBankDetailsEditComponent,
    EmployeeBankDetailsActionsComponent,
    EmployeeBankDetailsViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: EmployeeDocumentsComponent,
        data: { breadcrumbs: ["Me", "Documents"], name: "me-mydocuments" },
      },
    ]),
    NgbModule,
    NgbNavModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    BsDropdownModule.forRoot(),
    DirectivesModule,
    SharedModule,
  ],

  providers: [
    {
      provide: CUSTOM_ERROR_MESSAGES,
      useValue: CUSTOM_ERRORS,
      multi: true,
    },
    EmployeeIdentityDetailsService,
    EmployeeIdentityDocumentsService,
    DatePipe,
    NgbNavModule,
  ],
})
export class EmployeeDocumentsModule {}

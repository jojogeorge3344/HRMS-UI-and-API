import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./shared/layout/main/main.component";
import { LayoutModule } from "./shared/layout/layout.module";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AuthGuard } from "./services/auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      { path: "", redirectTo: "my-profile", pathMatch: "full" },
      {
        path: "auth",
        loadChildren: () =>
          import("./features/auth/auth.module").then((m) => m.AuthModule),
      },
      {
        path: "home",
        loadChildren: () =>
          import("./features/home/home.module").then((m) => m.HomeModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: "my-profile",
        loadChildren: () =>
          import("./features/employee-profile/employee-profile.module").then(
            (m) => m.EmployeeProfileModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "my-documents",
        loadChildren: () =>
          import(
            "./features/employee-documents/employee-documents.module"
          ).then((m) => m.EmployeeDocumentsModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: "leave",
        loadChildren: () =>
          import("./features/employee-leave/employee-leave.module").then(
            (m) => m.EmployeeLeaveModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "attendance",
        loadChildren: () =>
          import(
            "./features/employee-attendance/employee-attendance.module"
          ).then((m) => m.EmployeeAttendanceModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: "my-expenses",
        loadChildren: () =>
          import("./features/employee-expense/employee-expense.module").then(
            (m) => m.EmployeeExpenseModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "my-overtime",
        loadChildren: () =>
          import("./features/employee-overtime/employee-overtime.module").then(
            (m) => m.EmployeeOvertimeModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "my-loan",
        loadChildren: () =>
          import("./features/employee-loan/employee-loan.module").then(
            (m) => m.EmployeeLoanModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "my-assets",
        loadChildren: () =>
          import("./features/employee-assets/employee-asset.module").then(
            (m) => m.EmployeeAssetModule
          ),
        // canActivateChild: [AuthGuard]
      },
      {
        path: "team-attendance",
        loadChildren: () =>
          import("./features/team-attendance/team-attendance.module").then(
            (m) => m.TeamAttendanceModule
          ),
        canActivateChild: [AuthGuard],
        data: { name: "team" },
      },
      {
        path: "settings/company",
        loadChildren: () =>
          import("./features/settings/company/company.module").then(
            (m) => m.CompanyModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "settings/branches",
        loadChildren: () =>
          import("./features/settings/branch/branch.module").then(
            (m) => m.BranchModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "settings/employee",
        loadChildren: () =>
          import("./features/settings/employee/employee-settings.module").then(
            (m) => m.EmployeeSettingsModule
          ),
        canActivateChild: [AuthGuard],
        data: { name: "settings-employee" },
      },
      {
        path: "settings/holiday",
        loadChildren: () =>
          import("./features/settings/holiday/holiday-settings.module").then(
            (m) => m.HolidaySettingsModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "settings/leave",
        loadChildren: () =>
          import("./features/settings/leave/leave-settings.module").then(
            (m) => m.LeaveSettingsModule
          ),
        canActivateChild: [AuthGuard],
        data: { name: "settings-leave" },
      },
      {
        path: "settings/attendance",
        loadChildren: () =>
          import(
            "./features/settings/attendance/attendance-settings.module"
          ).then((m) => m.AttendanceSettingsModule),
        canActivateChild: [AuthGuard],
        data: { name: "settings-attendance" },
      },
      {
        path: "settings/expense",
        loadChildren: () =>
          import("./features/settings/expense/expense-settings.module").then(
            (m) => m.ExpenseSettingsModule
          ),
        canActivateChild: [AuthGuard],
        data: { name: "settings-expense" },
      },
      {
        path: "settings/overtime",
        loadChildren: () =>
          import("./features/settings/overtime/overtime-settings.module").then(
            (m) => m.OvertimeSettingsModule
          ),
        canActivateChild: [AuthGuard],
        data: { name: "settings-overtime" },
      },
      {
        path: "settings/loan",
        loadChildren: () =>
          import("./features/settings/loan/loan-settings.module").then(
            (m) => m.LoanSettingsModule
          ),
        canActivateChild: [AuthGuard],
        data: { name: "settings-loan" },
      },
      {
        path: "settings/payroll",
        loadChildren: () =>
          import("./features/settings/payroll/payroll-settings.module").then(
            (m) => m.PayrollSettingsModule
          ),
        canActivateChild: [AuthGuard],
        data: { name: "settings-overtime" },
      },
      {
        path: "settings/wps",
        loadChildren: () =>
          import("./features/settings/wps/wps.module").then((m) => m.WpsModule),
        canActivateChild: [AuthGuard],
        data: { name: "settings-expense" },
      },
      {
        path: "settings/asset",
        loadChildren: () =>
          import("./features/settings/asset/asset.module").then(
            (m) => m.AssetModule
          ),
        // canActivateChild: [AuthGuard],
        data: { name: "settings-expense" },
      },
      {
        path: "settings/religion",
        loadChildren: () =>
          import("./features/settings/religion/religion.module").then(
            (m) => m.ReligionModule
          ),
        //canActivateChild: [AuthGuard],
        data: { name: "settings-expense" },
      },
      {
        path: "settings/document-type",
        loadChildren: () =>
          import("./features/settings/document-type/document-type.module").then(
            (m) => m.DocumentTypeModule
          ),
        //canActivateChild: [AuthGuard],
        data: { name: "settings-expense" },
      },
      {
        path: "settings/bank",
        loadChildren: () =>
          import("./features/settings/bank/bank-employee.module").then(
            (m) => m.BankModule
          ),
        // canActivateChild: [AuthGuard],
        data: { name: "settings-expense" },
      },
      {
        path: "settings/eos",
        loadChildren: () =>
          import("./features/settings/eos/eos-common.module").then(
            (m) => m.EosCommonModule
          ),
        // canActivateChild: [AuthGuard],
        data: { name: "settings-expense" },
      },
      {
        path: "settings/roles",
        loadChildren: () =>
          import("./features/settings/roles/roles.module").then(
            (m) => m.RolesModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "employee",
        loadChildren: () =>
          import("./features/employee/employee.module").then(
            (m) => m.EmployeeModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "employee-leave",
        loadChildren: () =>
          import("./features/employee-leave/employee-leave.module").then(
            (m) => m.EmployeeLeaveModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "org-employee-loan",
        loadChildren: () =>
          import("./features/employee-loan/employee-loan.module").then(
            (m) => m.EmployeeLoanModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "payroll-processing",
        loadChildren: () =>
          import("./features/payroll-process/payroll-process.module").then(
            (m) => m.PayrollProcessModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "asset-employee-wise",
        loadChildren: () =>
          import("./features/employee-asset/employee-asset.module").then(
            (m) => m.EmployeeAssetModule
          ),
        //canActivateChild: [AuthGuard]
      },
      {
        path: "asset-employee-leave",
        loadChildren: () =>
          import("./features/employee-leave/employee-leave.module").then(
            (m) => m.EmployeeLeaveModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "asset-employee-overtimewise",
        loadChildren: () =>
          import("./features/employee-overtime/employee-overtime.module").then(
            (m) => m.EmployeeOvertimeModule
          ),
        canActivateChild: [AuthGuard],
          },
      // {
      //   path: 'asset-employee-overtimewise',
      //   loadChildren: () => import('./features/employee-overtime/employee-overtime.module').then(m => m.EmployeeOvertimeModule),
      // },
      {
        path: 'employee-revision-management',
        loadChildren: () => import('./features/employee-revision-management/employee-revision-management.module').then(m => m.EmployeeRevisionManagementModule),
        canActivateChild: [AuthGuard]
      },
      {
        path: 'org-employee-encashment',
        loadChildren: () => import('./features/employee-encashment/employee-encashment-module').then(m => m.EmployeeEncashmentModule),
        canActivateChild: [AuthGuard]
      },
      {
        path: 'employee-payroll-parameter-details',
        loadChildren: () => import('./features/employee-payroll-parameter-details/payroll-parameter-details.module').then(m => m.PayrollParameterDetailsModule),
      },
      {
        path: 'adoc-earnings-and-deduction',
        loadChildren: () => import('./features/ADOC-Entry/adoc-entry.module').then(m => m.AdocEntryModule),
      },
      {
        path: "finance",
        loadChildren: () =>
          import("./features/finance/finance.module").then(
            (m) => m.FinanceModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./features/reports/reports.module").then(
            (m) => m.ReportsModule
          ),
        canActivateChild: [AuthGuard],
      },
      {
        path: "notifications",
        loadChildren: () =>
          import("./features/notifications/notifications.module").then(
            (m) => m.NotificationsModule
          ),
        canActivateChild: [AuthGuard],
        // data: { name: 'team-approvals' }
      },
      {
        path: 'generate-accruals',
        loadChildren: () => import('./features/generate-accruals/generate-accruals.module').then(m => m.GenerateAccrualsModule),
        canActivateChild: [AuthGuard]
      },
      {
        path: 'payslip-components',
        loadChildren: () => import('./features/payslip-components-mapping/payslip-components.module').then(m => m.PayslipComponentsModule),
      },
     
    ],
  },
];

@NgModule({
  imports: [
    LayoutModule,
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

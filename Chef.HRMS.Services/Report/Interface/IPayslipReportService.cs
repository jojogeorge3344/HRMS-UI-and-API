﻿using Chef.Common.Models;
using Chef.HRMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chef.HRMS.Services.Report
{
    public interface IPayslipReportService : IAsyncService<PayrollComponentDetails>
    {
        Task<IEnumerable<PayrollHeaderView>> EmployeeHeaderDetails(int employeeId,DateTime fromDate,DateTime ToDate);
        Task<IEnumerable<PayrollComponentReportView>> EmployeeComponentDetails(int employeeId, DateTime fromDate, DateTime ToDate);
        Task<IEnumerable<OvertimeDetailReportView>> EmployeeOverTimeDetails(int employeeId, DateTime fromDate, DateTime ToDate);
        Task<IEnumerable<LoanDetailsReportView>> EmployeeLoanDetails(int employeeId, DateTime fromDate, DateTime ToDate);


    }
}

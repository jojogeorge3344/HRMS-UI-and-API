﻿using Chef.HRMS.Models;

namespace Chef.HRMS.Services;

public interface ILoanPaymentService : IAsyncService<LoanPayment>
{
    Task<IEnumerable<EmployeeLoanView>> GetAllLoanPaymentByPayrollProcessingMethodId(int payGroupId, int year, string month);
    Task<IEnumerable<EmployeeLoanView>> GetAllLoanPaymentByEmployeeId(int employeeId, int payrollProcessingMethodId);
    Task<int> InsertAsync(IEnumerable<LoanPayment> loanPayment);
}

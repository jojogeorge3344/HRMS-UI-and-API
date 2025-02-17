﻿namespace Chef.HRMS.Repositories;

public interface ILoanSettingRepository : IGenericRepository<LoanSetting>
{
    Task<int> GetLoanSettingId();
    Task<LoanSetting> GetTopOneLoanSetting();
    Task<IEnumerable<LoanAdvanceRepaymentView>> GetLoanRepayment();
    Task<IEnumerable<LoanAdvanceRepaymentView>> GetLoanAdvance();

}
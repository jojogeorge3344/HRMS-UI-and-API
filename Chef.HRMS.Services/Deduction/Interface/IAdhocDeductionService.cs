﻿using Chef.Common.Services;
using Chef.HRMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chef.HRMS.Services
{
    public interface IAdhocDeductionService : IAsyncService<AdhocDeduction>
    {
        Task<IEnumerable<AdhocDeductionView>> GetAllAdhocDeductionByPayrollProcessingMethodId(int payrollProcessingMethodId, int year, int month);
        Task<IEnumerable<AdhocDeductionView>> GetEmployeeAdhocDeductionByPayrollProcessingMethodId(int payrollProcessingMethodId);
        Task<IEnumerable<BenefitTypes>> GetBenefitTypes();

    }
}

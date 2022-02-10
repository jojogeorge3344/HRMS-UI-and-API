﻿using Chef.Common.Repositories;
using Chef.HRMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chef.HRMS.Repositories
{
    public interface IOnDutyRepository : IGenericRepository<OnDuty>
    {
        Task<int> InsertNotifyPersonnel(IEnumerable<OnDutyNotifyPersonnel> onDutyNotifyPersonnel);
        Task<IEnumerable<OnDuty>> GetTotalRequestedDaysById(int employeeId);
        Task<IEnumerable<JobDetails>> GetJoinDateByEmployeeId(int employeeId);
    }
}

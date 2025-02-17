﻿

namespace Chef.HRMS.Repositories;

public interface IEmployeeRevisionDetailsOldRepository : IGenericRepository<EmployeeRevisionDetailsOld>
{
    Task<int> InsertAsync(IEnumerable<EmployeeRevisionDetailsOld> employeeRevisionDetailsOld);
    Task<IEnumerable<EmployeeRevisionDetailsOld>> GetOldEmployeeRevisionSalaryDetail(int employeeRevisionId);
    Task<int> UpdateAsync(IEnumerable<EmployeeRevisionDetailsOld> employeeRevisionDetailsOld);

}
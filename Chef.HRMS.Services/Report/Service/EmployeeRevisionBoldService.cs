﻿using Chef.Common.Services;
using Chef.HRMS.Models;
using Chef.HRMS.Repositories.Report;

namespace Chef.HRMS.Services.Report;

public class EmployeeRevisionBoldService : BaseService, IEmployeeRevisionBoldService
{
    private readonly IEmployeeRevisionBoldReportRepository employeeRevisionBoldReportRepository;
    public EmployeeRevisionBoldService(IEmployeeRevisionBoldReportRepository employeeRevisionBoldReportRepository)
    {
        this.employeeRevisionBoldReportRepository = employeeRevisionBoldReportRepository;
    }

    public async Task<EmployeeRevisionOldDetailsBoldDto> GetemployeeOldDetailsAsync(int id)
    {
        var oldEmployeeDetails = await employeeRevisionBoldReportRepository.GetemployeeOldDetailsAsync(id);

        return oldEmployeeDetails;
    }
    public async Task<EmployeeRevisionNewDetailsBoldDto> GetemployeeNewDetailsAsync(int id)
    {
        var newEmployeeDetails = await employeeRevisionBoldReportRepository.GetemployeeNewDetailsAsync(id);

        return newEmployeeDetails;
    }
    public async Task<IEnumerable<EmployeeSalarayDto>> GetSalaryOldDetailsAsync(int id)
    {
        var oldSalaryDetails = await employeeRevisionBoldReportRepository.GetSalaryOldDetailsAsync(id);
        return oldSalaryDetails;
    }
    public async Task<IEnumerable<EmployeeSalarayDto>> GetSalaryNewDetailsAsync(int id)
    {
        var newSalaryDetails = await employeeRevisionBoldReportRepository.GetSalaryNewDetailsAsync(id);
        return newSalaryDetails;
    }

}

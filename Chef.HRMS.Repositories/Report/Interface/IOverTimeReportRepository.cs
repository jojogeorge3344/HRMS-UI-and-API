﻿using Chef.HRMS.Models.Report;

namespace Chef.HRMS.Repositories.Report.Interface;

public interface IOverTimeReportRepository : IGenericRepository<OverTimeSummaryReportView>
{
    Task<IEnumerable<OverTimeSummaryReportView>> GetOverTimeSummaryReportDetails(string reportType, DateTime fromDate, DateTime toDate, string paygroupIds, string designationIds, string locationIds, string departmentIds, string employeeCategory, string OverTimePolicyIds, string employeeIds);
    Task<IEnumerable<OverTimeDetailedReportView>> GetOverTimeDetailedReportDetails(string reportType, DateTime fromDate, DateTime toDate, string paygroupIds, string designationIds, string locationIds, string departmentIds, string employeeCategory, string OverTimePolicyIds, string employeeIds);
    Task<IEnumerable<OverTimeReportHeader>> GetOverTimeSummaryReportHeaderDetails(string reportType, DateTime fromDate, DateTime toDate, string paygroupIds, string designationIds, string locationIds, string departmentIds, string employeeCategoryIds, string overTimePolicyIds, string employeeIds);
}

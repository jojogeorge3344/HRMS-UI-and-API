﻿using Chef.Common.Core;
using Chef.Common.Core.Extensions;
using Chef.Common.Types;
using System;

namespace Chef.HRMS.Models.Report;

public class OverTimeSummaryReportView : Model
{
    public int EmployeeId { get; set; }
    public string EmployeeCode { get; set; }
    public string EmployeeFullName { get; set; }
    public string OverTimePolicyName { get; set; }
    public string PaygroupName { get; set; }
    public string DesignationName { get; set; }
    public string LocationName { get; set; }
    public DepartmentType Department { get; set; }
    public string DepartmentName => EnumExtension.GetDescription(Department);
    public string CategoryName { get; set; }
    public string ReportType { get; set; }
    public DateTime ToDate { get; set; }
    public DateTime FromDate { get; set; }
    public int NormalOverTime { get; set; }
    public int HolidayOverTime { get; set; }
    public int SpecialOverTime { get; set; }

}

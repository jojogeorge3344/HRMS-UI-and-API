﻿using Chef.Common.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chef.HRMS.Models.Report
{
    public class PayrollStructureReportView : Model
    {
        public string EmployeeCode { get; set; }
        public string EmployeeFullName { get; set; }
        public string SalaryStructureName { get; set; }
        public string PaygroupName { get; set; }
        public string DesignationName { get; set; }
        public DateTime PayrollProcessDate { get; set; }
        public int PayrollComponentId { get; set; }
        public string PayrollComponentName { get; set; }
        public decimal EarningsAmt { get; set; }
        public decimal DeductionAmt { get; set; }
    }
}

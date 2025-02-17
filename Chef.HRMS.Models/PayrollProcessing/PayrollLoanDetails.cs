﻿using Chef.Common.Core;
using System;
using System.ComponentModel;


namespace Chef.HRMS.Models;

public class PayrollLoanDetails : Model
{
    public int PayrollProcessId { get; set; }
    public DateTime PayrollProcessDate { get; set; }
    public int EmployeeId { get; set; }
    public int LoanDetailsId { get; set; }
    public decimal LoanAmount { get; set; }
    public int ProcessStatus { get; set; }
    [SqlKata.Ignore]
    [Write(false)]
    [ReadOnly(true)]
    public int ComponentId { get; set; }
}

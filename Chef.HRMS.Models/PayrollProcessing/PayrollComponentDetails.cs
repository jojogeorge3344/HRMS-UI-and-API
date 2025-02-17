﻿using Chef.Common.Core;
using System;

namespace Chef.HRMS.Models;

public class PayrollComponentDetails : Model
{
    public int PayrollProcessId { get; set; }
    public DateTime PayrollProcessDate { get; set; }
    public int EmployeeId { get; set; }
    [Write(false)]
    [Skip(true)]
    [SqlKata.Ignore]
    public string EmployeeName { get; set; }

    [Write(false)]
    [Skip(true)]
    [SqlKata.Ignore]
    public string EmployeeCode { get; set; }
    public int PayrollComponentId { get; set; }
    [Write(false)]
    [Skip(true)]
    [SqlKata.Ignore]
    public string PayrollComponentName { get; set; }
    public decimal EarningsAmt { get; set; }
    public decimal DeductionAmt { get; set; }
    public int ProcessStatus { get; set; }
    public int DrAccount { get; set; }
    public int CrAccount { get; set; }
    public string DocNum { get; set; }
    public int StepNo { get; set; }
    public int FinalSettlementId { get; set; }
    public int EmployeeEncashmentId { get; set; }
}

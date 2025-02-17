﻿using Chef.Common.Core;
using Chef.HRMS.Types;
using System;
using System.Collections.Generic;

namespace Chef.HRMS.Models;

public class FinalSettlement : Model
{
    public int EmployeeId { get; set; }
    public string RequestNum { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime ProcessDate { get; set; }
    public DateTime SalaryCutOfDate { get; set; }
    public decimal AnnualLeaveBalance { get; set; }
    public decimal ApprovedAnnualLeave { get; set; }
    public decimal EOSBalanceDays { get; set; }
    public decimal ApprovedEOSDays { get; set; }
    public decimal AccruedTicketAmt { get; set; }
    public decimal ApprovedTicketAmt { get; set; }
    public RequestStatusType ProcessStatus { get; set; }
    public decimal NetAmount { get; set; }

    [Write(false)]
    [Skip(true)]
    [SqlKata.Ignore]
    public string EmployeeName { get; set; }

    [Write(false)]
    [Skip(true)]
    [SqlKata.Ignore]
    public List<FinalSettlementDetails> SettlementDetails { get; set; }
}

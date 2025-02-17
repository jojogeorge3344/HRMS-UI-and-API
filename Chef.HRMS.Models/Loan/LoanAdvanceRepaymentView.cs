﻿using Chef.Common.Core;

namespace Chef.HRMS.Models;

public class LoanAdvanceRepaymentView : ViewModel
{
    public string PayrollComponentCode { get; set; }
    public string PayrollComponentName { get; set; }
    public int PayrollComponentType { get; set; }
    public string BenefitTypeCode { get; set; }
    public string BenefitTypeName { get; set; }
    public int PayrollComponentId { get; set; }
}

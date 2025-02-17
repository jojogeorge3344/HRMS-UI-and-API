﻿using Chef.Common.Core;

namespace Chef.HRMS.Models.PayrollProcessing;

public class EOSAccrualfinDetails : ViewModel
{
    public int Id { get; set; }
    public int EosAccrualDetailsId { get; set; }
    public decimal EosAccrualAmount { get; set; }
    public int DrAccount { get; set; }
    public int CrAccount { get; set; }
    public string Docnum { get; set; }
}

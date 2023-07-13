﻿using Chef.Common.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chef.HRMS.Models
{
    public class EmployeeEncashmentDetails : Model
    {
        public int EmployeeEncashmentId { get; set; }
        public int PayrollComponentId { get; set; }
        public decimal PaidDays { get; set; }
        public decimal ComponentAmt { get; set; }

        [Write(false)]
        [Skip(true)]
        [SqlKata.Ignore]
        public string PayrollComponentCode { get; set; }

        [Write(false)]
        [Skip(true)]
        [SqlKata.Ignore]
        public string PayrollComponentName { get; set; }
    }
}

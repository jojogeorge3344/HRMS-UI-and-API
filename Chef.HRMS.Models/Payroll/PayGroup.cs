﻿using Chef.Common.Core;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Chef.HRMS.Models;

public class PayGroup : Model
{
    /// <summary>
    /// Holds pay group name
    /// </summary>
    [Required]
    [StringLength(50)]
    public string Name { get; set; }

    /// <summary>
    /// Holds pay group code
    /// </summary>
    [Required]
    [StringLength(10)]
    public string Code { get; set; }

    /// <summary>
    /// Holds foreign key from payroll calendar
    /// </summary>
    [Required]
    [ForeignKey("PayrollCalendar")]
    public int PayrollCalendarId { get; set; }

    /// <summary>
    /// Holds starting year
    /// </summary>
    [Required]
    public int StartingYear { get; set; }

    /// <summary>
    /// Holds starting month
    /// </summary>
    public int StartingMonth { get; set; }

    /// <summary>
    /// Holds starting week
    /// </summary>
    public int StartingWeek { get; set; }

    public string TimeSheetCutOff { get; set; }
    public string LeaveCutOff { get; set; }

    //[Write(false)]
    //[Skip(true)]
    //[SqlKata.Ignore]
    public int CurrencyId { get; set; }

}

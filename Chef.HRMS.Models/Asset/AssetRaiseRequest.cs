﻿using Chef.Common.Core;
using Chef.HRMS.Types;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Chef.HRMS.Models;

[Table("assetraiserequest")]
public class AssetRaiseRequest : Model
{


    public string RequestNo { get; set; }

    [Required]
    public DateTime RequestedDate { get; set; }
    [Required]
    public RequestFor RequestFor { get; set; }

    [Required]
    public RequestType RequestType { get; set; }

    [Required]
    [ForeignKey("AssetType")]
    public int AssetTypeId { get; set; }

    [Required]
    public AssetStatus Status { get; set; }

    [ForeignKey("Employee")]
    public int NameOfTeamMemberId { get; set; }

    public string NameOfTeamMember { get; set; }

    [Required]
    public string Description { get; set; }

    [ForeignKey("Employee")]
    public int EmpId { get; set; }

    public string RequestedBy { get; set; }
    public string AssetTypeName { get; set; }

    public int AssetId { get; set; }


}

﻿using Chef.HRMS.Models;
using Chef.HRMS.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace Chef.HRMS.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetEmployeeWiseController : ControllerBase
    {
        private readonly IAssetEmployeeWiseService assetEmployeeWiseService;

        public AssetEmployeeWiseController(IAssetEmployeeWiseService assetEmployeeWiseService)
        {
            this.assetEmployeeWiseService = assetEmployeeWiseService;
        }

        [HttpGet("GetAllList")]
        public async Task<ActionResult> GetAllAssetTypeList()
        {
            var result = await assetEmployeeWiseService.GetAllList();

            return Ok(result);
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetAll();

            return Ok(assetEmployeeWises);
        }


        [HttpGet("GetEmployeeDetailsById/{employeeid}")]
        public async Task<ActionResult> GetEmployeeDetailsById(int employeeid)
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetEmployeeDetailsById(employeeid);

            return Ok(assetEmployeeWises);
        }

        [HttpGet("GetEmployeeRequestById/{empid}")]
        public async Task<ActionResult> GetEmployeeRequestById(int empid)
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetEmployeeRequestById(empid);

            return Ok(assetEmployeeWises);
        }

        [HttpGet("GetAllocatedAssetById/{empid}")]
        public async Task<ActionResult> GetAllocatedAssetById(int empid)
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetAllocatedAssetById(empid);

            return Ok(assetEmployeeWises);
        }

        //[HttpGet("GetAllocatedById/{empid}")]
        //public async Task<ActionResult<IEnumerable<AssetAllocated>>> GetAllocatedById(int empid)
        //{
        //    var assetEmployeeWises = await assetEmployeeWiseService.GetAllocatedById(empid);

        //    return Ok(assetEmployeeWises);
        //}


        [HttpPut("UpdateStatus/{id}/{status}")]
        public async Task<ActionResult> UpdateStatus(int id, int status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await assetEmployeeWiseService.UpdateStatus(id, status);

            return Ok(result);
        }


        [HttpPut("UpdateApproveReject/{id}/{status}")]
        public async Task<ActionResult> UpdateApproveReject(int id, int status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await assetEmployeeWiseService.UpdateApproveReject(id, status);

            return Ok(result);
        }

    }
}

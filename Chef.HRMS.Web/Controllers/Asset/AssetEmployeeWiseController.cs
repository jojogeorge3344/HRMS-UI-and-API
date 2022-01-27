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

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetAll();

            return Ok(assetEmployeeWises);
        }

        [HttpGet("GetAllCount")]
        public async Task<ActionResult<IEnumerable<AssetCountViewModel>>> GetAllCount()
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetAllCount();

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


        [HttpGet("GetRequestById/{id}")]
        public async Task<ActionResult> GetRequestById(int id)
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetRequestById(id);

            return Ok(assetEmployeeWises);
        }

        [HttpGet("GetEmployeeNameById/{id}")]
        public async Task<ActionResult> GetEmployeeNameById(int id)
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetEmployeeNameById(id);

            return Ok(assetEmployeeWises);
        }

        [HttpGet("GetAllocatedAssetById/{empid}")]
        public async Task<ActionResult> GetAllocatedAssetById(int empid)
        {
            var assetEmployeeWises = await assetEmployeeWiseService.GetAllocatedAssetById(empid);

            return Ok(assetEmployeeWises);
        }

        //[HttpGet("GetChangeSwapDetails/{assetid}")]
        //public async Task<ActionResult> GetChangeSwapDetails(int assetid)
        //{
        //    var assetEmployeeWises = await assetEmployeeWiseService.GetChangeSwapDetails(assetid);

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


        [HttpPut("UpdateApproveReject")]
        public async Task<ActionResult> UpdateApproveReject(int id, int status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await assetEmployeeWiseService.UpdateApproveReject(id, status);

            return Ok(result);
        }

        [HttpPut("UpdateStatusRecalled")]
        public async Task<ActionResult> UpdateStatusRecalled(int empid, int assetid, int status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await assetEmployeeWiseService.UpdateStatusRecalled(empid, assetid, status);

            return Ok(result);
        }


    }
}

﻿using Chef.HRMS.Models;
using Chef.HRMS.Repositories;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.IO;

namespace Chef.HRMS.Services;

public class OverTimeService : AsyncService<OverTime>, IOverTimeService
{
    private readonly IOverTimeRepository overTimeRepository;

    public OverTimeService(IOverTimeRepository overTimeRepository)
    {
        this.overTimeRepository = overTimeRepository;
    }

    public async Task<IEnumerable<OverTime>> GetAllOvertimeDetailsById(int employeeId)
    {
        return await overTimeRepository.GetAllOvertimeDetailsById(employeeId);
    }

    public async Task<int> InsertNotifyPersonnel(IEnumerable<OverTimeNotifyPersonnel> overTimeNotifyPersonnel)
    {
        return await overTimeRepository.InsertNotifyPersonnel(overTimeNotifyPersonnel);
    }

    public async Task<int> GetAssignedOverTimePolicy(int employeeId)
    {
        return await overTimeRepository.GetAssignedOverTimePolicy(employeeId);
    }

    public async Task<IEnumerable<OvertimeViewModel>> GetOvertimeNotifyPersonnelByOvertimeId(int overtimeId)
    {
        return await overTimeRepository.GetOvertimeNotifyPersonnelByOvertimeId(overtimeId);
    }

    public async Task<IEnumerable<CalenderView>> GetCalenderDetails(int employeeId)
    {
        return await overTimeRepository.GetCalenderDetails(employeeId);
    }

    public async Task<int> UpdateNotifyPersonnel(IEnumerable<OverTimeNotifyPersonnel> overTimeNotifyPersonnel)
    {
        return await overTimeRepository.UpdateNotifyPersonnel(overTimeNotifyPersonnel);
    }

    public async Task<IEnumerable<OverTimePayrollViewModel>> GetOvertimeByPaygroupId(int paygroupId, string fromDate, string toDate)
    {
        return await overTimeRepository.GetOvertimeByPaygroupId(paygroupId, fromDate, toDate);
    }

    public async Task<byte[]> OverTimeExcelTemplate()
    {
        // create a new Excel package       
        using var excelPackage = new ExcelPackage();

        // add a new worksheet to the workbook
        var worksheet = excelPackage.Workbook.Worksheets.Add("Sheet1");
        worksheet.Protection.IsProtected = false;
        worksheet.Protection.AllowAutoFilter = true;

        // define the column headers
        worksheet.Cells[1, 1].Value = "Employee Code";
        worksheet.Cells[1, 2].Value = "Employee Name";
        worksheet.Cells[1, 3].Value = "From Date";
        worksheet.Cells[1, 4].Value = "To Date";
        worksheet.Cells[1, 5].Value = "Normal OverTime";
        worksheet.Cells[1, 6].Value = "Holiday OverTime";
        worksheet.Cells[1, 7].Value = "Special OverTime";
        worksheet.Cells[1, 8].Value = "Reason";

        // Set column data types
        worksheet.Cells[1, 1, worksheet.Dimension.End.Row, 1].Style.Numberformat.Format = "@"; // Emp Code column 
        worksheet.Cells[1, 2, worksheet.Dimension.End.Row, 2].Style.Numberformat.Format = "@"; // Emp Name column
        worksheet.Cells[1, 3, worksheet.Dimension.End.Row, 3].Style.Numberformat.Format = "yyyy-mm-dd"; // From Date column
        worksheet.Cells[1, 4, worksheet.Dimension.End.Row, 4].Style.Numberformat.Format = "yyyy-mm-dd"; // To Date column
        worksheet.Cells[1, 5, worksheet.Dimension.End.Row, 5].Style.Numberformat.Format = "@"; // Normal OverTime Hours column
        worksheet.Cells[1, 6, worksheet.Dimension.End.Row, 6].Style.Numberformat.Format = "@"; // Holiday OverTime Hours column
        worksheet.Cells[1, 7, worksheet.Dimension.End.Row, 7].Style.Numberformat.Format = "@"; // Special OverTime Hours column
        worksheet.Cells[1, 8, worksheet.Dimension.End.Row, 8].Style.Numberformat.Format = "@"; // Reason column 

        // format the column headers
        worksheet.Cells[1, 1, 1, 8].Style.Font.Bold = true;
        worksheet.Cells[1, 1, 1, 8].AutoFilter = true;
        worksheet.Cells[1, 1, 1, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[1, 1, 1, 8].AutoFitColumns();

        //Set column width
        worksheet.Column(1).Width = 25;
        worksheet.Column(2).Width = 25;
        worksheet.Column(3).Width = 25;
        worksheet.Column(4).Width = 25;
        worksheet.Column(5).Width = 25;
        worksheet.Column(6).Width = 25;
        worksheet.Column(7).Width = 25;
        worksheet.Column(8).Width = 25;

        // save the Excel package to a file stream
        using var stream = new MemoryStream();
        excelPackage.SaveAs(stream);

        return await Task.FromResult(stream.ToArray());
    }

    public async Task<int> OverTimeBulkInsert(IEnumerable<OverTime> overTimes)
    {
        return await overTimeRepository.OverTimeBulkInsert(overTimes);
    }

    public async Task<IEnumerable<OverTimeDetailsView>> GetOverTimeValidation(IEnumerable<OverTimeDetailsView> overTimeDetailsViews)
    {
        if (overTimeDetailsViews != null)
        {
            List<string> errorMessage = new List<string>();
            foreach (OverTimeDetailsView detailsView in overTimeDetailsViews)
            {
                detailsView.IsValid = true;
                var overTimeView = await overTimeRepository.GetOvertimeByEmployeeCode(detailsView.EmployeeNumber);
                detailsView.EmployeeId = overTimeView.EmployeeId;

                if (detailsView.EmployeeNumber != null)
                {
                    bool isEmployeeNumberExist = await overTimeRepository.GetOverTimeDetails(detailsView.EmployeeNumber);
                    if (!isEmployeeNumberExist)
                    {
                        errorMessage.Add("Employee Code Not Valid");
                        detailsView.IsValid = false;
                    }
                }

                if (detailsView.FromDate != null)
                {

                    bool isOverTimeDateExist = await overTimeRepository.GetOverTimeDateDetails(detailsView.FromDate, detailsView.EmployeeId);
                    if (isOverTimeDateExist)
                    {
                        errorMessage.Add("Already Applied In This Date");
                        detailsView.IsValid = false;
                    }
                }

                var days = detailsView.ToDate - detailsView.FromDate;
                int intDays = days.Days;
                int MaxHrs = intDays * 24;

                if (detailsView.NormalOverTime > MaxHrs)
                {
                    errorMessage.Add("Per day NormalOverTime 24hrs limit exceed");
                    detailsView.IsValid = false;
                }

                if (detailsView.HolidayOverTime > MaxHrs)
                {
                    errorMessage.Add("Per day HolidayOverTime 24hrs limit exceed");
                    detailsView.IsValid = false;
                }

                if (detailsView.SpecialOverTime > MaxHrs)
                {
                    errorMessage.Add("Per day SpecialOverTime 24hrs limit exceed");
                    detailsView.IsValid = false;
                }

                detailsView.ErrorMessage = string.Join(",", errorMessage.ToArray());
            }
        }
        else
        {
            throw new Exception("Empty Data source");
        }
        return overTimeDetailsViews;
    }
}

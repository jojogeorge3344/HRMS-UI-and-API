﻿using Chef.Common.Core.Extensions;
using Chef.Common.Repositories;
using Chef.HRMS.Models;
using Dapper;
using Humanizer;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks; 

namespace Chef.HRMS.Repositories
{
    public class EmployeeRevisionDetailsRepository : GenericRepository<EmployeeRevisionDetails>, IEmployeeRevisionDetailsRepository
    {
        public EmployeeRevisionDetailsRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
        {
        }

        public async Task<IEnumerable<EmployeeRevisionDetails>> GetEmployeeRevisionSalaryDetail(int employeeRevisionId)
        {
            var sql = @"SELECT erd.*,pc.name FROM hrms.employeerevisiondetails erd
                        INNER JOIN hrms.payrollcomponent pc
                        ON erd.payrollcomponentid = pc.id
                        WHERE employeerevisionid = employeeRevisionId
                        AND erd.isarchived = false";

            return await Connection.QueryAsync<EmployeeRevisionDetails>(sql, new { employeeRevisionId });
        }

        public async Task<IEnumerable<EmployeeRevisionSalaryView>> GetEmployeeRevisionSalaryDetails(int payrollStructureId,int employee)
        {
            var sql = @"SELECT DISTINCT pcc.payrollcomponentid ,pcc.shortcode,pcc.name,pc.formula,escd.monthlyamount,pc.id AS payrollcalculationid
                        FROM hrms.payrollcomponentconfiguration pcc
                        INNER JOIN hrms.payrollcalculation pc
                        ON pcc.payrollstructureid = pc.payrollstructureid
                        AND pcc.payrollcomponentid = pc.payrollcomponentid
                        INNER JOIN hrms.employeesalaryconfigurationdetails escd
                        ON escd.payrollstructureid = pcc.payrollstructureid
                        AND escd.payrollcomponentid = pcc.payrollcomponentid
                        WHERE pcc.payrollstructureid = @payrollStructureId
                        AND escd.employeeid = @employee
                        AND escd.isarchived = false
                        ORDER BY pcc.shortcode ASC";

            return await Connection.QueryAsync<EmployeeRevisionSalaryView>(sql, new { payrollStructureId, employee });
        }
    }
}
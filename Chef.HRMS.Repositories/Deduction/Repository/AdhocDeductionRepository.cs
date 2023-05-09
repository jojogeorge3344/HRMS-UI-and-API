﻿using Chef.Common.Repositories;
using Chef.HRMS.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chef.HRMS.Repositories
{
    public class AdhocDeductionRepository : GenericRepository<AdhocDeduction>, IAdhocDeductionRepository
    {
        public AdhocDeductionRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
        {
        }

        public async Task<IEnumerable<AdhocDeductionView>> GetAllAdhocDeductionByPayrollProcessingMethodId(int payGroupId, DateTime fromDate,DateTime toDate)
        {

                var sql = @"SELECT DISTINCT ad.id                                    AS deductionId, 
                                            ad.employeeid                            AS employeeId, 
                                            ( Concat(e.firstname, ' ', e.lastname) ) AS name, 
                                            ad.employeecode                          AS employeeCode, 
                                            ad.deductionname                         AS deductionName, 
                                            ad.description                           AS description, 
                                            jf.paygroupid                            AS paygroupId, 
                                            ad.payrollprocessingmethodid             AS 
                                            payrollProcessingMethodId, 
                                            ad.amount                                AS amount, 
                                            ad.currency                              AS currency, 
                                            ad.createddate                           AS createddate, 
                                            ad.modifieddate                          AS modifieddate, 
                                            ad.createdby                             AS createdby, 
                                            ad.modifiedby                            AS modifiedby,
                                            ad.isaddition
                            FROM   hrms.adhocdeduction ad 
                                   INNER JOIN hrms.HRMSEmployee e 
                                           ON ad.employeeid = e.id 
                                   INNER JOIN hrms.jobfiling jf 
                                           ON ad.employeeid = jf.employeeid 
                            --WHERE  (ad.payrollprocessingmethodid = @payrollProcessingMethodId 
                                          -- AND e.id NOT IN(Select ppm.employeeid from hrms.payrollprocessingmethod ppm
                                            --WHERE  (ppm.month =@month AND  ppm.year=@year)))
                                   WHERE  To_Date(cast(coalesce(ad.date) as TEXT),'YYYY MM DD') BETWEEN @fromDate AND @toDate
							AND jf.paygroupid = @payGroupId
                                  ";

                return await Connection.QueryAsync<AdhocDeductionView>(sql, new { payGroupId, fromDate, toDate });

        }
        public async Task<IEnumerable<AdhocDeductionView>> GetEmployeeAdhocDeductionByPayrollProcessingMethodId(int payrollProcessingMethodId)
        {

                var sql = @"SELECT DISTINCT ad.id                                    AS deductionId, 
                                            ad.employeeid                            AS employeeId, 
                                            ( Concat(e.firstname, ' ', e.lastname) ) AS name, 
                                            ad.employeecode                          AS employeeCode, 
                                            ad.deductionname                         AS deductionName, 
                                            ad.description                           AS description, 
                                            jf.paygroupid                            AS paygroupId, 
                                            ad.payrollprocessingmethodid             AS 
                                            payrollProcessingMethodId, 
                                            ad.amount                                AS amount, 
                                            ad.currency                              AS currency, 
                                            ad.createddate                           AS createddate, 
                                            ad.modifieddate                          AS modifieddate, 
                                            ad.createdby                             AS createdby, 
                                            ad.modifiedby                            AS modifiedby 
                            FROM   hrms.adhocdeduction ad 
                                   INNER JOIN hrms.HRMSEmployee e 
                                           ON ad.employeeid = e.id 
                                   INNER JOIN hrms.jobfiling jf 
                                           ON ad.employeeid = jf.employeeid 
                            WHERE  ad.payrollprocessingmethodid = @payrollProcessingMethodId";

                return await Connection.QueryAsync<AdhocDeductionView>(sql, new { payrollProcessingMethodId });
        }

        public async Task<IEnumerable<BenefitTypes>> GetBenefitTypes()
        {
            var sql = @"SELECT * FROM hrms.benefittypes
                        WHERE isarchived=false AND id IN (17,25)";

            return await Connection.QueryAsync<BenefitTypes>(sql);
        }
    }
}

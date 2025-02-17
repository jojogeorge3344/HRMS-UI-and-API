﻿using Chef.HRMS.Models.PayrollProcessing;


namespace Chef.HRMS.Repositories.PayrollProcessing.Repository;

public class EOSAccrualSummaryRepository : TenantRepository<EOSAccrualSummary>, IEOSAccrualSummaryRepository
{
    public EOSAccrualSummaryRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
    {
    }

    public async Task<EOSAccrualSummary> GetPreviousEOSAccrualSummary(int employeeId)
    {
        var sql = @"select * from hrms.eosaccrualsummary 
                        where employeeid = @employeeId 
                        order by id desc
                        limit 1";

        return await Connection.QueryFirstOrDefaultAsync<EOSAccrualSummary>(sql, new { employeeId });
    }

}

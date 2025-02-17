﻿namespace Chef.HRMS.Repositories;

public class ExpensePolicyRepository : GenericRepository<ExpensePolicy>, IExpensePolicyRepository
{
    public ExpensePolicyRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
    {
    }

    public async Task<IEnumerable<int>> GetAllAssignedExpensePolicy()
    {

        var sql = @"SELECT DISTINCT expensepolicyid 
                                    FROM hrms.jobfiling
                                    ORDER  BY expensepolicyid ASC";

        return await Connection.QueryAsync<int>(sql);

    }

    public async Task<IEnumerable<ExpensePolicy>> GetAllConfiguredExpensePolicies()
    {

        var sql = @"SELECT * 
                                    FROM hrms.expensepolicy
                                    WHERE isconfigured=true";

        return await Connection.QueryAsync<ExpensePolicy>(sql);

    }

    public async Task<bool> UpdateExpensePolicy(int id, bool isConfigured)
    {

        var sql = @"UPDATE hrms.expensepolicy
                                   SET isconfigured=@isConfigured
                                    WHERE id=@id";

        var result = await Connection.ExecuteAsync(sql, new { id, isConfigured });
        if (result == 1)
        {
            return true;

        }
        else
        {
            return false;
        }
    }
}

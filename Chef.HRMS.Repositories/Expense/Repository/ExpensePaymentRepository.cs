﻿namespace Chef.HRMS.Repositories;

public class ExpensePaymentRepository : GenericRepository<ExpensePayment>, IExpensePaymentRepository
{
    public ExpensePaymentRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
    {
    }

    public async Task<IEnumerable<ExpensePayment>> GetAllApprovedExpense()
    {

        var sql = @"SELECT e.*,epc.name as expensetypename,epc.expensetypeid as expensetypeid,
                                  e.id as expenserequestid 
                                      FROM  hrms.expense e 
                                      INNER JOIN hrms.expensepolicyconfiguration epc
                                      ON e.expenseconfigurationid=epc.id
                                      WHERE e.requeststatus=3 and e.ispaid=false";

        return await Connection.QueryAsync<ExpensePayment>(sql);

    }

    public async Task<IEnumerable<ExpensePayment>> GetAllPaidOutExpense()
    {

        var sql = @"SELECT e.*,et.name as expensetypename
                                      FROM  hrms.expensepayment e 
                                      INNER JOIN hrms.expensetype et
                                      ON e.expensetypeid=et.id
                                      WHERE e.ispaid=true order by e.id desc";

        return await Connection.QueryAsync<ExpensePayment>(sql);

    }

    public async Task<int> UpdateExpenseStatus(int expenseRequestId, int paymentMode)
    {

        var sql = @"UPDATE hrms.expense
	                                      SET  ispaid=true, paymentmode=@paymentMode
	                                      WHERE id=@expenseRequestId";

        return await Connection.ExecuteAsync(sql, new { expenseRequestId, paymentMode });

    }
}

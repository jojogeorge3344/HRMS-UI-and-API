﻿using Chef.HRMS.Models;
using Chef.HRMS.Models.BenefitCategory;

namespace Chef.HRMS.Services;

public interface ILeaveComponentService : IAsyncService<LeaveComponent>
{
    Task<IEnumerable<int>> GetAllAssignedLeaveComponents();
    Task<IEnumerable<LeaveComponent>> GetAllByLeaveStructure(int leaveStructureId);
    Task<IEnumerable<BenefitCategory>> GetBenefitCategory();
    Task<IEnumerable<BenefitTypes>> GetAccrualBenefitType();
    Task<IEnumerable<BenefitTypes>> GetAccrualType();
    Task<IEnumerable<BenefitTypes>> GetDeductionType();
    new Task<int> DeleteAsync(int id);
    Task<IEnumerable<BenefitTypes>> GetBenefitType(int categoryid);
}
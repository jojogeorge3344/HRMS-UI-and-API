﻿using Chef.HRMS.Models;
using Chef.HRMS.Repositories;

namespace Chef.HRMS.Services;

public class OverTimePolicyConfigurationService : AsyncService<OverTimePolicyConfiguration>, IOverTimePolicyConfigurationService
{
    private readonly IOverTimePolicyConfigurationRepository overTimePolicyConfigurationRepository;

    public OverTimePolicyConfigurationService(IOverTimePolicyConfigurationRepository overTimePolicyConfigurationRepository)
    {
        this.overTimePolicyConfigurationRepository = overTimePolicyConfigurationRepository;
    }

    public async Task<IEnumerable<int>> GetAllAssignedOverTimePolicies()
    {
        return await overTimePolicyConfigurationRepository.GetAllAssignedOverTimePolicies();
    }

    public async Task<OverTimePolicyConfiguration> GetByOverTimePolicyId(int overTimePolicyId)
    {
        return await overTimePolicyConfigurationRepository.GetByOverTimePolicyId(overTimePolicyId);
    }

    public async Task<IEnumerable<BenefitTypes>> GetHolidayOverTime()
    {
        return await overTimePolicyConfigurationRepository.GetHolidayOverTime();
    }

    public async Task<IEnumerable<BenefitTypes>> GetNormalOverTime()
    {
        return await overTimePolicyConfigurationRepository.GetNormalOverTime();
    }

    public async Task<OverTimePolicyConfiguration> GetOvertimeConfigurationById(int employeeId)
    {
        return await overTimePolicyConfigurationRepository.GetOvertimeConfigurationById(employeeId);
    }

    public async Task<IEnumerable<BenefitTypes>> GetSpecialOvertime()
    {
        return await overTimePolicyConfigurationRepository.GetSpecialOvertime();
    }
}

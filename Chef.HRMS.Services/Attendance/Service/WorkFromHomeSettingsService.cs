﻿using Chef.HRMS.Models;
using Chef.HRMS.Repositories;

namespace Chef.HRMS.Services;

public class WorkFromHomeSettingsService : IWorkFromHomeSettingsService
{
    private readonly IWorkFromHomeSettingsRepository workFromHomeAdminSettingsRepository;

    public WorkFromHomeSettingsService(IWorkFromHomeSettingsRepository workFromHomeAdminSettingsRepository)
    {
        this.workFromHomeAdminSettingsRepository = workFromHomeAdminSettingsRepository;
    }

    public async Task<int> DeleteAsync(int id)
    {
        return await workFromHomeAdminSettingsRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<WorkFromHomeSettings>> GetAllAsync()
    {
        return await workFromHomeAdminSettingsRepository.GetAllAsync();
    }

    public async Task<WorkFromHomeSettings> GetAsync(int id)
    {
        return await workFromHomeAdminSettingsRepository.GetAsync(id);
    }

    public async Task<WorkFromHomeSettings> GetTopOneWorkFromHomeSettings()
    {
        return await workFromHomeAdminSettingsRepository.GetTopOneWorkFromHomeSettings();
    }

    public async Task<int> InsertAsync(WorkFromHomeSettings workFromHomeAdminSettings)
    {
        return await workFromHomeAdminSettingsRepository.InsertAsync(workFromHomeAdminSettings);
    }

    public async Task<int> UpdateAsync(WorkFromHomeSettings workFromHomeAdminSettings)
    {
        return await workFromHomeAdminSettingsRepository.UpdateAsync(workFromHomeAdminSettings);
    }
}

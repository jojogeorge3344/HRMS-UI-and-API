﻿using Chef.Common.Repositories;
using Chef.Common.Services;
using Chef.HRMS.Models;
using Chef.HRMS.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chef.HRMS.Services
{
    public class AssetEmployeeWiseService : AsyncService, IAssetEmployeeWiseService
    {
        private readonly IAssetEmployeeWiseRepository assetEmployeeWiseRepository;
        private readonly ISimpleUnitOfWork simpleUnitOfWork;

        public AssetEmployeeWiseService(IAssetEmployeeWiseRepository assetEmployeeWiseRepository, ISimpleUnitOfWork simpleUnitOfWork)
        {
            this.assetEmployeeWiseRepository = assetEmployeeWiseRepository;
            this.simpleUnitOfWork = simpleUnitOfWork;
        }


        public async Task<IEnumerable<AssetEmployeeWise>> GetAll()
        {
            return await assetEmployeeWiseRepository.GetAll();
        }


        public async Task<IEnumerable<AssetCountViewModel>> GetAllCount()
        {
            return await assetEmployeeWiseRepository.GetAllCount();
        }


        public async Task<IEnumerable<AssetAllocated>> GetAllocatedAssetById(int empid)
        {
            return await assetEmployeeWiseRepository.GetAllocatedAssetById(empid);
        }


        public async Task<IEnumerable<AssetEmployeeWise>> GetEmployeeDetailsById(int employeeid)
        {
            return await assetEmployeeWiseRepository.GetEmployeeDetailsById(employeeid);
        }


        public async Task<IEnumerable<AssetRaiseRequest>> GetEmployeeRequestById(int empid)
        {
            return await assetEmployeeWiseRepository.GetEmployeeRequestById(empid);
        }


        public async Task<IEnumerable<AssetRaiseRequest>> GetRequestById(int id)
        {
            return await assetEmployeeWiseRepository.GetRequestById(id);
        }


        public async Task<IEnumerable<Employee>> GetEmployeeNameById(int id)
        {
            return await assetEmployeeWiseRepository.GetEmployeeNameById(id);
        }      


        public async Task<IEnumerable<Asset>> GetAssetDetailsById(int assettypeid)
        {
            return await assetEmployeeWiseRepository.GetAssetDetailsById(assettypeid);
        }


        public async Task<IEnumerable<AssetMetadataValue>> GetMetadatavaluesById(int assetid)
        {
            return await assetEmployeeWiseRepository.GetMetadatavaluesById(assetid);
        }
       

        public async Task<IEnumerable<AssetAllocationViewModel>> GetAllocationDetails(int id)
        {
            return await assetEmployeeWiseRepository.GetAllocationDetails(id);
        }


        public async Task<IEnumerable<AssetAllocationViewModel>> GetMetadataDetailsById(int assettypeid)
        {
            return await assetEmployeeWiseRepository.GetMetadataDetailsById(assettypeid);
        }

        public async Task<int> InsertAsync(AssetAllocated assetAllocated)
        {
            return await assetEmployeeWiseRepository.InsertAsync(assetAllocated);
        }


        public async Task<int> UpdateApproveReject(int id, int status)
        {
            return await assetEmployeeWiseRepository.UpdateApproveReject(id, status);
            
        }


        public async Task<int> UpdateStatus(int id, int status)
        {
            return await assetEmployeeWiseRepository.UpdateStatus(id, status);
        }


        public async Task<int> UpdateStatusRecalled(int empid, int assetid, int status)
        {
            return await assetEmployeeWiseRepository.UpdateStatusRecalled(empid, assetid, status);
        }


        public Task<int> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AssetEmployeeWise>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public Task<AssetEmployeeWise> GetAsync(int id)
        {
            throw new NotImplementedException();
        }


        public Task<AssetEmployeeWise> InsertAsync(AssetEmployeeWise obj)
        {
            throw new NotImplementedException();
        }

       
        public Task<int> UpdateAsync(AssetEmployeeWise obj)
        {
            throw new NotImplementedException();
        }

        
    }
}

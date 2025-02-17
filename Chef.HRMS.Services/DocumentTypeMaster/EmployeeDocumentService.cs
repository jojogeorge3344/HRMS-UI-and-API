﻿using Chef.HRMS.Models;
using Chef.HRMS.Repositories;
using System.IO;

namespace Chef.HRMS.Services;

public class EmployeeDocumentService : AsyncService<EmployeeDocument>, IEmployeeDocumentService
{
    private readonly IEmployeeDocumentRepository employeeDocumentRepository;

    public EmployeeDocumentService(IEmployeeDocumentRepository employeeDocumentRepository)
    {
        this.employeeDocumentRepository = employeeDocumentRepository;
    }

    public async Task<IEnumerable<EmployeeDocument>> GetEmployeeId(int id)
    {
        return await employeeDocumentRepository.GetEmployeeId(id);
    }
    public async Task<IEnumerable<EmployeeDocumentAttachment>> GetAllByEmployeeId(int employeeId, int documentid)
    {
        return await employeeDocumentRepository.GetAllByEmployeeId(employeeId, documentid);
    }

    public async Task<bool> IsDocumentCodeExist(string documentnumber)
    {
        return await employeeDocumentRepository.IsDocumentCodeExist(documentnumber);
    }

    public async Task<byte[]> GetPDFViewer(string filePath)
    {
        return File.ReadAllBytes(filePath);
    }

    public async Task<IEnumerable<DocumentDetail>> GetAllActiveDocumentsTypes()
    {
        return await employeeDocumentRepository.GetAllActiveDocumentsTypes();
    }
}

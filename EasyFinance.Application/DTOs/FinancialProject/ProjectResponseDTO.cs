﻿using System;
using EasyFinance.Domain.FinancialProject;

namespace EasyFinance.Application.DTOs.FinancialProject
{
    public class ProjectResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PreferredCurrency { get; set; } = string.Empty;
        public ProjectTypes Type { get; set; } = ProjectTypes.Personal;
    }
}

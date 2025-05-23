﻿using System.Linq;
using EasyFinance.Domain;
using EasyFinance.Infrastructure.DTOs;

namespace EasyFinance.Application.Contracts.Persistence
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        IQueryable<T> Trackable();
        IQueryable<T> NoTrackable();
        T Insert(T entity);
        AppResponse<T> InsertOrUpdate(T entity);
        T Delete(T entity);
    }
}

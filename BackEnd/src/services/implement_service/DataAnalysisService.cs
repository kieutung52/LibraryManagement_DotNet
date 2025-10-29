using LibraryMangement.Data;
using LibraryMangement.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryMangement.Service;

public class DataAnalysisService
{
    private readonly LibraryContext _context;

    public DataAnalysisService(LibraryContext context)
    {
        _context = context;
    }

    public async Task<DataAnalyticsDaily> GetTodayAnalyticsAsync()
    {
        var today = DateTime.UtcNow.Date;
        
        var analytics = await _context.DataAnalyticsDaily
            .FirstOrDefaultAsync(d => d.ReportDate.Date == today);

        if (analytics == null)
        {
            analytics = await GenerateDailyAnalyticsAsync(today);
        }

        return analytics;
    }

    private async Task<DataAnalyticsDaily> GenerateDailyAnalyticsAsync(DateTime date)
    {
        var countBorrowings = await _context.Borrowings
            .CountAsync(b => b.BorrowDate.Date == date);

        var countUsersViolations = await _context.Users
            .CountAsync(u => u.CountViolations > 0);

        var countBorrowingsToExpire = await _context.BorrowingDetails
            .CountAsync(bd => bd.DueDate.Date == date.AddDays(1) && bd.Status == EnumData.BorrowingDetailStatus.BORROWING);

        var countBorrowingsRequestPending = await _context.Borrowings
            .CountAsync(b => b.Status == EnumData.BorrowingStatus.PENDING);

        var analytics = new DataAnalyticsDaily
        {
            ReportDate = date,
            CountBorrowings = countBorrowings,
            CountUsersViolations = countUsersViolations,
            CountBorrowingsToExpire = countBorrowingsToExpire,
            CountBorrowingsRequestPending = countBorrowingsRequestPending,
            CountUsersVisited = 0, // Would need tracking implementation
            CountUserBack = 0 // Would need tracking implementation
        };

        _context.DataAnalyticsDaily.Add(analytics);
        await _context.SaveChangesAsync();

        return analytics;
    }

    public async Task<object> GetBorrowingStatsAsync(DateTime startDate, DateTime endDate)
    {
        var stats = await _context.Borrowings
            .Where(b => b.BorrowDate >= startDate && b.BorrowDate <= endDate)
            .GroupBy(b => b.BorrowDate.Date)
            .Select(g => new
            {
                Date = g.Key,
                Count = g.Count(),
                Approved = g.Count(b => b.Status == EnumData.BorrowingStatus.APPROVED),
                Pending = g.Count(b => b.Status == EnumData.BorrowingStatus.PENDING)
            })
            .ToListAsync();

        return stats;
    }
}
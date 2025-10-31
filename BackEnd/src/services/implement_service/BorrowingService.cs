using AutoMapper;
using LibraryMangement.Data;
using LibraryMangement.EnumData;
using LibraryMangement.Models;
using LibraryMangement.Request;
using LibraryMangement.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;

namespace LibraryMangement.Service;

public class BorrowingService : IBorrowingService
{
    private readonly LibraryContext _context;
    private readonly IMapper _mapper;

    public BorrowingService(LibraryContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BorrowingResponse> CreateBorrowingRequestAsync(CreateBorrowingRequest request)
    {
        // Check if account exists
        User? account = await _context.Users.FindAsync(request.AccountID);
        if (account == null)
            throw new Exception("Tài khoản không tồn tại.");
        if (account.CountBorrow >= account.LimitBorrow)
            throw new Exception("Tài khoản đã đạt giới hạn mượn! Vui lòng hoàn thành các giao dịch mượn trước khi tiếp tục");
        if (account.Status is AccountStatus.BANNED)
            throw new Exception("Tài khoản hiện tại đang bị khóa! vui lòng liên hệ thủ thư ở quầy  lễ tân để biết thêm thông tin."); 
        // Check if user has pending borrowings
        var hasPendingBorrowings = await _context.Borrowings
            .AnyAsync(b => b.AccountID == request.AccountID && b.Status == BorrowingStatus.PENDING);
        
        if (hasPendingBorrowings)
            throw new Exception("Bạn đang có yêu cầu mượn sách đang chờ xử lý.");

        var borrowing = new Borrowing
        {
            AccountID = request.AccountID,
            BorrowDate = DateTime.UtcNow,
            Status = BorrowingStatus.PENDING
        };

        // Calculate due date (14 days from now)
        var dueDate = DateTime.UtcNow.AddDays(14);

        foreach (var bookRequest in request.Books)
        {
            var book = await _context.Books.FindAsync(bookRequest.BookID);
            if (book == null)
                throw new Exception($"Sách với ID {bookRequest.BookID} không tồn tại.");

            if (book.AvailableQuantity < bookRequest.Quantity)
                throw new Exception($"Sách '{book.Title}' không đủ số lượng. Số lượng có sẵn: {book.AvailableQuantity}.");

            var borrowingDetail = new BorrowingDetail
            {
                BookID = bookRequest.BookID,
                QuantityBook = bookRequest.Quantity,
                DueDate = dueDate,
                Status = BorrowingDetailStatus.PENDING
            };

            borrowing.Details.Add(borrowingDetail);
        }

        _context.Borrowings.Add(borrowing);
        await _context.SaveChangesAsync();

        account.CountBorrow++;

        await _context.SaveChangesAsync();

        // Load related data for response
        await _context.Entry(borrowing)
            .Reference(b => b.Account)
            .LoadAsync();
        await _context.Entry(borrowing)
            .Collection(b => b.Details)
            .Query()
            .Include(d => d.Book)
            .LoadAsync();

        return _mapper.Map<BorrowingResponse>(borrowing);
    }

    public async Task<BooleanResponse> CancelBorrowingRequestAsync(int borrowingId, Guid accountId)
    {
        var borrowing = await _context.Borrowings
            .Include(b => b.Details)
            .FirstOrDefaultAsync(b => b.BorrowingID == borrowingId && b.AccountID == accountId);

        if (borrowing == null || borrowing.Status != BorrowingStatus.PENDING)
            return new BooleanResponse(false);

        borrowing.Status = BorrowingStatus.REJECTED;
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }

    public async Task<BooleanResponse> ApproveBorrowingRequestAsync(int borrowingId, Guid staffId)
    {
        var borrowing = await _context.Borrowings
            .Include(b => b.Details)
            .ThenInclude(d => d.Book)
            .FirstOrDefaultAsync(b => b.BorrowingID == borrowingId);

        if (borrowing == null || borrowing.Status != BorrowingStatus.PENDING)
            return new BooleanResponse(false);

        // Check if books are still available
        foreach (var detail in borrowing.Details)
        {
            if (detail.Book.AvailableQuantity < detail.QuantityBook)
                return new BooleanResponse(false);
        }

        // Update book quantities and status
        foreach (var detail in borrowing.Details)
        {
            detail.Book.AvailableQuantity -= detail.QuantityBook;
            detail.Status = BorrowingDetailStatus.BORROWING;
        }

        borrowing.Status = BorrowingStatus.APPROVED;
        // borrowing.StaffID = staffId;

        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }

    public async Task<BooleanResponse> RejectBorrowingRequestAsync(int borrowingId, Guid staffId)
    {
        var borrowing = await _context.Borrowings.FindAsync(borrowingId);
        if (borrowing == null || borrowing.Status != BorrowingStatus.PENDING)
            return new BooleanResponse(false);

        borrowing.Status = BorrowingStatus.REJECTED;
        // borrowing.StaffID = staffId;

        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }

    public async Task<BooleanResponse> RenewBorrowingDetailAsync(RenewBorrowingRequest request, Guid accountId)
    {
        User? account = await _context.Users.FindAsync(accountId);
        if (account == null)
            throw new Exception("Tai khoan khong ton tai");
        if (account.CountRenew >= account.LimitRenew)
            throw new Exception("Tai khoan khong con luot gia han! Vui long de y han va tra sach dung han.");
        var borrowingDetail = await _context.BorrowingDetails
            .Include(d => d.Borrowing)
            .FirstOrDefaultAsync(d => d.BorrowingDetailID == request.BorrowingDetailID && 
                                     d.Borrowing.AccountID == accountId);

        if (borrowingDetail == null || borrowingDetail.Status != BorrowingDetailStatus.BORROWING)
            return new BooleanResponse(false);

        // Check if renewal is allowed (only once and before due date)
        if (DateTime.UtcNow > borrowingDetail.DueDate.AddDays(-2))
            return new BooleanResponse(false);

        // Extend due date by 7 days
        borrowingDetail.DueDate = borrowingDetail.DueDate.AddDays(7);
        account.CountRenew++;

        await _context.SaveChangesAsync();

        return new BooleanResponse(true);
    }

    public async Task<BooleanResponse> ReturnBookAsync(int borrowingDetailId, string ISBN)
    {
        var borrowingDetail = await _context.BorrowingDetails
            .Include(d => d.Book)
            .Include(d => d.Borrowing)
            .FirstOrDefaultAsync(d => d.BorrowingDetailID == borrowingDetailId);

        if (borrowingDetail == null || borrowingDetail.Status != BorrowingDetailStatus.BORROWING || borrowingDetail.Book.ISBN != ISBN)
            return new BooleanResponse(false);

        borrowingDetail.Status = BorrowingDetailStatus.RETURNED;
        borrowingDetail.ReturnDate = DateTime.UtcNow;
        borrowingDetail.Book.AvailableQuantity += borrowingDetail.QuantityBook;

        // Update borrowing status if all books are returned
        var borrowing = borrowingDetail.Borrowing;
        var remainingBooks = await _context.BorrowingDetails
            .CountAsync(d => d.BorrowingID == borrowing.BorrowingID && 
                           d.Status == BorrowingDetailStatus.BORROWING);

        if (remainingBooks == 0)
        {
            borrowing.Status = BorrowingStatus.COMPLETED;
        }

        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }

    public async Task<IEnumerable<BorrowingResponse>> GetBorrowingsByAccountAsync(Guid accountId)
    {
        var borrowings = await _context.Borrowings
            .Include(b => b.Details)
            .ThenInclude(d => d.Book)
            .Where(b => b.AccountID == accountId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return _mapper.Map<IEnumerable<BorrowingResponse>>(borrowings);
    }

    public async Task<IEnumerable<BorrowingResponse>> GetAllBorrowingsAsync()
    {
        var borrowings = await _context.Borrowings
            .Include(b => b.Account)
            .Include(b => b.Details)
            .ThenInclude(d => d.Book)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return _mapper.Map<IEnumerable<BorrowingResponse>>(borrowings);
    }

    public async Task<BorrowingResponse> GetBorrowingByIdAsync(int borrowingId)
    {
        var borrowing = await _context.Borrowings
            .Include(b => b.Account)
            .Include(b => b.Details)
            .ThenInclude(d => d.Book)
            .FirstOrDefaultAsync(b => b.BorrowingID == borrowingId);

        return _mapper.Map<BorrowingResponse>(borrowing);
    }
}
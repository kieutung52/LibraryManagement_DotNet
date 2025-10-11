using LibraryMangement.Request;
using LibraryMangement.Response;

namespace LibraryMangement.Service;

public interface IBorrowingService
{
    Task<BorrowingResponse> CreateBorrowingRequestAsync(CreateBorrowingRequest request);
    Task<BooleanResponse> CancelBorrowingRequestAsync(int borrowingId, Guid accountId);
    Task<BooleanResponse> ApproveBorrowingRequestAsync(int borrowingId, Guid staffId);
    Task<BooleanResponse> RejectBorrowingRequestAsync(int borrowingId, Guid staffId);
    Task<BooleanResponse> RenewBorrowingDetailAsync(RenewBorrowingRequest request, Guid accountId);
    Task<BooleanResponse> ReturnBookAsync(int borrowingDetailId, Guid staffId);
    Task<IEnumerable<BorrowingResponse>> GetBorrowingsByAccountAsync(Guid accountId);
    Task<IEnumerable<BorrowingResponse>> GetAllBorrowingsAsync();
    Task<BorrowingResponse> GetBorrowingByIdAsync(int borrowingId);
}
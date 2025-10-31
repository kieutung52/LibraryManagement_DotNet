using AutoMapper;
using LibraryMangement.Models;
using LibraryMangement.Request;
using LibraryMangement.Response;

namespace LibraryMangement.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User Mappings
        CreateMap<RegisterRequest, User>();
        CreateMap<RegisterRequest, Admin>();
        CreateMap<CreateUserRequest, User>();

        CreateMap<UpdateUserRequest, Account>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<UpdateUserRequest, User>()
            .IncludeBase<UpdateUserRequest, Account>()
            .ForMember(dest => dest.LimitBorrow, opt => opt.MapFrom(src => src.UserData!.LimitBorrow))
            .ForMember(dest => dest.LimitRenew, opt => opt.MapFrom(src => src.UserData!.LimitRenew))
            .ForMember(dest => dest.CountViolations, opt => opt.MapFrom(src => src.UserData!.CountViolations))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        
        CreateMap<UpdateUserRequest, Admin>()
            .IncludeBase<UpdateUserRequest, Account>();

        CreateMap<Admin, AdminData>();
        CreateMap<User, UserData>();
        CreateMap<Account, UserResponse>()
            .Include<Admin, UserResponse>()
            .Include<User, UserResponse>();
        CreateMap<Admin, UserResponse>()
            .ForMember(dest => dest.AdminData, opt => opt.MapFrom(src => src));
        CreateMap<User, UserResponse>()
            .ForMember(dest => dest.UserData, opt => opt.MapFrom(src => src));
        
        // Book Mappings
        CreateMap<CreateBookRequest, Book>();
        CreateMap<UpdateBookRequest, Book>();
        CreateMap<Book, BookResponse>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
        
        // Category Mappings
        CreateMap<CreateCategoryRequest, Category>();
        CreateMap<UpdateCategoryRequest, Category>();
        CreateMap<Category, CategoryResponse>();
        
        // Shelf Mappings
        CreateMap<CreateShelfRequest, Shelf>();
        CreateMap<UpdateShelfRequest, Shelf>();
        CreateMap<Shelf, ShelfResponse>();
        
        // Borrowing Mappings
        CreateMap<Borrowing, BorrowingResponse>();
        CreateMap<BorrowingDetail, BorrowingDetailResponse>()
            .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Book.Title));
    }
}
using LibraryMangement.EnumData;
using LibraryMangement.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryMangement.Data;

public class LibraryContext : DbContext
{
    public DbSet<Account> Accounts { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Admin> Admins { get; set; }

    public DbSet<Book> Books { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Shelf> Shelves { get; set; }
    public DbSet<BookLocation> BookLocations { get; set; }

    public DbSet<Borrowing> Borrowings { get; set; }
    public DbSet<BorrowingDetail> BorrowingDetails { get; set; }

    public DbSet<DataAnalyticsDaily> DataAnalyticsDaily { get; set; }

    public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // --- Account TPH discriminator ---
        modelBuilder.Entity<Account>(b =>
        {
            b.ToTable("Accounts");
            b.HasKey(a => a.AccountID); 
            b.HasIndex(a => a.Email).IsUnique();
            b.Property(a => a.Email).HasMaxLength(100).IsRequired(); 
            b.Property(a => a.Password).HasMaxLength(255).IsRequired(); 
            b.Property(a => a.FullName).HasMaxLength(100).IsRequired(); 
            b.Property(a => a.Role).HasMaxLength(10).IsRequired(); 

            // map enum AccountStatus to string
            b.Property(a => a.Status)
             .HasConversion<string>()
             .HasMaxLength(20)
             .HasDefaultValue(AccountStatus.ACTIVE); 

            b.Property(a => a.CreatedAt).HasDefaultValueSql("now()"); 

            b.HasDiscriminator<string>("Role")
                .HasValue<User>("USER")
                .HasValue<Admin>("ADMIN"); 
        });

        // Configure Admin specific columns
        modelBuilder.Entity<Admin>(b =>
        {
            b.Property(a => a.StaffCode).HasMaxLength(255); 
            b.HasIndex(a => a.StaffCode).IsUnique();
            b.Property(a => a.Position)
             .HasConversion<string>()
             .HasMaxLength(20); 
        });

        // --- Cập nhật: Thêm cấu hình default value cho User ---
        modelBuilder.Entity<User>(b =>
        {
            b.Property(u => u.LimitRenew).HasDefaultValue(3); 
            b.Property(u => u.CountRenew).HasDefaultValue(0); 
            b.Property(u => u.LimitBorrow).HasDefaultValue(5); 
            b.Property(u => u.CountBorrow).HasDefaultValue(0); 
            b.Property(u => u.CountViolations).HasDefaultValue(0); 
        });

        // --- Category ---
        modelBuilder.Entity<Category>(b =>
        {
            b.ToTable("Categories");
            b.HasKey(c => c.CategoryID); 
            b.Property(c => c.Name).HasMaxLength(100).IsRequired(); 
            b.HasIndex(c => c.Name).IsUnique();
            b.Property(c => c.CreatedAt).HasDefaultValueSql("now()"); 
        });

        // --- Book ---
        modelBuilder.Entity<Book>(b =>
        {
            b.ToTable("Books");
            b.HasKey(x => x.BookID); 
            b.HasIndex(x => x.ISBN).IsUnique();
            b.Property(x => x.ISBN).HasMaxLength(100).IsRequired(); 
            b.Property(x => x.Title).HasMaxLength(255).IsRequired(); 
            b.Property(x => x.Author).HasMaxLength(255).IsRequired(); 

            // --- Cập nhật: Thêm cấu hình cho các thuộc tính mới của Book ---
            b.Property(x => x.Description).HasColumnType("text").IsRequired().HasDefaultValue(string.Empty); 
            b.Property(x => x.Publisher).HasMaxLength(255).IsRequired().HasDefaultValue(string.Empty); 
            b.Property(x => x.CoverImage).HasMaxLength(500).IsRequired().HasDefaultValue(string.Empty); 
            b.Property(x => x.TotalQuantity).HasDefaultValue(0); 
            b.Property(x => x.AvailableQuantity).HasDefaultValue(0); 
            b.Property(x => x.BorrowedCount).HasDefaultValue(0); 

            b.HasOne(x => x.Category)
             .WithMany(c => c.Books) 
             .HasForeignKey(x => x.CategoryID) 
             .OnDelete(DeleteBehavior.SetNull);

            b.Property(x => x.CreatedAt).HasDefaultValueSql("now()"); 
        });

        // --- Shelf ---
        modelBuilder.Entity<Shelf>(b =>
        {
            b.ToTable("Shelf");
            b.HasKey(s => s.ShelfID); 
            b.HasIndex(s => s.LocationName).IsUnique();
            b.Property(s => s.LocationName).HasMaxLength(100).IsRequired(); 
            b.Property(s => s.Status)
             .HasConversion<string>()
             .HasMaxLength(20)
             .HasDefaultValue(ShelfStatus.EMPTY); 

            // --- Cập nhật: Thêm default value cho Capacity và CurrentBooks ---
            b.Property(s => s.Capacity).HasDefaultValue(0); 
            b.Property(s => s.CurrentBooks).HasDefaultValue(0); 

            b.Property(s => s.CreatedAt).HasDefaultValueSql("now()"); 
        });

        // --- BookLocation ---
        modelBuilder.Entity<BookLocation>(b =>
        {
            b.ToTable("BookLocation");
            b.HasKey(bl => bl.BookLocationID); 
            b.HasOne(bl => bl.Book)
             .WithMany(bk => bk.BookLocations) 
             .HasForeignKey(bl => bl.BookID) 
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(bl => bl.Shelf)
             .WithMany(s => s.BookLocations) 
             .HasForeignKey(bl => bl.ShelfID) 
             .OnDelete(DeleteBehavior.Cascade);

            b.Property(bl => bl.CreatedAt).HasDefaultValueSql("now()"); 
        });

        // --- Borrowing ---
        modelBuilder.Entity<Borrowing>(b =>
        {
            b.ToTable("Borrowings");
            b.HasKey(x => x.BorrowingID); 

            b.HasOne(x => x.Account)
             .WithMany(a => a.Borrowings) 
             .HasForeignKey(x => x.AccountID) 
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(x => x.Staff)
             .WithMany()
             .HasForeignKey(x => x.StaffID) 
             .OnDelete(DeleteBehavior.SetNull);

            b.Property(x => x.Status)
             .HasConversion<string>()
             .HasDefaultValue(BorrowingStatus.PENDING); 
            b.Property(x => x.CreatedAt).HasDefaultValueSql("now()"); 
        });

        // --- BorrowingDetail ---
        modelBuilder.Entity<BorrowingDetail>(b =>
        {
            b.ToTable("BorrowingDetails");
            b.HasKey(x => x.BorrowingDetailID); 

            b.HasOne(x => x.Borrowing)
             .WithMany(bor => bor.Details) 
             .HasForeignKey(x => x.BorrowingID) 
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(x => x.Book)
             .WithMany(book => book.BorrowingDetails) 
             .HasForeignKey(x => x.BookID) 
             .OnDelete(DeleteBehavior.Cascade);

            // --- Cập nhật: Thêm default value cho QuantityBook ---
            b.Property(x => x.QuantityBook).HasDefaultValue(1); 

            b.Property(x => x.Status)
             .HasConversion<string>()
             .HasDefaultValue(BorrowingDetailStatus.BORROWING); 

            // --- Cập nhật: Thêm cấu hình CreatedAt ---
            b.Property(b => b.CreatedAt).HasDefaultValueSql("now()"); 
        });

        // --- DataAnalyticsDaily ---
        modelBuilder.Entity<DataAnalyticsDaily>(b =>
        {
            b.ToTable("DataAnalyticsDaily");
            b.HasKey(x => x.DataAnalyticsID); 
            b.Property(x => x.ReportDate).IsRequired(); 

            // --- Cập nhật: Thêm default value cho các thuộc tính Count ---
            b.Property(x => x.CountBorrowings).HasDefaultValue(0); 
            b.Property(x => x.CountUsersViolations).HasDefaultValue(0); 
            b.Property(x => x.CountUsersVisited).HasDefaultValue(0); 
            b.Property(x => x.CountUserBack).HasDefaultValue(0); 
            b.Property(x => x.CountBorrowingsToExpire).HasDefaultValue(0); 
            b.Property(x => x.CountBorrowingsRequestPending).HasDefaultValue(0); 

            b.Property(x => x.CreatedAt).HasDefaultValueSql("now()"); 
        });
    }

    // update CreatedAt/UpdatedAt automatically
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        var now = DateTime.UtcNow;
        foreach (var entry in entries)
        {
            var entity = (BaseEntity)entry.Entity;
            if (entry.State == EntityState.Added)
                entity.CreatedAt = now; 
            entity.UpdatedAt = now; 
        }
    }
}
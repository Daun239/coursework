using System;
using System.Collections.Generic;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Data;

public partial class CinemaNetworkContext : DbContext
{
    public CinemaNetworkContext()
    {
    }

    public CinemaNetworkContext(DbContextOptions<CinemaNetworkContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AgeRestriction> AgeRestrictions { get; set; }

    public virtual DbSet<Check> Checks { get; set; }

    public virtual DbSet<CheckTicket> CheckTickets { get; set; }

    public virtual DbSet<Cinema> Cinemas { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<DeliveryOrder> DeliveryOrders { get; set; }

    public virtual DbSet<DeliveryOrderStatus> DeliveryOrderStatuses { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<EmployeePassword> EmployeePasswords { get; set; }

    public virtual DbSet<EmployeePosition> EmployeePositions { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<Hall> Halls { get; set; }

    public virtual DbSet<HallTechnology> HallTechnologies { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<MoviesGenre> MoviesGenres { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCheck> ProductChecks { get; set; }

    public virtual DbSet<ProductCheckDetail> ProductCheckDetails { get; set; }

    public virtual DbSet<ProductPlacement> ProductPlacements { get; set; }

    public virtual DbSet<ProductType> ProductTypes { get; set; }

    public virtual DbSet<ProductsInOrder> ProductsInOrders { get; set; }

    public virtual DbSet<ProductsInStorage> ProductsInStorages { get; set; }

    public virtual DbSet<Publisher> Publishers { get; set; }

    public virtual DbSet<Run> Runs { get; set; }

    public virtual DbSet<Screening> Screenings { get; set; }

    public virtual DbSet<ScreeningFormat> ScreeningFormats { get; set; }

    public virtual DbSet<ScreeningPrice> ScreeningPrices { get; set; }

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<SeatCategory> SeatCategories { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=PC");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AgeRestriction>(entity =>
        {
            entity.HasKey(e => e.AgeRestrictionId).HasName("PK__AgeRestr__CDA00310DA75C95B");

            entity.Property(e => e.AgeRestriction1).HasColumnName("AgeRestriction");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Check>(entity =>
        {
            entity.HasKey(e => e.CheckId).HasName("PK__Checks__86815766FA09F742");

            entity.Property(e => e.BuyDateTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Checks)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__ClientId__293BEF9E");

            entity.HasOne(d => d.Employee).WithMany(p => p.Checks)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__Employee__2847CB65");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Checks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__Checks__PaymentM__2753A72C");
        });

        modelBuilder.Entity<CheckTicket>(entity =>
        {
            entity.HasKey(e => e.CheckTicketId).HasName("PK__CheckTic__1EACC6072BA733EC");

            entity.HasIndex(e => e.TicketId, "UQ__CheckTic__712CC606F2D08281").IsUnique();

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Check).WithMany(p => p.CheckTickets)
                .HasForeignKey(d => d.CheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Check__33B97E11");

            entity.HasOne(d => d.Ticket).WithOne(p => p.CheckTicket)
                .HasForeignKey<CheckTicket>(d => d.TicketId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Ticke__34ADA24A");
        });

        modelBuilder.Entity<Cinema>(entity =>
        {
            entity.HasKey(e => e.CinemaId).HasName("PK__Cinemas__59C92646CC95385D");

            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.City).WithMany(p => p.Cinemas)
                .HasForeignKey(d => d.CityId)
                .HasConstraintName("FK__Cinemas__CityId__6D270597");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK__Cities__F2D21B763DB5D615");

            entity.Property(e => e.City1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("City");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.ClientId).HasName("PK__Clients__E67E1A244101E3A4");

            entity.HasIndex(e => e.CellNumber, "UQ__Clients__0747333B1744E232").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Clients__A9D10534D41409CA").IsUnique();

            entity.Property(e => e.CellNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Surname)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.CountryId).HasName("PK__Countrie__10D1609FDE3574BE");

            entity.Property(e => e.Country1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Country");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<DeliveryOrder>(entity =>
        {
            entity.HasKey(e => e.DeliveryOrderId).HasName("PK__Delivery__4CFAF430C4284889");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EndDateTime).HasColumnType("datetime");
            entity.Property(e => e.OrderDateTime).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrderStatus).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.DeliveryOrderStatusId)
                .HasConstraintName("FK__DeliveryO__Deliv__43EFE5DA");

            entity.HasOne(d => d.Employee).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__DeliveryO__Emplo__46CC5285");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__DeliveryO__Payme__44E40A13");

            entity.HasOne(d => d.Supplier).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK__DeliveryO__Suppl__45D82E4C");
        });

        modelBuilder.Entity<DeliveryOrderStatus>(entity =>
        {
            entity.HasKey(e => e.DeliveryOrderStatusId).HasName("PK__Delivery__19126B4763256E51");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DeliveryOrderStatus1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("DeliveryOrderStatus");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04F11940D0AF9");

            entity.HasIndex(e => e.CellNumber, "UQ__Employee__0747333BD3F0537C").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Employee__A9D105341892C0F7").IsUnique();

            entity.Property(e => e.CellNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Surname)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Employees)
                .HasForeignKey(d => d.CinemaId)
                .HasConstraintName("FK__Employees__Cinem__7A8100B5");

            entity.HasOne(d => d.EmployeePassword).WithMany(p => p.Employees)
                .HasForeignKey(d => d.EmployeePasswordId)
                .HasConstraintName("FK__Employees__Emplo__7C694927");

            entity.HasOne(d => d.EmployeePosition).WithMany(p => p.Employees)
                .HasForeignKey(d => d.EmployeePositionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Employees__Emplo__7B7524EE");
        });

        modelBuilder.Entity<EmployeePassword>(entity =>
        {
            entity.HasKey(e => e.EmployeePasswordId).HasName("PK__Employee__03ED14D0DEA2C794");

            entity.Property(e => e.Password).HasMaxLength(255);
        });

        modelBuilder.Entity<EmployeePosition>(entity =>
        {
            entity.HasKey(e => e.EmployeePositionId).HasName("PK__Employee__6FDE906084CBB18A");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EmployeePosition1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("EmployeePosition");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.GenreId).HasName("PK__Genres__0385057EB1DC3E17");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Genre1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("Genre");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Hall>(entity =>
        {
            entity.HasKey(e => e.HallId).HasName("PK__Halls__7E60E2143530FBF8");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Halls)
                .HasForeignKey(d => d.CinemaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Halls__CinemaId__71EBBAB4");

            entity.HasOne(d => d.HallTechnology).WithMany(p => p.Halls)
                .HasForeignKey(d => d.HallTechnologyId)
                .HasConstraintName("FK__Halls__HallTechn__72DFDEED");
        });

        modelBuilder.Entity<HallTechnology>(entity =>
        {
            entity.HasKey(e => e.HallTechnologyId).HasName("PK__HallTech__B29C290E749D6F01");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.HallTechnology1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("HallTechnology");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.LanguageId).HasName("PK__Language__B93855AB7984262B");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Language1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("Language");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.MovieId).HasName("PK__Movies__4BD2941A15F2C448");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.AgeRestriction).WithMany(p => p.Movies)
                .HasForeignKey(d => d.AgeRestrictionId)
                .HasConstraintName("FK__Movies__AgeRestr__08CF200C");

            entity.HasOne(d => d.Country).WithMany(p => p.Movies)
                .HasForeignKey(d => d.CountryId)
                .HasConstraintName("FK__Movies__CountryI__07DAFBD3");

            entity.HasOne(d => d.Language).WithMany(p => p.Movies)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Movies__Language__06E6D79A");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Movies)
                .HasForeignKey(d => d.PublisherId)
                .HasConstraintName("FK__Movies__Publishe__05F2B361");
        });

        modelBuilder.Entity<MoviesGenre>(entity =>
        {
            entity.HasKey(e => e.MoviesGenresId).HasName("PK__MoviesGe__1C2615615A3135B0");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Genre).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Genre__39725767");

            entity.HasOne(d => d.Movie).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Movie__387E332E");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PK__PaymentM__DC31C1D3A9D75EAD");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("PaymentMethod");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CDECE268B9");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductType).WithMany(p => p.Products)
                .HasForeignKey(d => d.ProductTypeId)
                .HasConstraintName("FK__Products__Produc__4A9CE369");
        });

        modelBuilder.Entity<ProductCheck>(entity =>
        {
            entity.HasKey(e => e.ProductCheckId).HasName("PK__ProductC__BE6F879F0201DCCD");

            entity.Property(e => e.BuyTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK__ProductCh__Clien__6550D9A5");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__ProductCh__Emplo__6644FDDE");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__ProductCh__Payme__645CB56C");
        });

        modelBuilder.Entity<ProductCheckDetail>(entity =>
        {
            entity.HasKey(e => e.ProductCheckDetailId).HasName("PK__ProductC__F64459FE5364AFA9");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductCheck).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductCheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__6B09B2FB");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__6BFDD734");
        });

        modelBuilder.Entity<ProductPlacement>(entity =>
        {
            entity.HasKey(e => e.ProductPlacementId).HasName("PK__ProductP__7C13AC2C785C8E9A");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PlacementDate).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Emplo__5DAFB7DD");

            entity.HasOne(d => d.ProductInOrder).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__5EA3DC16");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__5CBB93A4");
        });

        modelBuilder.Entity<ProductType>(entity =>
        {
            entity.HasKey(e => e.ProductTypeId).HasName("PK__ProductT__A1312F6ECD349E8C");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ProductType1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ProductType");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<ProductsInOrder>(entity =>
        {
            entity.HasKey(e => e.ProductInOrderId).HasName("PK__Products__41EA9C4CCAAC421D");

            entity.ToTable("ProductsInOrder");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrder).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.DeliveryOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Deliv__5702BA4E");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK__ProductsI__Produ__57F6DE87");
        });

        modelBuilder.Entity<ProductsInStorage>(entity =>
        {
            entity.HasKey(e => e.ProductInStorageId).HasName("PK__Products__E1557F36E1D4309C");

            entity.ToTable("ProductsInStorage");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
            entity.Property(e => e.ProductionDate).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Cinema).WithMany(p => p.ProductsInStorages)
                .HasForeignKey(d => d.CinemaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Cinem__4F619886");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInStorages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Produ__5055BCBF");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("PK__Publishe__4C657FAB5080C77A");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Publisher1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("Publisher");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Run>(entity =>
        {
            entity.HasKey(e => e.RunId).HasName("PK__Runs__A259D4DD41ABA760");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Movie).WithMany(p => p.Runs)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Runs__MovieId__0BAB8CB7");
        });

        modelBuilder.Entity<Screening>(entity =>
        {
            entity.HasKey(e => e.ScreeningId).HasName("PK__Screenin__7734E40CA813BCFB");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__HallI__1164660D");

            entity.HasOne(d => d.Language).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Screening__Langu__134CAE7F");

            entity.HasOne(d => d.Run).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.RunId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__RunId__12588A46");

            entity.HasOne(d => d.ScreeningFormat).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.ScreeningFormatId)
                .HasConstraintName("FK__Screening__Scree__107041D4");
        });

        modelBuilder.Entity<ScreeningFormat>(entity =>
        {
            entity.HasKey(e => e.ScreeningFormatId).HasName("PK__Screenin__CAD34420187834DC");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ScreeningFormat1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ScreeningFormat");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<ScreeningPrice>(entity =>
        {
            entity.HasKey(e => e.ScreeningPriceId).HasName("PK__Screenin__67A929BDAAAEEC21");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Screening).WithMany(p => p.ScreeningPrices)
                .HasForeignKey(d => d.ScreeningId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__Scree__1AEDD047");

            entity.HasOne(d => d.SeatCategory).WithMany(p => p.ScreeningPrices)
                .HasForeignKey(d => d.SeatCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__SeatC__1BE1F480");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.SeatId).HasName("PK__Seats__311713F3EC4C0D93");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Seats)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seats__HallId__219ACDD6");

            entity.HasOne(d => d.SeatCategory).WithMany(p => p.Seats)
                .HasForeignKey(d => d.SeatCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seats__SeatCateg__228EF20F");
        });

        modelBuilder.Entity<SeatCategory>(entity =>
        {
            entity.HasKey(e => e.SeatCategoryId).HasName("PK__SeatCate__75ACE6E503832C1E");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SeatCategory1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("SeatCategory");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId).HasName("PK__Supplier__4BE666B4920FC6EE");

            entity.HasIndex(e => e.CellNumber, "UQ__Supplier__0747333BAF47D50B").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Supplier__A9D105349C4A2620").IsUnique();

            entity.Property(e => e.CellNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Surname)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__Tickets__712CC607F4F7EC8F");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ScreeningPrice).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.ScreeningPriceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__Screeni__2EF4C8F4");

            entity.HasOne(d => d.Seat).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.SeatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__SeatId__2E00A4BB");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

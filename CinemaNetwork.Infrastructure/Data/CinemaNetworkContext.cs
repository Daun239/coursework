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
            entity.HasKey(e => e.AgeRestrictionId).HasName("PK__AgeRestr__CDA00310D0BE1D4A");

            entity.Property(e => e.AgeRestriction1).HasColumnName("AgeRestriction");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Check>(entity =>
        {
            entity.HasKey(e => e.CheckId).HasName("PK__Checks__868157669B508468");

            entity.Property(e => e.BuyDateTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Checks)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__ClientId__53C65AF0");

            entity.HasOne(d => d.Employee).WithMany(p => p.Checks)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__Employee__52D236B7");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Checks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__Checks__PaymentM__51DE127E");
        });

        modelBuilder.Entity<CheckTicket>(entity =>
        {
            entity.HasKey(e => e.CheckTicketId).HasName("PK__CheckTic__1EACC607100E2DBF");

            entity.HasIndex(e => e.TicketId, "UQ__CheckTic__712CC606D4F332CE").IsUnique();

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Check).WithMany(p => p.CheckTickets)
                .HasForeignKey(d => d.CheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Check__5E43E963");

            entity.HasOne(d => d.Ticket).WithOne(p => p.CheckTicket)
                .HasForeignKey<CheckTicket>(d => d.TicketId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Ticke__5F380D9C");
        });

        modelBuilder.Entity<Cinema>(entity =>
        {
            entity.HasKey(e => e.CinemaId).HasName("PK__Cinemas__59C92646BDA4995F");

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
                .HasConstraintName("FK__Cinemas__CityId__1A8DDD94");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK__Cities__F2D21B7610682C0B");

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
            entity.HasKey(e => e.ClientId).HasName("PK__Clients__E67E1A24A8C9EF08");

            entity.HasIndex(e => e.CellNumber, "UQ__Clients__0747333B7901035B").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Clients__A9D10534037DEAC5").IsUnique();

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
            entity.HasKey(e => e.CountryId).HasName("PK__Countrie__10D1609F562D4D43");

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
            entity.HasKey(e => e.DeliveryOrderId).HasName("PK__Delivery__4CFAF430F886212C");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EndDateTime).HasColumnType("datetime");
            entity.Property(e => e.OrderDateTime).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrderStatus).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.DeliveryOrderStatusId)
                .HasConstraintName("FK__DeliveryO__Deliv__6E7A512C");

            entity.HasOne(d => d.Employee).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__DeliveryO__Emplo__7156BDD7");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__DeliveryO__Payme__6F6E7565");

            entity.HasOne(d => d.Supplier).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK__DeliveryO__Suppl__7062999E");
        });

        modelBuilder.Entity<DeliveryOrderStatus>(entity =>
        {
            entity.HasKey(e => e.DeliveryOrderStatusId).HasName("PK__Delivery__19126B478DF5505F");

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
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04F11CADF3210");

            entity.HasIndex(e => e.CellNumber, "UQ__Employee__0747333B56A8E1C2").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Employee__A9D105340244E57B").IsUnique();

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
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Surname)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Employees)
                .HasForeignKey(d => d.CinemaId)
                .HasConstraintName("FK__Employees__Cinem__25FF9040");

            entity.HasOne(d => d.EmployeePosition).WithMany(p => p.Employees)
                .HasForeignKey(d => d.EmployeePositionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Employees__Emplo__26F3B479");
        });

        modelBuilder.Entity<EmployeePosition>(entity =>
        {
            entity.HasKey(e => e.EmployeePositionId).HasName("PK__Employee__6FDE906044D6A582");

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
            entity.HasKey(e => e.GenreId).HasName("PK__Genres__0385057E77F13AB0");

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
            entity.HasKey(e => e.HallId).HasName("PK__Halls__7E60E214D22ED993");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Halls)
                .HasForeignKey(d => d.CinemaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Halls__CinemaId__1F5292B1");

            entity.HasOne(d => d.HallTechnology).WithMany(p => p.Halls)
                .HasForeignKey(d => d.HallTechnologyId)
                .HasConstraintName("FK__Halls__HallTechn__2046B6EA");
        });

        modelBuilder.Entity<HallTechnology>(entity =>
        {
            entity.HasKey(e => e.HallTechnologyId).HasName("PK__HallTech__B29C290EE854AD8F");

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
            entity.HasKey(e => e.LanguageId).HasName("PK__Language__B93855AB12D7291B");

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
            entity.HasKey(e => e.MovieId).HasName("PK__Movies__4BD2941A0048F5F2");

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
                .HasConstraintName("FK__Movies__AgeRestr__33598B5E");

            entity.HasOne(d => d.Country).WithMany(p => p.Movies)
                .HasForeignKey(d => d.CountryId)
                .HasConstraintName("FK__Movies__CountryI__32656725");

            entity.HasOne(d => d.Language).WithMany(p => p.Movies)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Movies__Language__317142EC");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Movies)
                .HasForeignKey(d => d.PublisherId)
                .HasConstraintName("FK__Movies__Publishe__307D1EB3");
        });

        modelBuilder.Entity<MoviesGenre>(entity =>
        {
            entity.HasKey(e => e.MoviesGenresId).HasName("PK__MoviesGe__1C2615613102AF99");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Genre).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Genre__63FCC2B9");

            entity.HasOne(d => d.Movie).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Movie__63089E80");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PK__PaymentM__DC31C1D3EAFE7E65");

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
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CDA75D4643");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductType).WithMany(p => p.Products)
                .HasForeignKey(d => d.ProductTypeId)
                .HasConstraintName("FK__Products__Produc__75274EBB");
        });

        modelBuilder.Entity<ProductCheck>(entity =>
        {
            entity.HasKey(e => e.ProductCheckId).HasName("PK__ProductC__BE6F879F9E8DBAAB");

            entity.Property(e => e.BuyTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK__ProductCh__Clien__0FDB44F7");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__ProductCh__Emplo__10CF6930");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__ProductCh__Payme__0EE720BE");
        });

        modelBuilder.Entity<ProductCheckDetail>(entity =>
        {
            entity.HasKey(e => e.ProductCheckDetailId).HasName("PK__ProductC__F64459FE1194DCF1");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductCheck).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductCheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__15941E4D");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__16884286");
        });

        modelBuilder.Entity<ProductPlacement>(entity =>
        {
            entity.HasKey(e => e.ProductPlacementId).HasName("PK__ProductP__7C13AC2CA2548709");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PlacementDate).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Emplo__083A232F");

            entity.HasOne(d => d.ProductInOrder).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__092E4768");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__0745FEF6");
        });

        modelBuilder.Entity<ProductType>(entity =>
        {
            entity.HasKey(e => e.ProductTypeId).HasName("PK__ProductT__A1312F6E4DA38615");

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
            entity.HasKey(e => e.ProductInOrderId).HasName("PK__Products__41EA9C4CDAA86366");

            entity.ToTable("ProductsInOrder");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrder).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.DeliveryOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Deliv__018D25A0");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK__ProductsI__Produ__028149D9");
        });

        modelBuilder.Entity<ProductsInStorage>(entity =>
        {
            entity.HasKey(e => e.ProductInStorageId).HasName("PK__Products__E1557F361ADB699A");

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
                .HasConstraintName("FK__ProductsI__Cinem__79EC03D8");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInStorages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Produ__7AE02811");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("PK__Publishe__4C657FAB4D9BA4B5");

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
            entity.HasKey(e => e.RunId).HasName("PK__Runs__A259D4DD2AB55039");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Movie).WithMany(p => p.Runs)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Runs__MovieId__3635F809");
        });

        modelBuilder.Entity<Screening>(entity =>
        {
            entity.HasKey(e => e.ScreeningId).HasName("PK__Screenin__7734E40CC9D5BF94");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__HallI__3BEED15F");

            entity.HasOne(d => d.Language).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Screening__Langu__3DD719D1");

            entity.HasOne(d => d.Run).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.RunId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__RunId__3CE2F598");

            entity.HasOne(d => d.ScreeningFormat).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.ScreeningFormatId)
                .HasConstraintName("FK__Screening__Scree__3AFAAD26");
        });

        modelBuilder.Entity<ScreeningFormat>(entity =>
        {
            entity.HasKey(e => e.ScreeningFormatId).HasName("PK__Screenin__CAD34420088F5AB4");

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
            entity.HasKey(e => e.ScreeningPriceId).HasName("PK__Screenin__67A929BD3392A981");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Screening).WithMany(p => p.ScreeningPrices)
                .HasForeignKey(d => d.ScreeningId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__Scree__45783B99");

            entity.HasOne(d => d.SeatCategory).WithMany(p => p.ScreeningPrices)
                .HasForeignKey(d => d.SeatCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__SeatC__466C5FD2");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.SeatId).HasName("PK__Seats__311713F3E6AFC3B4");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Seats)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seats__HallId__4C253928");

            entity.HasOne(d => d.SeatCategory).WithMany(p => p.Seats)
                .HasForeignKey(d => d.SeatCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seats__SeatCateg__4D195D61");
        });

        modelBuilder.Entity<SeatCategory>(entity =>
        {
            entity.HasKey(e => e.SeatCategoryId).HasName("PK__SeatCate__75ACE6E529D5A258");

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
            entity.HasKey(e => e.SupplierId).HasName("PK__Supplier__4BE666B40A4989FC");

            entity.HasIndex(e => e.CellNumber, "UQ__Supplier__0747333BE98202D5").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Supplier__A9D10534C0EA6988").IsUnique();

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
            entity.HasKey(e => e.TicketId).HasName("PK__Tickets__712CC607FB747DA8");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ScreeningPrice).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.ScreeningPriceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__Screeni__597F3446");

            entity.HasOne(d => d.Seat).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.SeatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__SeatId__588B100D");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

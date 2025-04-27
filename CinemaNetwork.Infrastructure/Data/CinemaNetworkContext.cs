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

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=PC");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AgeRestriction>(entity =>
        {
            entity.HasKey(e => e.AgeRestrictionId).HasName("PK__AgeRestr__CDA003104BE90989");

            entity.Property(e => e.AgeRestriction1).HasColumnName("AgeRestriction");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Check>(entity =>
        {
            entity.HasKey(e => e.CheckId).HasName("PK__Checks__86815766E5BB719F");

            entity.Property(e => e.BuyDateTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Checks)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__ClientId__440D7F66");

            entity.HasOne(d => d.Employee).WithMany(p => p.Checks)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__Employee__43195B2D");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Checks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__Checks__PaymentM__422536F4");
        });

        modelBuilder.Entity<CheckTicket>(entity =>
        {
            entity.HasKey(e => e.CheckTicketId).HasName("PK__CheckTic__1EACC607142B3745");

            entity.HasIndex(e => e.TicketId, "UQ__CheckTic__712CC6066DC0DDDD").IsUnique();

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Check).WithMany(p => p.CheckTickets)
                .HasForeignKey(d => d.CheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Check__4F7F3212");

            entity.HasOne(d => d.Ticket).WithOne(p => p.CheckTicket)
                .HasForeignKey<CheckTicket>(d => d.TicketId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Ticke__5073564B");
        });

        modelBuilder.Entity<Cinema>(entity =>
        {
            entity.HasKey(e => e.CinemaId).HasName("PK__Cinemas__59C92646201971E9");

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
                .HasConstraintName("FK__Cinemas__CityId__0EA592EE");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK__Cities__F2D21B76EE938E72");

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
            entity.HasKey(e => e.ClientId).HasName("PK__Clients__E67E1A242A644AD8");

            entity.HasIndex(e => e.CellNumber, "UQ__Clients__0747333B9B58F7C4").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Clients__A9D105347E496201").IsUnique();

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
            entity.HasKey(e => e.CountryId).HasName("PK__Countrie__10D1609F197300D7");

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
            entity.HasKey(e => e.DeliveryOrderId).HasName("PK__Delivery__4CFAF43042EF6B8B");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EndDateTime).HasColumnType("datetime");
            entity.Property(e => e.OrderDateTime).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrderStatus).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.DeliveryOrderStatusId)
                .HasConstraintName("FK__DeliveryO__Deliv__5FB599DB");

            entity.HasOne(d => d.Employee).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__DeliveryO__Emplo__62920686");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__DeliveryO__Payme__60A9BE14");

            entity.HasOne(d => d.Supplier).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK__DeliveryO__Suppl__619DE24D");
        });

        modelBuilder.Entity<DeliveryOrderStatus>(entity =>
        {
            entity.HasKey(e => e.DeliveryOrderStatusId).HasName("PK__Delivery__19126B4769A87BB0");

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
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04F1189B5C321");

            entity.HasIndex(e => e.CellNumber, "UQ__Employee__0747333BE04624AE").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Employee__A9D105345CD29284").IsUnique();

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
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Employees__Cinem__1A17459A");

            entity.HasOne(d => d.EmployeePosition).WithMany(p => p.Employees)
                .HasForeignKey(d => d.EmployeePositionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Employees__Emplo__1B0B69D3");
        });

        modelBuilder.Entity<EmployeePosition>(entity =>
        {
            entity.HasKey(e => e.EmployeePositionId).HasName("PK__Employee__6FDE90604FBE8B10");

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
            entity.HasKey(e => e.GenreId).HasName("PK__Genres__0385057E262EB5C8");

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
            entity.HasKey(e => e.HallId).HasName("PK__Halls__7E60E214F3A8F0F3");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Halls)
                .HasForeignKey(d => d.CinemaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Halls__CinemaId__136A480B");

            entity.HasOne(d => d.HallTechnology).WithMany(p => p.Halls)
                .HasForeignKey(d => d.HallTechnologyId)
                .HasConstraintName("FK__Halls__HallTechn__145E6C44");
        });

        modelBuilder.Entity<HallTechnology>(entity =>
        {
            entity.HasKey(e => e.HallTechnologyId).HasName("PK__HallTech__B29C290EF26A9EBA");

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
            entity.HasKey(e => e.LanguageId).HasName("PK__Language__B93855AB5DA6482A");

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
            entity.HasKey(e => e.MovieId).HasName("PK__Movies__4BD2941A3A34FADB");

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
                .HasConstraintName("FK__Movies__AgeRestr__277140B8");

            entity.HasOne(d => d.Country).WithMany(p => p.Movies)
                .HasForeignKey(d => d.CountryId)
                .HasConstraintName("FK__Movies__CountryI__267D1C7F");

            entity.HasOne(d => d.Language).WithMany(p => p.Movies)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Movies__Language__2588F846");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Movies)
                .HasForeignKey(d => d.PublisherId)
                .HasConstraintName("FK__Movies__Publishe__2494D40D");
        });

        modelBuilder.Entity<MoviesGenre>(entity =>
        {
            entity.HasKey(e => e.MoviesGenresId).HasName("PK__MoviesGe__1C261561EBD1AB93");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Genre).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Genre__55380B68");

            entity.HasOne(d => d.Movie).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Movie__5443E72F");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PK__PaymentM__DC31C1D3243C940C");

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
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CD65F4621D");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductType).WithMany(p => p.Products)
                .HasForeignKey(d => d.ProductTypeId)
                .HasConstraintName("FK__Products__Produc__6662976A");
        });

        modelBuilder.Entity<ProductCheck>(entity =>
        {
            entity.HasKey(e => e.ProductCheckId).HasName("PK__ProductC__BE6F879F3B9ECF34");

            entity.Property(e => e.BuyTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK__ProductCh__Clien__01168DA6");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__ProductCh__Emplo__020AB1DF");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__ProductCh__Payme__0022696D");
        });

        modelBuilder.Entity<ProductCheckDetail>(entity =>
        {
            entity.HasKey(e => e.ProductCheckDetailId).HasName("PK__ProductC__F64459FED3B7C13C");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductCheck).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductCheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__06CF66FC");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__07C38B35");
        });

        modelBuilder.Entity<ProductPlacement>(entity =>
        {
            entity.HasKey(e => e.ProductPlacementId).HasName("PK__ProductP__7C13AC2C288BD4E5");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PlacementDate).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Emplo__79756BDE");

            entity.HasOne(d => d.ProductInOrder).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__7A699017");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__788147A5");
        });

        modelBuilder.Entity<ProductType>(entity =>
        {
            entity.HasKey(e => e.ProductTypeId).HasName("PK__ProductT__A1312F6EC58DE9E1");

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
            entity.HasKey(e => e.ProductInOrderId).HasName("PK__Products__41EA9C4C6915D47F");

            entity.ToTable("ProductsInOrder");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrder).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.DeliveryOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Deliv__72C86E4F");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK__ProductsI__Produ__73BC9288");
        });

        modelBuilder.Entity<ProductsInStorage>(entity =>
        {
            entity.HasKey(e => e.ProductInStorageId).HasName("PK__Products__E1557F362E07589B");

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
                .HasConstraintName("FK__ProductsI__Cinem__6B274C87");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInStorages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Produ__6C1B70C0");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("PK__Publishe__4C657FABC15EC644");

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
            entity.HasKey(e => e.RunId).HasName("PK__Runs__A259D4DDE2DDE9FF");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Movie).WithMany(p => p.Runs)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Runs__MovieId__2A4DAD63");
        });

        modelBuilder.Entity<Screening>(entity =>
        {
            entity.HasKey(e => e.ScreeningId).HasName("PK__Screenin__7734E40C255752C8");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__HallI__300686B9");

            entity.HasOne(d => d.Language).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Screening__Langu__31EECF2B");

            entity.HasOne(d => d.Run).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.RunId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__RunId__30FAAAF2");

            entity.HasOne(d => d.ScreeningFormat).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.ScreeningFormatId)
                .HasConstraintName("FK__Screening__Scree__2F126280");
        });

        modelBuilder.Entity<ScreeningFormat>(entity =>
        {
            entity.HasKey(e => e.ScreeningFormatId).HasName("PK__Screenin__CAD34420C3EDA4CF");

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
            entity.HasKey(e => e.ScreeningPricingId).HasName("PK__Screenin__310B9C63C84B2DED");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Screening).WithMany(p => p.ScreeningPrices)
                .HasForeignKey(d => d.ScreeningId)
                .HasConstraintName("FK__Screening__Scree__37A7A881");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.SeatId).HasName("PK__Seats__311713F395088015");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Seats)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seats__HallId__3D6081D7");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId).HasName("PK__Supplier__4BE666B43EA6C347");

            entity.HasIndex(e => e.CellNumber, "UQ__Supplier__0747333B2CC1C07B").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Supplier__A9D105342F9C0C4A").IsUnique();

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
            entity.HasKey(e => e.TicketId).HasName("PK__Tickets__712CC607710B3909");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Screening).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.ScreeningId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__Screeni__4ABA7CF5");

            entity.HasOne(d => d.Seat).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.SeatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__SeatId__49C658BC");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

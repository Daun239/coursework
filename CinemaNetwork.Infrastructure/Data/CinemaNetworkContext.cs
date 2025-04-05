using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Data;

public partial class CinemaNetworkContext : IdentityDbContext<IdentityUser>
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

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=PC");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AgeRestriction>(entity =>
        {
            entity.HasKey(e => e.AgeRestrictionId).HasName("PK__AgeRestr__CDA00310DD9B8331");

            entity.Property(e => e.AgeRestriction1).HasColumnName("AgeRestriction");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Check>(entity =>
        {
            entity.HasKey(e => e.CheckId).HasName("PK__Checks__86815766D67D5C8D");

            entity.Property(e => e.BuyDateTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Checks)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__ClientId__1DB06A4F");

            entity.HasOne(d => d.Employee).WithMany(p => p.Checks)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checks__Employee__1CBC4616");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Checks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__Checks__PaymentM__1BC821DD");
        });

        modelBuilder.Entity<CheckTicket>(entity =>
        {
            entity.HasKey(e => e.CheckTicketId).HasName("PK__CheckTic__1EACC607609CB438");

            entity.HasIndex(e => e.TicketId, "UQ__CheckTic__712CC6061B676BA8").IsUnique();

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Check).WithMany(p => p.CheckTickets)
                .HasForeignKey(d => d.CheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Check__29221CFB");

            entity.HasOne(d => d.Ticket).WithOne(p => p.CheckTicket)
                .HasForeignKey<CheckTicket>(d => d.TicketId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CheckTick__Ticke__2A164134");
        });

        modelBuilder.Entity<Cinema>(entity =>
        {
            entity.HasKey(e => e.CinemaId).HasName("PK__Cinemas__59C9264601D320E5");

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
                .HasConstraintName("FK__Cinemas__CityId__6E01572D");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK__Cities__F2D21B76F8D3B6FA");

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
            entity.HasKey(e => e.ClientId).HasName("PK__Clients__E67E1A247E620411");

            entity.HasIndex(e => e.CellNumber, "UQ__Clients__0747333BBBBA9EA7").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Clients__A9D10534271045A1").IsUnique();

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
            entity.HasKey(e => e.CountryId).HasName("PK__Countrie__10D1609F34552BF3");

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
            entity.HasKey(e => e.DeliveryOrderId).HasName("PK__Delivery__4CFAF430F2E54201");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EndDateTime).HasColumnType("datetime");
            entity.Property(e => e.OrderDateTime).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrderStatus).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.DeliveryOrderStatusId)
                .HasConstraintName("FK__DeliveryO__Deliv__395884C4");

            entity.HasOne(d => d.Employee).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__DeliveryO__Emplo__3C34F16F");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__DeliveryO__Payme__3A4CA8FD");

            entity.HasOne(d => d.Supplier).WithMany(p => p.DeliveryOrders)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK__DeliveryO__Suppl__3B40CD36");
        });

        modelBuilder.Entity<DeliveryOrderStatus>(entity =>
        {
            entity.HasKey(e => e.DeliveryOrderStatusId).HasName("PK__Delivery__19126B479317DADE");

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
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04F11295D7F43");

            entity.HasIndex(e => e.CellNumber, "UQ__Employee__0747333BB7CFB4D0").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Employee__A9D105345CB6648E").IsUnique();

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
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Employees__Cinem__797309D9");

            entity.HasOne(d => d.EmployeePosition).WithMany(p => p.Employees)
                .HasForeignKey(d => d.EmployeePositionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Employees__Emplo__7A672E12");
        });

        modelBuilder.Entity<EmployeePosition>(entity =>
        {
            entity.HasKey(e => e.EmployeePositionId).HasName("PK__Employee__6FDE90607E56F020");

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
            entity.HasKey(e => e.GenreId).HasName("PK__Genres__0385057E3EC52A0C");

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
            entity.HasKey(e => e.HallId).HasName("PK__Halls__7E60E214EB0A1531");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Halls)
                .HasForeignKey(d => d.CinemaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Halls__CinemaId__72C60C4A");

            entity.HasOne(d => d.HallTechnology).WithMany(p => p.Halls)
                .HasForeignKey(d => d.HallTechnologyId)
                .HasConstraintName("FK__Halls__HallTechn__73BA3083");
        });

        modelBuilder.Entity<HallTechnology>(entity =>
        {
            entity.HasKey(e => e.HallTechnologyId).HasName("PK__HallTech__B29C290E24811C0A");

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
            entity.HasKey(e => e.LanguageId).HasName("PK__Language__B93855ABE7EA224D");

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
            entity.HasKey(e => e.MovieId).HasName("PK__Movies__4BD2941ADF9953F8");

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
                .HasConstraintName("FK__Movies__AgeRestr__06CD04F7");

            entity.HasOne(d => d.Country).WithMany(p => p.Movies)
                .HasForeignKey(d => d.CountryId)
                .HasConstraintName("FK__Movies__CountryI__05D8E0BE");

            entity.HasOne(d => d.Language).WithMany(p => p.Movies)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Movies__Language__04E4BC85");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Movies)
                .HasForeignKey(d => d.PublisherId)
                .HasConstraintName("FK__Movies__Publishe__03F0984C");
        });

        modelBuilder.Entity<MoviesGenre>(entity =>
        {
            entity.HasKey(e => e.MoviesGenresId).HasName("PK__MoviesGe__1C2615616D9CEA1B");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Genre).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Genre__2EDAF651");

            entity.HasOne(d => d.Movie).WithMany(p => p.MoviesGenres)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MoviesGen__Movie__2DE6D218");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PK__PaymentM__DC31C1D379F93839");

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
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CD1E6F1E41");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductType).WithMany(p => p.Products)
                .HasForeignKey(d => d.ProductTypeId)
                .HasConstraintName("FK__Products__Produc__40058253");
        });

        modelBuilder.Entity<ProductCheck>(entity =>
        {
            entity.HasKey(e => e.ProductCheckId).HasName("PK__ProductC__BE6F879F675C604F");

            entity.Property(e => e.BuyTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK__ProductCh__Clien__5AB9788F");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__ProductCh__Emplo__5BAD9CC8");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.ProductChecks)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK__ProductCh__Payme__59C55456");
        });

        modelBuilder.Entity<ProductCheckDetail>(entity =>
        {
            entity.HasKey(e => e.ProductCheckDetailId).HasName("PK__ProductC__F64459FED085018F");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.ProductCheck).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductCheckId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__607251E5");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductCheckDetails)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCh__Produ__6166761E");
        });

        modelBuilder.Entity<ProductPlacement>(entity =>
        {
            entity.HasKey(e => e.ProductPlacementId).HasName("PK__ProductP__7C13AC2C42CF7EC7");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PlacementDate).HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Employee).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Emplo__531856C7");

            entity.HasOne(d => d.ProductInOrder).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__540C7B00");

            entity.HasOne(d => d.ProductInStorage).WithMany(p => p.ProductPlacements)
                .HasForeignKey(d => d.ProductInStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPl__Produ__5224328E");
        });

        modelBuilder.Entity<ProductType>(entity =>
        {
            entity.HasKey(e => e.ProductTypeId).HasName("PK__ProductT__A1312F6EEA9AF47A");

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
            entity.HasKey(e => e.ProductInOrderId).HasName("PK__Products__41EA9C4C3C2A764A");

            entity.ToTable("ProductsInOrder");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.DeliveryOrder).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.DeliveryOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Deliv__4C6B5938");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInOrders)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK__ProductsI__Produ__4D5F7D71");
        });

        modelBuilder.Entity<ProductsInStorage>(entity =>
        {
            entity.HasKey(e => e.ProductInStorageId).HasName("PK__Products__E1557F36A616C970");

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
                .HasConstraintName("FK__ProductsI__Cinem__44CA3770");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductsInStorages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsI__Produ__45BE5BA9");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("PK__Publishe__4C657FAB9BC42F98");

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
            entity.HasKey(e => e.RunId).HasName("PK__Runs__A259D4DD9984F7AA");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Movie).WithMany(p => p.Runs)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Runs__MovieId__09A971A2");
        });

        modelBuilder.Entity<Screening>(entity =>
        {
            entity.HasKey(e => e.ScreeningId).HasName("PK__Screenin__7734E40CC6D2EF6E");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__HallI__0F624AF8");

            entity.HasOne(d => d.Language).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.LanguageId)
                .HasConstraintName("FK__Screening__Langu__114A936A");

            entity.HasOne(d => d.Run).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.RunId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screening__RunId__10566F31");

            entity.HasOne(d => d.ScreeningFormat).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.ScreeningFormatId)
                .HasConstraintName("FK__Screening__Scree__0E6E26BF");
        });

        modelBuilder.Entity<ScreeningFormat>(entity =>
        {
            entity.HasKey(e => e.ScreeningFormatId).HasName("PK__Screenin__CAD34420A5446DC2");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ScreeningFormat1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ScreeningFormat");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.SeatId).HasName("PK__Seats__311713F33311BB38");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Hall).WithMany(p => p.Seats)
                .HasForeignKey(d => d.HallId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seats__HallId__17036CC0");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId).HasName("PK__Supplier__4BE666B45FA2E1D4");

            entity.HasIndex(e => e.CellNumber, "UQ__Supplier__0747333B9AD67FCD").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Supplier__A9D1053450A767E8").IsUnique();

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
            entity.HasKey(e => e.TicketId).HasName("PK__Tickets__712CC6077C4D2197");

            entity.Property(e => e.CreateDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDateTime).HasColumnType("datetime");

            entity.HasOne(d => d.Screening).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.ScreeningId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__Screeni__245D67DE");

            entity.HasOne(d => d.Seat).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.SeatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tickets__SeatId__236943A5");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

using Exprimer.Cms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Exprimer.Cms.Api.Data;

public class CmsDbContext(DbContextOptions<CmsDbContext> options) : DbContext(options)
{
    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();
    public DbSet<Page> Pages => Set<Page>();
    public DbSet<PageSection> PageSections => Set<PageSection>();
    public DbSet<LeadEnquiry> LeadEnquiries => Set<LeadEnquiry>();
    public DbSet<ResumeSubmission> ResumeSubmissions => Set<ResumeSubmission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Page>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        modelBuilder.Entity<PageSection>()
            .HasOne(s => s.Page)
            .WithMany(p => p.Sections)
            .HasForeignKey(s => s.PageId);
    }
}

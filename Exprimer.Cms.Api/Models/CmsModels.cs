namespace Exprimer.Cms.Api.Models;

public class SiteSettings
{
    public int Id { get; set; }
    public string BrandName { get; set; } = "Exprimer";
    public string Tagline { get; set; } = string.Empty;
    public string PhonePrimary { get; set; } = string.Empty;
    public string PhoneSecondary { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string LinkedIn { get; set; } = "https://www.linkedin.com/company/exprimer-group/";
    public string Instagram { get; set; } = "https://www.instagram.com/exprimergroup/";
    public string Facebook { get; set; } = string.Empty;
}

public class Page
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public List<PageSection> Sections { get; set; } = [];
}

public class PageSection
{
    public int Id { get; set; }
    public int PageId { get; set; }
    public Page? Page { get; set; }
    public string Type { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
    public string PayloadJson { get; set; } = "{}";
}

public class LeadEnquiry
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Interest { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public class LeadEnquiryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Interest { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class PageSectionDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public object? Data { get; set; }
}

public class PageDto
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
    public List<PageSectionDto> Sections { get; set; } = [];
}

public class UpdateSectionRequest
{
    public string PayloadJson { get; set; } = "{}";
    public bool? IsVisible { get; set; }
    public int? SortOrder { get; set; }
}

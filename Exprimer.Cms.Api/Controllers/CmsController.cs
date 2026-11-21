using System.Text.Json;
using Exprimer.Cms.Api.Data;
using Exprimer.Cms.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Exprimer.Cms.Api.Controllers;

[ApiController]
[Route("api")]
public class CmsController(CmsDbContext db) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    [HttpGet("settings")]
    public async Task<ActionResult<SiteSettings>> GetSettings()
    {
        var settings = await db.SiteSettings.AsNoTracking().FirstOrDefaultAsync();
        return settings is null ? NotFound() : Ok(settings);
    }

    [HttpPut("settings")]
    public async Task<ActionResult<SiteSettings>> UpdateSettings([FromBody] SiteSettings request)
    {
        var settings = await db.SiteSettings.FirstOrDefaultAsync(s => s.Id == 1);
        if (settings is null)
        {
            return NotFound();
        }

        settings.BrandName = request.BrandName;
        settings.Tagline = request.Tagline;
        settings.PhonePrimary = request.PhonePrimary;
        settings.PhoneSecondary = request.PhoneSecondary;
        settings.Email = request.Email;
        settings.WhatsApp = request.WhatsApp;
        settings.LinkedIn = request.LinkedIn;
        settings.Instagram = request.Instagram;
        settings.Facebook = request.Facebook;
        await db.SaveChangesAsync();
        return Ok(settings);
    }

    [HttpGet("pages")]
    public async Task<ActionResult<IEnumerable<object>>> ListPages()
    {
        var pages = await db.Pages.AsNoTracking()
            .OrderBy(p => p.Slug)
            .Select(p => new { p.Id, p.Slug, p.Title, p.IsPublished })
            .ToListAsync();
        return Ok(pages);
    }

    [HttpGet("pages/{slug}")]
    public async Task<ActionResult<PageDto>> GetPage(string slug)
    {
        var page = await db.Pages.AsNoTracking()
            .Include(p => p.Sections)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

        if (page is null)
        {
            return NotFound();
        }

        var dto = new PageDto
        {
            Slug = page.Slug,
            Title = page.Title,
            SeoDescription = page.SeoDescription,
            Sections = page.Sections
                .Where(s => s.IsVisible)
                .OrderBy(s => s.SortOrder)
                .Select(s => new PageSectionDto
                {
                    Id = s.Id,
                    Type = s.Type,
                    SortOrder = s.SortOrder,
                    Data = JsonSerializer.Deserialize<object>(s.PayloadJson, JsonOptions)
                })
                .ToList()
        };

        return Ok(dto);
    }

    [HttpPut("sections/{id:int}")]
    public async Task<IActionResult> UpdateSection(int id, [FromBody] UpdateSectionRequest request)
    {
        var section = await db.PageSections.FirstOrDefaultAsync(s => s.Id == id);
        if (section is null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.PayloadJson))
        {
            section.PayloadJson = request.PayloadJson;
        }

        if (request.IsVisible.HasValue)
        {
            section.IsVisible = request.IsVisible.Value;
        }

        if (request.SortOrder.HasValue)
        {
            section.SortOrder = request.SortOrder.Value;
        }

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("leads")]
    public async Task<IActionResult> CreateLead([FromBody] LeadEnquiryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { message = "Name and email are required." });
        }

        if (!request.ConsentAccepted)
        {
            return BadRequest(new { message = "Consent is required to process personal data." });
        }

        var now = DateTime.UtcNow;
        var lead = new LeadEnquiry
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone?.Trim() ?? string.Empty,
            Company = request.Company?.Trim() ?? string.Empty,
            Interest = request.Interest?.Trim() ?? string.Empty,
            Message = request.Message?.Trim() ?? string.Empty,
            ConsentAccepted = true,
            ConsentAtUtc = now,
            CreatedAtUtc = now
        };

        db.LeadEnquiries.Add(lead);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(ListLeads), new { id = lead.Id }, new { lead.Id, message = "Enquiry received." });
    }

    [HttpGet("leads")]
    public async Task<ActionResult<IEnumerable<LeadEnquiry>>> ListLeads()
    {
        var leads = await db.LeadEnquiries.AsNoTracking()
            .OrderByDescending(l => l.CreatedAtUtc)
            .ToListAsync();
        return Ok(leads);
    }

    [HttpPost("resumes")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<IActionResult> CreateResume(
        [FromForm] string name,
        [FromForm] string email,
        [FromForm] string? phone,
        [FromForm] string? role,
        [FromForm] string? message,
        [FromForm] bool consentAccepted,
        IFormFile? resume)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new { message = "Name and email are required." });
        }

        if (!consentAccepted)
        {
            return BadRequest(new { message = "Consent is required to process personal data." });
        }

        if (resume is null || resume.Length == 0)
        {
            return BadRequest(new { message = "Resume file is required." });
        }

        const long maxBytes = 5 * 1024 * 1024;
        if (resume.Length > maxBytes)
        {
            return BadRequest(new { message = "Resume must be 5 MB or smaller." });
        }

        var extension = Path.GetExtension(resume.FileName).ToLowerInvariant();
        var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".pdf", ".doc", ".docx" };
        if (!allowed.Contains(extension))
        {
            return BadRequest(new { message = "Only PDF, DOC, or DOCX resumes are accepted." });
        }

        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "resumes");
        Directory.CreateDirectory(uploads);
        var storedName = $"{Guid.NewGuid():N}{extension}";
        var path = Path.Combine(uploads, storedName);

        await using (var stream = System.IO.File.Create(path))
        {
            await resume.CopyToAsync(stream);
        }

        var now = DateTime.UtcNow;
        var submission = new ResumeSubmission
        {
            Name = name.Trim(),
            Email = email.Trim(),
            Phone = phone?.Trim() ?? string.Empty,
            Role = role?.Trim() ?? string.Empty,
            Message = message?.Trim() ?? string.Empty,
            OriginalFileName = Path.GetFileName(resume.FileName),
            StoredFileName = storedName,
            ContentType = resume.ContentType ?? "application/octet-stream",
            FileSizeBytes = resume.Length,
            ConsentAccepted = true,
            ConsentAtUtc = now,
            CreatedAtUtc = now
        };

        db.ResumeSubmissions.Add(submission);
        await db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(ListResumes),
            new { id = submission.Id },
            new { submission.Id, message = "Resume received." });
    }

    [HttpGet("resumes")]
    public async Task<ActionResult<IEnumerable<object>>> ListResumes()
    {
        var items = await db.ResumeSubmissions.AsNoTracking()
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Email,
                r.Phone,
                r.Role,
                r.Message,
                r.OriginalFileName,
                r.FileSizeBytes,
                r.CreatedAtUtc
            })
            .ToListAsync();
        return Ok(items);
    }
}

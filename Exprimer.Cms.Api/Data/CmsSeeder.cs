using System.Text.Json;
using Exprimer.Cms.Api.Models;

namespace Exprimer.Cms.Api.Data;

public static class CmsSeeder
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static void Seed(CmsDbContext db)
    {
        EnsureSiteSettings(db);

        if (db.Pages.Any())
        {
            return;
        }

        var home = new Page
        {
            Slug = "home",
            Title = "Exprimer | Media, Recruitment & Verification",
            SeoDescription = "Exprimer Group delivers global media distribution, manpower consulting, and AI-powered background verification across 80+ countries.",
            Sections =
            [
                Section("hero", 1, new
                {
                    brand = "Exprimer",
                    eyebrow = "80+ Countries · Global Desk",
                    headline = "Media. Talent. Trust — delivered worldwide.",
                    subheadline = "Content rights, manpower, and verification for ambitious brands.",
                    primaryCta = "Explore verticals",
                    primaryCtaHref = "#services",
                    secondaryCta = "Talk to us",
                    secondaryCtaHref = "#contact",
                    imageUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=80"
                }),
                Section("stats", 2, new
                {
                    items = new[]
                    {
                        new { value = "80+", label = "Countries served" },
                        new { value = "6+", label = "Years partnering" },
                        new { value = "3", label = "Core verticals" },
                        new { value = "AI", label = "Powered diligence" }
                    }
                }),
                Section("services", 3, new
                {
                    id = "services",
                    eyebrow = "Verticals",
                    title = "Built for scale across three worlds.",
                    subtitle = "One house for content distribution, talent acquisition, and trusted verification.",
                    items = new[]
                    {
                        new
                        {
                            slug = "media",
                            title = "Videos & Games",
                            summary = "OTT, VOD and TV rights for platforms that move fast.",
                            description = "Actively engaged partners for 6+ years, managing content for several global OTTs.",
                            accent = "media",
                            imageUrl = "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1600&q=80"
                        },
                        new
                        {
                            slug = "recruitment",
                            title = "Manpower Consulting",
                            summary = "AI-assisted sourcing for high-growth hiring teams.",
                            description = "We connect talent acquisition firms with precision candidate sourcing.",
                            accent = "talent",
                            imageUrl = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80"
                        },
                        new
                        {
                            slug = "verification",
                            title = "Background Verification",
                            summary = "Reliable diligence with AI-backed checks at scale.",
                            description = "Proven partner for trusted, fast background verification worldwide.",
                            accent = "trust",
                            imageUrl = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
                        }
                    }
                }),
                Section("process", 4, new
                {
                    eyebrow = "Method",
                    title = "From brief to global delivery.",
                    steps = new[]
                    {
                        new { number = "01", title = "Discover", text = "Map your market, content needs, and hiring goals." },
                        new { number = "02", title = "Design", text = "Shape a modular plan across media, talent, or verification." },
                        new { number = "03", title = "Deliver", text = "Execute with reach, AI tooling, and clear outcomes." },
                        new { number = "04", title = "Scale", text = "Expand regions on the same trusted operating system." }
                    }
                }),
                Section("cta", 5, new
                {
                    id = "contact",
                    title = "Let’s raise the standard.",
                    subtitle = "Share your brief — we connect within a day.",
                    bullets = new[] { "Dedicated specialists", "Global coverage", "Clear response SLA" },
                    ctaLabel = "Send enquiry"
                }),
                Section("offices", 6, new
                {
                    title = "Studios & offices",
                    items = new[]
                    {
                        new { city = "Gurugram", country = "India", address = "JMD Galleria, Sector 48, Gurugram, Haryana" },
                        new { city = "New Delhi", country = "India", address = "Best Business Square, Sector 20, Dwarka, New Delhi" },
                        new { city = "Newark", country = "USA", address = "254 Chapman Rd, Newark, Delaware 19702" }
                    }
                })
            ]
        };

        var media = ServicePage(
            "media",
            "Media Distribution",
            "Rights that travel. Screens that stay lit.",
            "Premium OTT, VOD, and TV distribution across international markets.",
            "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=2000&q=80",
            new[]
            {
                "OTT & VOD rights packaging",
                "Games & entertainment catalogues",
                "Partner onboarding & territory mapping",
                "Ongoing content operations support"
            });

        var recruitment = ServicePage(
            "recruitment",
            "Manpower Consulting",
            "Talent pipelines built for velocity.",
            "AI-assisted sourcing that connects companies with the right people faster.",
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80",
            new[]
            {
                "AI-powered candidate sourcing",
                "Domestic & international hiring",
                "Role benchmarking & shortlists",
                "End-to-end recruitment support"
            });

        var verification = ServicePage(
            "verification",
            "Background Verification",
            "Diligence you can put on record.",
            "AI-based checks for reliable employee verification at scale.",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80",
            new[]
            {
                "Single & bulk verification",
                "Identity & employment checks",
                "Compliance-ready reporting",
                "Enterprise account workflows"
            });

        db.Pages.AddRange(home, media, recruitment, verification);
        db.SaveChanges();
    }

    private static Page ServicePage(
        string slug,
        string title,
        string headline,
        string summary,
        string imageUrl,
        string[] points)
    {
        return new Page
        {
            Slug = slug,
            Title = $"{title} | Exprimer",
            SeoDescription = summary,
            Sections =
            [
                Section("hero", 1, new
                {
                    brand = "Exprimer",
                    eyebrow = title,
                    headline,
                    subheadline = summary,
                    primaryCta = "Start a conversation",
                    primaryCtaHref = "/home#contact",
                    secondaryCta = "All verticals",
                    secondaryCtaHref = "/home#services",
                    imageUrl
                }),
                Section("feature-list", 2, new
                {
                    title = "What you get",
                    items = points.Select(p => new { text = p }).ToArray()
                }),
                Section("cta", 3, new
                {
                    id = "contact",
                    title = $"Ready to explore {title}?",
                    subtitle = "Tell us your requirement — we respond within a day.",
                    bullets = new[] { "Dedicated specialists", "Global coverage", "Clear SLAs" },
                    ctaLabel = "Send enquiry"
                })
            ]
        };
    }

    private static PageSection Section(string type, int order, object payload) => new()
    {
        Type = type,
        SortOrder = order,
        IsVisible = true,
        PayloadJson = JsonSerializer.Serialize(payload, JsonOptions)
    };

    private static void EnsureSiteSettings(CmsDbContext db)
    {
        const string whatsApp = "917011982275";
        var settings = db.SiteSettings.FirstOrDefault(s => s.Id == 1);
        if (settings is null)
        {
            db.SiteSettings.Add(new SiteSettings
            {
                Id = 1,
                BrandName = "Exprimer",
                Tagline = "Global Experts in Media Distribution, Recruitment & Verification",
                PhonePrimary = "+91-7011982275",
                PhoneSecondary = "+91-9560240010",
                Email = "amit@exprimergroup.com",
                WhatsApp = whatsApp
            });
        }
        else
        {
            settings.BrandName = "Exprimer";
            settings.Tagline = "Global Experts in Media Distribution, Recruitment & Verification";
            settings.PhonePrimary = "+91-7011982275";
            settings.PhoneSecondary = "+91-9560240010";
            settings.Email = "amit@exprimergroup.com";
            settings.WhatsApp = whatsApp;
        }

        db.SaveChanges();
    }
}

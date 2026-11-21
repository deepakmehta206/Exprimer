using System.Text.Json;
using Exprimer.Cms.Api.Models;
using Microsoft.EntityFrameworkCore;

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
        EnsureMediaPage(db);
        EnsureRecruitmentPage(db);
        EnsureVerificationPage(db);

        if (db.Pages.Any(p => p.Slug == "home"))
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
                    primaryCtaHref = "/home#services",
                    secondaryCta = "Talk to us",
                    secondaryCtaHref = "/home#contact",
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

        // Media, recruitment, verification pages managed by Ensure* helpers
        db.Pages.Add(home);
        db.SaveChanges();
    }

    private static void EnsureVerificationPage(CmsDbContext db)
    {
        var existing = db.Pages.Include(p => p.Sections).FirstOrDefault(p => p.Slug == "verification");
        if (existing is not null)
        {
            db.PageSections.RemoveRange(existing.Sections);
            db.Pages.Remove(existing);
            db.SaveChanges();
        }

        db.Pages.Add(BuildVerificationPage());
        db.SaveChanges();
    }

    private static Page BuildVerificationPage() => new()
    {
        Slug = "verification",
        Title = "Background Verification | Exprimer",
        SeoDescription = "Intelligent verification for global teams — paperless, API-first background checks across identity, employment, education, and international compliance.",
        Sections =
        [
            Section("hero", 1, new
            {
                brand = "Exprimer",
                eyebrow = "Global Workforce Platform & Services",
                headline = "Intelligent Verification for Global Teams.",
                subheadline = "One stop for all the background checks you need. We combine expert due diligence with automated technology to keep your business secure.",
                primaryCta = "Book a Free Demo",
                primaryCtaHref = "/verification#contact",
                secondaryCta = "See all checks",
                secondaryCtaHref = "/verification#checks",
                imageUrl = "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=80",
                badges = new[] { "100% Paperless", "API integration", "HRMS integration" }
            }),
            Section("checks", 2, new
            {
                id = "checks",
                eyebrow = "Coverage",
                title = "All the checks you need in one place",
                subtitle = "We ensure safety through expert background verification and due diligence, identifying fraud and minimizing risk.",
                groups = new object[]
                {
                    new
                    {
                        title = "General Checks",
                        items = new[]
                        {
                            new { title = "Education", text = "Confirms school, college, or university attendance and whether the institution is accredited.", imageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Address Check", text = "Verifies current and past residential addresses via documents, utility bills, or field visits.", imageUrl = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Employer Check", text = "Validates employment history for the roles claimed in the candidate’s application.", imageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Global Database", text = "Scans compliance and litigation databases for fraud, sanctions, or criminal watchlists.", imageUrl = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Credit Check", text = "Reviews financial history including loans, defaults, or bankruptcies for integrity risk.", imageUrl = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Reference", text = "Previous managers and colleagues confirm role, performance, behaviour, and exit reasons.", imageUrl = "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Identity Check", text = "Authenticates Aadhaar, PAN, Passport, or Voter ID to prevent impersonation.", imageUrl = "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Form 16 Check", text = "Confirms salary, tax deductions, and employment continuity via Form 16 records.", imageUrl = "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80" },
                            new { title = "PF Verification", text = "Checks EPFO records for employer contributions and employment periods.", imageUrl = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Bank Statement", text = "Reviews salary credits to ensure pay details match employment claims.", imageUrl = "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Passport Check", text = "Verifies passport authenticity and travel history for global-role risk flags.", imageUrl = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80" }
                        }
                    },
                    new
                    {
                        title = "International Checks",
                        items = new[]
                        {
                            new { title = "International IDs", text = "Verifies foreign passports, national IDs, or work permits for authenticity and work eligibility.", imageUrl = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=80" },
                            new { title = "OFAC Check", text = "Ensures the candidate is not listed on U.S. Treasury sanctions for terrorism or illicit trade.", imageUrl = "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Database Check", text = "Scans criminal, regulatory, blacklist, and watchlist databases for compliance risk.", imageUrl = "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&q=80" },
                            new { title = "Social Media Check", text = "Reviews public LinkedIn, Facebook, X, and Instagram presence for credibility and red flags.", imageUrl = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80" }
                        }
                    }
                }
            }),
            Section("showcase", 3, new
            {
                items = new object[]
                {
                    new
                    {
                        eyebrow = "Integrations",
                        title = "API Documentation",
                        text = "Exprimer’s robust API integrates with HRMS, CRM, ERP, and third-party platforms — smoother onboarding, faster verification, uninterrupted workflows.",
                        imageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
                        logoUrl = "/brand/exprimer-logo.png",
                        bullets = new[] { "HRMS-ready connectors", "Flexible REST endpoints", "Faster candidate onboarding" },
                        ctaLabel = "Book a Free Demo",
                        ctaHref = "/verification#contact",
                        reverse = false
                    },
                    new
                    {
                        eyebrow = "Operations",
                        title = "Live dashboard",
                        text = "Stay updated on verification progress in real time — with 24×7 support and a dedicated candidate helpline.",
                        imageUrl = "https://images.unsplash.com/photo-1551281049-9a0b734ef844?auto=format&fit=crop&w=1400&q=80",
                        logoUrl = "/brand/exprimer-logo.png",
                        bullets = new[] { "Real-time case status", "24×7 Support", "Candidate Helpline" },
                        ctaLabel = "Book free Demo",
                        ctaHref = "/verification#contact",
                        reverse = true
                    },
                    new
                    {
                        eyebrow = "Candidate experience",
                        title = "Candidate Support Center",
                        text = "End-to-end guided onboarding — verification anytime, anywhere across mobile, laptop, or desktop.",
                        imageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
                        logoUrl = "/brand/exprimer-logo.png",
                        bullets = new[] { "Self-serve FAQs", "Video Tutorials", "Easy-to-use Interface" },
                        ctaLabel = "Book a Demo",
                        ctaHref = "/verification#contact",
                        reverse = false
                    }
                }
            }),
            Section("trusted", 4, new
            {
                eyebrow = "Awards & Recognition",
                title = "Trusted marks of excellence",
                items = new[]
                {
                    new { name = "Exprimer", logoUrl = "/brand/exprimer-logo.png" },
                    new { name = "ISO Ready", logoUrl = "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=200&q=80" },
                    new { name = "Global Desk", logoUrl = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=200&q=80" },
                    new { name = "Secure Ops", logoUrl = "https://images.unsplash.com/photo-1563986768494-4dee2763ff36?auto=format&fit=crop&w=200&q=80" },
                    new { name = "HR Tech", logoUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80" },
                    new { name = "Compliance", logoUrl = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=200&q=80" },
                    new { name = "Paperless", logoUrl = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=200&q=80" },
                    new { name = "API First", logoUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80" }
                }
            }),
            Section("highlights", 5, new
            {
                eyebrow = "Trust",
                title = "Why Global Leaders Trust Us?",
                subtitle = "Our 100% paperless, API-first architecture transforms background verification from a manual hurdle into a background process.",
                items = new[]
                {
                    new { title = "Global Reach", text = "Coverage across 75+ countries for multi-market hiring.", accent = "trust", imageUrl = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=300&q=80" },
                    new { title = "Dual-Force Desk", text = "Recruitment & verification for Non-IT positions in one stack.", accent = "talent", imageUrl = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=300&q=80" },
                    new { title = "HRMS Integration", text = "Seamless connectors into your existing HR systems.", accent = "media", imageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80" },
                    new { title = "API Efficiency", text = "Paperless workflows that cut HR workload and cycle time.", accent = "trust", imageUrl = "/brand/exprimer-logo.png" },
                    new { title = "Fraud Prevention", text = "Expert diligence that flags impersonation and document risk.", accent = "talent", imageUrl = "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=300&q=80" }
                }
            }),
            Section("stats", 6, new
            {
                items = new[]
                {
                    new { value = "1M+", label = "National Background Checks" },
                    new { value = "40+", label = "Industries Covered" },
                    new { value = "5K+", label = "Satisfied Customers" },
                    new { value = "75+", label = "Countries in network" }
                }
            }),
            Section("faq", 7, new
            {
                eyebrow = "BGV",
                title = "Employee Background Verification — FAQs",
                items = new[]
                {
                    new { question = "What is Employee Background Verification?", answer = "It is the process of verifying a candidate’s identity, education, employment, and legal records to ensure authenticity." },
                    new { question = "Why is background verification important?", answer = "It helps companies reduce hiring risks, prevent fraud, and maintain workplace trust and compliance." },
                    new { question = "What checks are included in background verification?", answer = "Checks may include identity, employment, education, address, criminal record, and reference verification." },
                    new { question = "Is candidate consent required?", answer = "Yes, written or digital consent from the candidate is mandatory before starting any verification." },
                    new { question = "How long does the verification process take?", answer = "Most checks are completed within 2–15 working days, depending on the scope and geography." },
                    new { question = "Is the process confidential?", answer = "Yes, all candidate information is handled securely and kept strictly confidential." },
                    new { question = "Are background checks legally compliant?", answer = "Yes, the process follows applicable data protection and privacy regulations." },
                    new { question = "Can background checks be customized?", answer = "Yes, employers can choose checks based on role, seniority, and business needs." },
                    new { question = "What if discrepancies are found?", answer = "Discrepancies are reported clearly, and candidates are given a chance to explain or clarify." },
                    new { question = "Do you offer international background verification?", answer = "Yes, global background checks are available, subject to country-specific regulations." },
                    new { question = "Which roles require background verification?", answer = "BGV is recommended for all roles, especially senior, finance, IT, and sensitive positions." },
                    new { question = "Can BGV be integrated with HRMS or ATS?", answer = "Yes, API-based integration is available for seamless hiring and onboarding." },
                    new { question = "What documents are required from candidates?", answer = "Common documents include ID proof, address proof, education certificates, and employment records." },
                    new { question = "How accurate are background verification reports?", answer = "Reports are generated through verified sources with documented evidence for high accuracy." },
                    new { question = "Can background checks be done for existing employees?", answer = "Yes, companies can conduct checks for current employees during audits or role changes." }
                }
            }),
            Section("cta", 8, new
            {
                id = "contact",
                title = "Contact Sales",
                subtitle = "Helping businesses build reliable teams with smart hiring and intelligent background verification solutions. Our specialized recruitment agency uses data-driven insights to find elite talent, while our AI-integrated engine clears them in record time.",
                bullets = new[] { "Non-IT Hiring Expertise", "Paperless Verification", "Reduced HR Workload" },
                ctaLabel = "Submit"
            })
        ]
    };

    private static void EnsureRecruitmentPage(CmsDbContext db)
    {
        var existing = db.Pages.Include(p => p.Sections).FirstOrDefault(p => p.Slug == "recruitment");
        if (existing is not null)
        {
            db.PageSections.RemoveRange(existing.Sections);
            db.Pages.Remove(existing);
            db.SaveChanges();
        }

        db.Pages.Add(BuildRecruitmentPage());
        db.SaveChanges();
    }

    private static Page BuildRecruitmentPage() => new()
    {
        Slug = "recruitment",
        Title = "Manpower Consulting | Exprimer",
        SeoDescription = "AI-powered global workforce platform — Non-IT recruitment, executive search, and talent acquisition across India and internationally.",
        Sections =
        [
            Section("hero", 1, new
            {
                brand = "Exprimer",
                eyebrow = "Global Manpower Consulting",
                headline = "Revolutionizing Recruitment Using AI Technology",
                subheadline = "Reduce bias, speed up hiring, and find the best candidates — specializing in Non-IT recruitment across India and internationally.",
                primaryCta = "Book a free demo",
                primaryCtaHref = "/recruitment#contact",
                secondaryCta = "See how AI helps",
                secondaryCtaHref = "/recruitment#process",
                imageUrl = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80"
            }),
            Section("industry-mix", 2, new
            {
                eyebrow = "Talent that fits",
                title = "The right hire, in less time",
                subtitle = "We specialize in providing the right talent to companies faster — Talent Acquisition, Global Recruitment, and Executive Search.",
                items = new[]
                {
                    new { label = "Manufacturing, Healthcare, FMCG", value = "40%", percent = 40 },
                    new { label = "Energy, Chemicals, Logistics", value = "35%", percent = 35 },
                    new { label = "Retail, Hospitality, Education", value = "25%", percent = 25 }
                }
            }),
            Section("highlights", 3, new
            {
                eyebrow = "Excellence",
                title = "Exprimer’s excellence in every hire",
                subtitle = "AI-assisted sourcing with human judgment where it matters.",
                items = new[]
                {
                    new { title = "AI-Powered Sourcing", text = "Rapidly identify top candidates globally.", accent = "talent" },
                    new { title = "Unbiased Recruitment", text = "AI supports fair assessment across every shortlist.", accent = "media" },
                    new { title = "Cost & Time Efficiency", text = "Streamlined hiring that reduces overheads.", accent = "trust" },
                    new { title = "Tailored Solutions", text = "Custom hiring strategies for mid-to-C level roles.", accent = "talent" }
                }
            }),
            Section("process", 4, new
            {
                id = "process",
                eyebrow = "Optimize time",
                title = "Screen → Shortlist, simplified",
                steps = new[]
                {
                    new { number = "01", title = "SCREEN", text = "AI-powered screening of 1000+ candidates — skills, experience, and notice period matched instantly." },
                    new { number = "02", title = "SHORTLIST", text = "AI-managed first interview assessing communication, problem-solving, and job fit with clear insights." },
                    new { number = "03", title = "PLACE", text = "Human recruiters close the loop with clients for mid-to-C level Non-IT hiring." }
                }
            }),
            Section("stats", 5, new
            {
                items = new[]
                {
                    new { value = "10+", label = "Years of industry experience" },
                    new { value = "5K+", label = "Careers made" },
                    new { value = "40+", label = "Industries covered" },
                    new { value = "50K+", label = "Online registered jobseekers" }
                }
            }),
            Section("testimonials", 6, new
            {
                eyebrow = "Trust",
                title = "Hear from leaders who trust us",
                items = new[]
                {
                    new { quote = "Exprimer cut our mid-senior hiring cycle dramatically without compromising quality.", name = "Operations Head", role = "Manufacturing · India" },
                    new { quote = "Their Non-IT desk understands role nuance — shortlists feel interview-ready.", name = "HR Director", role = "Healthcare group" },
                    new { quote = "AI screening plus recruiter judgment is the balance we needed for scale hiring.", name = "Talent Lead", role = "FMCG · GCC" }
                }
            }),
            Section("roles", 7, new
            {
                eyebrow = "Roles we place",
                title = "AI-driven recruitment excellence",
                subtitle = "From leadership to specialist Non-IT roles — plus tech searches when you need them.",
                items = new[]
                {
                    new { label = "Sales Head" },
                    new { label = "Plant Manager" },
                    new { label = "CFO" },
                    new { label = "HRBP" },
                    new { label = "Supply Chain Lead" },
                    new { label = "Brand Manager" },
                    new { label = "CTO" },
                    new { label = "Product Manager" },
                    new { label = "Data Scientist" },
                    new { label = "DevOps" },
                    new { label = "QA Lead" },
                    new { label = "Full Stack Engineer" }
                }
            }),
            Section("resume", 8, new
            {
                id = "resume",
                title = "We specialize in Non-IT hiring and offer Recruitment Solutions, Outsourcing & Staffing, along with AI tools that help companies optimize tasks and hire faster.",
                subtitle = "Fill out the form below to explore the world of opportunities.",
                ctaLabel = "Submit your Resume"
            }),
            Section("cta", 9, new
            {
                id = "contact",
                title = "Contact Sales",
                subtitle = "Helping businesses build reliable teams with smart hiring and intelligent background verification solutions. Our specialized recruitment agency uses data-driven insights to find elite talent, while our AI-integrated engine clears them in record time.",
                bullets = new[] { "Non-IT Hiring Expertise", "Paperless Verification", "Reduced HR Workload" },
                ctaLabel = "Submit"
            })
        ]
    };

    private static void EnsureMediaPage(CmsDbContext db)
    {
        var existing = db.Pages.Include(p => p.Sections).FirstOrDefault(p => p.Slug == "media");
        if (existing is not null)
        {
            db.PageSections.RemoveRange(existing.Sections);
            db.Pages.Remove(existing);
            db.SaveChanges();
        }

        db.Pages.Add(BuildMediaPage());
        db.SaveChanges();
    }

    private static Page BuildMediaPage() => new()
    {
        Slug = "media",
        Title = "Digital Content | Exprimer",
        SeoDescription = "Tailored libraries for regional and global digital video services — OTT, VOD, and premium catalogues across 70+ languages.",
        Sections =
        [
            Section("hero", 1, new
            {
                brand = "Exprimer",
                eyebrow = "Digital Content Provider",
                headline = "Tailored Libraries for Regional and Global Digital Video Services",
                subheadline = "We specialize in geo-targeted, language-specific and platform-tailored premium video content.",
                primaryCta = "Explore library",
                primaryCtaHref = "/media#collections",
                secondaryCta = "Connect with us",
                secondaryCtaHref = "/media#contact",
                imageUrl = "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=2000&q=80"
            }),
            Section("collections", 2, new
            {
                id = "collections",
                eyebrow = "Trending Collections",
                title = "Within 72 hours · 70+ languages",
                subtitle = "Premium catalogues packaged for OTT, VOD, apps, and regional platforms.",
                items = new[]
                {
                    new { title = "Animation", hours = "53 hrs 00 mins", titles = "27 Titles", accent = "media" },
                    new { title = "Cartoon", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "talent" },
                    new { title = "Cooking", hours = "38 hrs 00 mins", titles = "20 Titles", accent = "trust" },
                    new { title = "Cricket", hours = "165 hrs 40 mins", titles = "96 Titles", accent = "media" },
                    new { title = "Fight", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "talent" },
                    new { title = "Finance", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "trust" },
                    new { title = "Horror", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "media" },
                    new { title = "K Drama", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "talent" },
                    new { title = "Plane crash", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "trust" },
                    new { title = "Podcast", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "media" },
                    new { title = "Romance", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "talent" },
                    new { title = "Science", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "trust" },
                    new { title = "Serial Killer", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "media" },
                    new { title = "Sports", hours = "42 hrs 50 mins", titles = "30 Titles", accent = "talent" }
                }
            }),
            Section("stats", 3, new
            {
                items = new[]
                {
                    new { value = "80+", label = "Serving countries" },
                    new { value = "500+", label = "On-board content creators" },
                    new { value = "100+", label = "Merchants" },
                    new { value = "50+", label = "Digital platforms" }
                }
            }),
            Section("audiences", 4, new
            {
                eyebrow = "Who we serve",
                title = "We provide video content services for",
                items = new[]
                {
                    new { text = "OTT media services" },
                    new { text = "Website or game portals" },
                    new { text = "OTT offering teams" },
                    new { text = "App owners" },
                    new { text = "Premium quality video seekers" }
                }
            }),
            Section("trusted", 5, new
            {
                eyebrow = "Trusted by",
                title = "100+ companies",
                items = new[]
                {
                    new { name = "Cheddar" },
                    new { name = "OTT Desk" },
                    new { name = "Studio Hub" },
                    new { name = "Stream Co" },
                    new { name = "Global Play" },
                    new { name = "RightCast" },
                    new { name = "VOD Lab" },
                    new { name = "Screenly" },
                    new { name = "MediaForge" },
                    new { name = "Pulse TV" },
                    new { name = "NovaCast" },
                    new { name = "ReelWorks" },
                    new { name = "SkyFrame" },
                    new { name = "Orbit Media" }
                }
            }),
            Section("cta", 6, new
            {
                id = "contact",
                title = "Take your business to the next level with Exprimer",
                subtitle = "Tell us your catalogue or distribution need — we connect within a day.",
                bullets = new[] { "Self-serve FAQs", "Catalogue walkthroughs", "Clear commercial SLAs" },
                ctaLabel = "Contact sales"
            })
        ]
    };

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
        const string linkedIn = "https://www.linkedin.com/company/exprimer-group/";
        const string instagram = "https://www.instagram.com/exprimergroup/";
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
                WhatsApp = whatsApp,
                LinkedIn = linkedIn,
                Instagram = instagram,
                Facebook = string.Empty
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
            settings.LinkedIn = linkedIn;
            settings.Instagram = instagram;
            settings.Facebook = string.Empty;
        }

        db.SaveChanges();
    }
}

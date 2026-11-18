# Exprimer — Modular Website

Angular 22 frontend + .NET 10 CMS API rebuild of [exprimer.in](https://exprimer.in/).

## Structure

- `exprimer-web` — Angular 22 modular UI (section-based pages + GSAP)
- `Exprimer.Cms.Api` — .NET 10 CMS API (pages, sections, settings, leads)

## Run

Terminal 1 — CMS API:

```bash
cd Exprimer.Cms.Api
dotnet run --launch-profile http
```

API: `http://localhost:5117`

Terminal 2 — Website:

```bash
cd exprimer-web
npm start
```

Site: `http://localhost:4200`

## CMS endpoints

| Method | Path | Use |
|--------|------|-----|
| GET | `/api/settings` | Site contact/brand |
| PUT | `/api/settings` | Update settings |
| GET | `/api/pages` | List pages |
| GET | `/api/pages/{slug}` | Page + modular sections |
| PUT | `/api/sections/{id}` | Update section JSON / visibility / order |
| POST | `/api/leads` | Enquiry form |
| GET | `/api/leads` | List enquiries |

Content is seed-loaded in memory for local demo. Swap `UseInMemoryDatabase` for SQL Server/PostgreSQL when going production.

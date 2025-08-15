# 📚 IDPRO Smart Cards - Complete Development Guide

*Gebaseerd op het oorspronkelijke 87-vragen plan, aangepast voor Next.js stack*

## 🎯 Project Visie & Scope

### **Doelgroep & Probleem (Vraag 1)**
**Doelgroep:** Grotere bedrijven met meerdere vestigingen, teams en solo gebruikers  
**Probleem:** Orde scheppen in het opslaan van data via duidelijke structuur, zoeken, filteren en verrijken met bijlagen, notities, logboeken.

### **Oplossing:**
- 📊 Alle data via duidelijke structuur opslaan
- 🔍 Zoeken, filteren en verrijken met bijlagen
- 📧 E-mail afhandeling via dit systeem
- 📅 Planning, agenda functie, kanban
- 🗄️ Data archiveren en aanpassen
- 🗑️ Prullenbak met 60 dagen bewaring
- 🤖 AI integratie

## 🏢 Organisatie Hiërarchie & Rollen

### **Hiërarchie Niveaus (Vraag 3 - Uitbreidbaar)**
```
Concern
├── Divisie/Regio  
│   ├── Organisatie
│   │   ├── Vestiging
│   │   │   ├── Team
│   │   │   │   ├── Solo
│   │   │   │   │   ├── Project
│   │   │   │   │   │   └── Kaart
```

**Database Implementatie:**
```sql
-- Flexibele hiërarchie (uitbreidbaar)
CREATE TABLE org_levels (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES org_levels(id),
    level_type VARCHAR(50), -- 'concern', 'divisie', 'organisatie', etc.
    name VARCHAR(255),
    slug VARCHAR(100),
    organization_id UUID REFERENCES organizations(id)
);
```

### **Gebruikersrollen (Vraag 2 - Flexibel)**
- **Owner** - Volledig beheer
- **Admin** - Organisatie beheer
- **Manager** - Team beheer  
- **Editor** - Content beheer
- **Viewer** - Alleen lezen
- **Guest** - Beperkte toegang

## 📁 Data Structuur & Opslag

### **v1 Datatypen (Vraag 4)**
1. ✅ **Kaarten** (met velden + bijlagen) - WERKEND
2. ✅ **Bestanden/opslag** - WERKEND  
3. ✅ **Mappenstructuur** zoals Windows Verkenner - WERKEND

### **Mappen & Kaarten Configuratie (Vraag 5-6)**
- ✅ Mappen kunnen onbeperkt genest worden
- ✅ Kaart hoort in één primaire map + gekoppeld aan meerdere mappen (aliases)
- ✅ Verplaatsen mogelijk voor mappen en kaarten
- ✅ Rechten erven van bovenliggende map
- ✅ Namen uniek binnen dezelfde map
- ✅ Prullenbak met 60 dagen soft delete
- ✅ Sorteren op naam, type, datum

**Autorisatie Regels:**
- **Delen:** Meest-restrictief (alle gekoppelde mappen)
- **Gebruiker toegang:** Volgt primaire map

### **Kaart Types (Vraag 53-54)**
```javascript
// v1 Kaart Types
const cardTypes = {
  standard: {
    name: "Standard Card",
    fields: ["title", "body", "tags"]
  },
  project: {
    name: "Project",
    fields: ["title", "status", "priority", "start_date", "end_date", "assignee"],
    validation: {
      status: ["open", "in_progress", "completed"],
      priority: ["low", "medium", "high"]
    }
  },
  contact: {
    name: "Contact", 
    fields: ["title", "company", "email", "phone", "role"],
    validation: {
      email: "required"
    }
  },
  document: {
    name: "Document",
    fields: ["title", "version", "source", "confidentiality", "expiry_date"],
    validation: {
      version: "semver", // x.y.z
      confidentiality: ["public", "internal", "confidential"]
    }
  }
};
```

## 🗄️ Database Schema (Complete IDPRO Setup)

### **Huidige Status: 19 Tabellen**
```sql
-- Basis tabellen (WERKEND)
organizations, users, org_memberships
folders, cards, card_types, attachments
card_comments, card_folder_links

-- Advanced features (KLAAR VOOR IMPLEMENTATIE)  
share_links, magic_links, email_queue
audit_logs, notification_preferences
subscription_plans, user_sessions
roles, permissions, org_levels
```

### **Database Configuratie (Vraag 14-15)**
- **Database:** PostgreSQL 16 (niet SQLite)
- **Multi-tenancy:** Shared schema + Row Level Security (RLS)
- **Performance:** Indexen voor 100k+ gebruikers
- **Connection:** Docker container: `postgresql://webapp:secure123@postgres:5432/webapp_dev`

## 🔐 Authentication & Security

### **Inlogmethoden v1 (Vraag 16)**
- ✅ **E-mail + wachtwoord** - WERKEND
- ✅ **Magic link (e-mail)** - WERKEND

**Later uitbreiden met:**
- SSO: Microsoft 365, Google Workspace, SAML 2.0
- 2FA: TOTP, Passkeys/WebAuthn

### **JWT Configuratie (Vraag 17)**
```javascript
// Token strategie: korte access + roterende refresh
ACCESS_TOKEN_EXPIRE_MINUTES: 15
REFRESH_TOKEN_EXPIRE_DAYS: 30
JWT_SECRET: 'your-super-secret-jwt-key'
```

### **SMTP Configuration (Vraag 18-19)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=idpro1@gmail.com
SMTP_FROM_NAME=IDPRO Login
SMTP_USE_TLS=true
SMTP_RATE_LIMIT=60  # mails/hour
```

## 💰 Pricing & Plans (Vraag 21-24)

### **Abonnementen (Per Gebruiker)**
```javascript
const plans = {
  free: {
    price: 0,
    storage: "200 MB",
    features: ["basic_cards", "limited_folders"],
    trial: false
  },
  solo: {
    price_month: 9.99,
    price_year: 99.00,
    storage: "1 GB + 1GB/jaar loyaliteit",
    features: ["all_card_types", "custom_fields", "ai_features"],
    trial: "30 dagen"
  },
  team: {
    price_month: 9.99, 
    price_year: 99.00,
    storage: "1 GB + 1GB/jaar loyaliteit per gebruiker",
    features: ["team_collaboration", "advanced_sharing"],
    trial: "30 dagen"
  },
  enterprise: {
    price: "Op aanvraag",
    storage: "Onbeperkt",
    features: ["sso", "audit_logs", "advanced_permissions"],
    trial: "30 dagen"
  }
};
```

### **Storage & Limits (Vraag 22-23)**
- **Free:** 200 MB, geen loyaliteitsbonus
- **Paid:** 1 GB + 1 GB per aaneengesloten jaar
- **Loyaliteitsbonus:** vervalt bij onderbreking/downgrade
- **Geen max gebruikers/teams** (instelbaar door admin)

## 🔍 Search & AI Features

### **Zoeken v1 (Vraag 12)**
```javascript
// Search configuratie
const searchConfig = {
  scope: "full_text", // titel, body, tags
  filters: ["type", "tags", "owner", "date", "status", "attachments"],
  sorting: "last_modified_desc",
  pagination: 50,
  saved_views: true,
  implementation: "postgresql_fts" // later upgrade naar dedicated search
};
```

### **AI Features v1 (Vraag 29)**
1. ✅ **Auto-tags & velden** - bij upload labels en trefwoorden
2. ✅ **Slimme zoektips** - semantische zoekopdrachten

**Later uitbreiden:**
- Samenvatten van kaarten + bijlagen
- Structuurcoach voor mappen/types
- E-mail triage
- Generatieve templates

## 📧 Email Integration

### **Inkomende E-mail (Vraag 67-68)**
```javascript
// v1: Gmail plus-addressing
const emailConfig = {
  incoming: "idpro1+{orgslug}@gmail.com",
  routing: "inbox_folder", // alles naar Inbox
  mapping: {
    subject: "title",
    body: "body", 
    attachments: "attachments"
  },
  security: "spf_dkim_pass",
  limits: {
    max_size: "25 MB",
    per_attachment: "plan_limits" // Free: 10MB, Paid: 100MB
  }
};
```

## 🔗 Sharing & External Access

### **Magic Links & Gasten (Vraag 26-28)**
```javascript
const sharingConfig = {
  external_guests: {
    auto_create: "free_account_via_magic_link",
    permissions: "view_and_comment",
    further_sharing: true // via magic link
  },
  link_settings: {
    default_expiry: "30 dagen",
    password_protection: "optional",
    download_allowed: true,
    owner_notification: true,
    max_share_depth: 1 // gast mag delen, diens gast niet
  }
};
```

## 🖥️ Technical Stack & Infrastructure

### **Huidige Stack:**
- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL 16 + Redis 7
- **Deployment:** Docker Compose op TransIP VPS
- **Reverse Proxy:** Tijdelijk pad-based, later Caddy wildcard

### **File Storage (Vraag 8-10)**
```javascript
// v1: Lokaal, later cloud
const storageConfig = {
  location: "./storage", // lokaal
  organization: "content_addressed_deduplication",
  structure: "/{env}/storage/{tenantSlug}/{yy}/{mm}/{hash}/",
  preview: ["images", "pdf"],
  versioning: false // v1, later wel
};
```

### **Performance Targets (Vraag 38)**
```javascript
const performanceTargets = {
  concurrent_users: 2000,
  latency_p95: {
    folder_open: "< 150ms",
    search: "< 300ms", 
    card_save: "< 200ms"
  },
  dataset_size: {
    cards: "50k per tenant",
    attachments: "200k per tenant"
  },
  rate_limits: {
    per_ip: "100 req/min",
    per_user: "300 req/min",
    uploads: "10 parallel"
  }
};
```

## 🌍 Internationalization (Vraag 52)

### **Multi-language Support**
```javascript
const i18nConfig = {
  ui_languages: ["nl", "en"], // start met NL en EN
  content_translation: {
    method: "ai_translation_with_user_editing",
    per_card: "multiple_language_versions",
    ai_provider: "openai" // of azure
  },
  user_preferences: {
    language: "per_user",
    timezone: "per_user", // default: Europe/Amsterdam
    date_format: "DD-MM-YYYY",
    currency: "EUR"
  }
};
```

## 🔒 Privacy & Compliance (Vraag 25)

### **GDPR & Security**
```javascript
const complianceConfig = {
  data_location: "EU (NL voorkeur)",
  audit_trail: {
    actions: ["create", "edit", "move", "share", "login", "export"],
    retention: "365 dagen",
    read_actions: false // alleen schrijfacties in v1
  },
  data_export: {
    formats: ["json", "csv", "zip"],
    scope: ["cards", "attachments", "folder_structure", "users"]
  },
  right_to_be_forgotten: {
    soft_delete: "60 dagen",
    hard_delete: "na prullenbak periode",
    backup_overwrite: "30 dagen"
  },
  encryption: {
    in_transit: "TLS",
    at_rest: "PostgreSQL disk encryption + encrypted file storage"
  }
};
```

## 🚀 Implementation Roadmap

### **Phase 1: Core Features (VOLTOOID)**
- ✅ Modulaire architectuur (13 bestanden)
- ✅ Basic kaarten & folders
- ✅ Authentication system
- ✅ File uploads
- ✅ Clickable cards met details

### **Phase 2: Enhanced Features (TODO)**
- [ ] 🔍 Zoeken en filteren
- [ ] ✏️ Kaarten bewerken 
- [ ] 📁 Folder management (create/edit)
- [ ] 🏷️ Card types & custom fields
- [ ] 📎 Betere file preview

### **Phase 3: Collaboration (LATER)**
- [ ] 👥 Teams & roles
- [ ] 🔗 External sharing
- [ ] 📧 Email integration
- [ ] 💬 Comments & mentions

### **Phase 4: Advanced (ENTERPRISE)**
- [ ] 🤖 AI features
- [ ] 📊 Analytics & dashboard
- [ ] 🔌 API & integrations
- [ ] 🏢 SSO & enterprise features

## 🛠️ Development Workflow

### **Adding New Features:**
1. **API Route:** `src/app/api/[feature]/route.js`
2. **API Function:** Add to `src/lib/api.js`
3. **Hook (optional):** `src/hooks/use[Feature].js`
4. **Component:** `src/components/[category]/[Feature].js`
5. **Integration:** Import in `src/app/page.js`

### **Code Standards:**
- 📦 Max 80 regels per bestand
- 🔧 Herbruikbare componenten
- 📝 Duidelijke namen
- 🧪 Test voordat je commit
- 📋 Een feature per keer

### **Database Migrations:**
```sql
-- Nieuwe features via PostgreSQL
-- Gebruik bestaande pool connectie:
-- postgresql://webapp:secure123@postgres:5432/webapp_dev
```

## 📞 Support & Continuity

### **Voor Nieuwe Claude Chats:**
```
Deel altijd:
1. GitHub: https://github.com/JulianGroenendijk/idpro-smart-cards-v2
2. Status: "Werkende Next.js app met modulaire architectuur"
3. Plan: "Gebaseerd op 87-vragen IDPRO plan"
4. Stack: "Next.js + PostgreSQL + Docker"
5. Context: "Ik ben een leek, stap-voor-stap uitleg nodig"
```

### **Emergency Commands:**
```bash
# Check status
docker ps
docker logs secure-webapp_webapp_1 --tail 10
git status

# Quick fix
docker restart secure-webapp_webapp_1
git checkout HEAD~1  # ga 1 commit terug
```

---

**🎯 Dit document is je complete roadmap - gebaseerd op je oorspronkelijke visie!** 📚  
**📅 Laatste Update:** Modulaire refactor compleet + 87-vragen alignment  
**🚀 Volgende:** Kies uit Phase 2 features

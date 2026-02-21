# traveling.prof – Landing Page v2

Professionelle Landing Page für [@traveling.prof](https://www.instagram.com/traveling.prof).

## Features

- ✅ **Helles Design** (Weiß/Beige) mit orangenen Highlights
- ✅ **Hero-Bild** – Platzhalter für persönliches Foto (ersetze `/public/hero.jpg`)
- ✅ **Header-Video** – Platzhalter für Urlaubsvideo (`/public/hero-video.mp4`)
- ✅ **Travel-Hack-Finder** – Interaktives Abfrage-Tool (Custom GPT ready)
- ✅ **Erfolgsgeschichten** – Community Proof-Section
- ✅ **Freebies-Bereich** – Kostenlose Downloads
- ✅ **Community-Login** – Wartelist / Login-Form (Backend-Integration nötig)
- ✅ **ProvenExpert Badge** – Bewertungsanzeige
- ✅ **Kreditkarten-Referral** – Empfehlungs-Karten wie Linktree-Style
- ✅ **Impressum & Datenschutz** – Eigene Unterseiten, bereit zum Ausfüllen
- ✅ **Calendly-Platzhalter** – Terminbuchung ready
- ✅ **Stripe & PayPal** – Integration-Badges (Aktivierung bei Bedarf)
- ✅ **Stan Store** – Platzhalter für Shop-Integration
- ✅ **Performance** – Static Site Generation, kein externes CSS-Framework

## Nächste Schritte

1. **Hero-Bild**: Eigenes Foto als `/public/hero.jpg` ablegen
2. **Hero-Video**: Urlaubsvideo als `/public/hero-video.mp4` ablegen
3. **Referral-Links**: Echte Affiliate-Links in der Kreditkarten-Section eintragen
4. **Impressum/Datenschutz**: Persönliche Daten eintragen
5. **Custom GPT**: API-Anbindung im TravelHackFinder implementieren
6. **Community**: Backend (z.B. Supabase) für Login & Bonussystem anbinden
7. **Stripe/PayPal**: Checkout-Integration bei Bedarf
8. **Calendly**: Widget-Code einbetten
9. **ProvenExpert**: Echten Widget-Code von ProvenExpert einbinden

## Deployment

```bash
npm install
npm run dev     # Lokal starten
npm run build   # Produktionsbuild
```

Push auf GitHub → Import in Vercel → Deploy.

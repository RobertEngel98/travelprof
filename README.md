# traveling.prof – Landing Page

Next.js Landing Page für [traveling.prof](https://www.instagram.com/traveling.prof) – Travel Hacks, Meilen & Luxusreisen.

## Deployment auf Vercel

### Option A: Direkt über GitHub (empfohlen)

1. **Neues GitHub-Repository erstellen** auf [github.com/new](https://github.com/new)

2. **Projekt hochladen:**
   ```bash
   cd traveling-prof
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/traveling-prof.git
   git push -u origin main
   ```

3. **Bei Vercel deployen:**
   - [vercel.com](https://vercel.com) → Mit GitHub einloggen
   - "Add New..." → "Project" → Repository auswählen
   - Deploy klicken – fertig!

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

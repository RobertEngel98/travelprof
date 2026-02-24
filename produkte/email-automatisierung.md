# E-Mail-Automatisierung: Welcome Sequence

## traveling.prof -- Willkommens-Sequenz

**Marke:** traveling.prof
**Betreiber:** Robert (@traveling.prof)
**Themen:** Travel Hacking, Meilen sammeln, Luxusreisen, Kreditkarten-Strategien
**Zielmarkt:** DACH (Deutschland, Oesterreich, Schweiz)
**Sprache:** Deutsch, informelles "du"
**Tonalitaet:** Persoenlich, warm, professionell, wie ein guter Freund der sein Wissen teilt

---

## Inhaltsverzeichnis

1. [Technisches Setup](#technisches-setup)
2. [Double-Opt-In Bestaetigungsmail](#double-opt-in-bestaetigungsmail)
3. [Email 1: Willkommen (Tag 0)](#email-1-willkommen--tag-0)
4. [Email 2: Bester Travel Hack (Tag 2)](#email-2-bester-travel-hack--tag-2)
5. [Email 3: Kreditkarten-Tipp (Tag 4)](#email-3-kreditkarten-tipp--tag-4)
6. [Email 4: Lounge-Geheimnis (Tag 6)](#email-4-lounge-geheimnis--tag-6)
7. [Email 5: Tripwire-Angebot (Tag 8)](#email-5-tripwire-angebot--tag-8)
8. [Email 6: Crashkurs-Vorstellung (Tag 11)](#email-6-crashkurs-vorstellung--tag-11)
9. [Email 7: Community-Einladung (Tag 14)](#email-7-community-einladung--tag-14)
10. [Rechtliche Hinweise](#rechtliche-hinweise)
11. [n8n Workflow-Konzept](#n8n-workflow-konzept)

---

## Technisches Setup

### Empfohlener Anbieter: Brevo (ehemals Sendinblue)

**Warum Brevo:**
- Server in der EU (Frankfurt) -- DSGVO-konform
- Auftragsverarbeitungsvertrag (AVV) direkt abschliessbar
- Double-Opt-In nativ unterstuetzt
- Automation-Workflows visuell erstellbar
- Kostenguenstiger Einstieg (Free-Tier: 300 Mails/Tag)
- API fuer n8n-Integration vorhanden
- Deutsche Oberflaeche verfuegbar

**Empfohlener Plan:** Starter (ab 19 EUR/Monat, 20.000 Mails/Monat)

### Einrichtung

1. **Brevo-Konto erstellen** unter brevo.com
2. **Domain verifizieren:** traveling.prof
3. **DNS-Eintraege setzen:**
   - SPF-Record
   - DKIM-Record
   - DMARC-Record (empfohlen: `v=DMARC1; p=quarantine`)
4. **Absender-Adresse:** robert@traveling.prof
5. **Absender-Name:** Robert von traveling.prof
6. **Reply-To:** robert@traveling.prof (persoenliche Antworten ermoeglichen)

### Listen & Segmente

| Liste/Segment | Beschreibung |
|---|---|
| `welcome-sequence` | Alle neuen Subscriber in der Welcome-Sequenz |
| `leadmagnet-xyz` | Segment nach Freebie-Typ (z.B. Meilen-Guide, Buchungs-Checkliste) |
| `tripwire-kaeufer` | Hat Tripwire-Produkt gekauft (von Tripwire-Mail ausschliessen) |
| `crashkurs-kaeufer` | Hat Crashkurs gekauft (von Crashkurs-Mail ausschliessen) |
| `engaged` | Hat in letzten 30 Tagen geoeffnet/geklickt |
| `vip` | Hat mindestens 1 Produkt gekauft |

### Tags

- `source:instagram` / `source:website` / `source:ad`
- `freebie:meilen-guide` / `freebie:buchungs-checkliste` / etc.
- `bought:tripwire` / `bought:crashkurs` / `bought:masterclass`
- `welcome-sequence:active` / `welcome-sequence:completed`

---

## Double-Opt-In Bestaetigungsmail

> **Hinweis:** Diese Mail wird automatisch von Brevo versendet, sobald jemand das Opt-in-Formular absendet. Sie ist gesetzlich vorgeschrieben und muss VOR der Welcome-Sequenz verschickt werden.

**Absender:** Robert von traveling.prof
**Absender-Adresse:** robert@traveling.prof
**Betreff:** Bitte bestaetigen: Dein Zugang zu traveling.prof
**Preview-Text:** Ein Klick und du bist dabei -- dein Freebie wartet schon.

---

**Mail-Body:**

```
Hey!

Schoen, dass du dabei bist.

Bevor ich dir dein Freebie schicken kann, brauche ich kurz deine Bestaetigung -- ist leider Pflicht, aber dauert nur einen Klick:

[BUTTON: Ja, ich will dabei sein!]
{Bestaetigung-Link}

Sobald du geklickt hast, bekommst du sofort deine erste Mail mit dem Download-Link.

Falls du dich nicht angemeldet hast, kannst du diese Mail einfach ignorieren.

Bis gleich!

Robert
traveling.prof

---

Du erhaeltst diese Mail, weil du dich auf traveling.prof angemeldet hast.
Wenn du dich nicht angemeldet hast, musst du nichts tun -- du wirst keine weiteren Mails erhalten.
```

**CTA-Button:** "Ja, ich will dabei sein!"
**Button-Link:** {Brevo Double-Opt-In Bestaetigungs-URL}

**Technische Hinweise:**
- Mail muss innerhalb von Sekunden nach Formular-Submit versendet werden
- Kein Marketing-Inhalt in dieser Mail (nur Bestaetigung)
- Nach Klick auf Button: Weiterleitung auf Danke-Seite + Welcome-Sequenz startet

---

## Email 1: Willkommen (Tag 0)

**Versandzeitpunkt:** Sofort nach Double-Opt-In-Bestaetigung (Tag 0)
**Segment/Bedingung:** Alle neuen Subscriber nach erfolgreichem Double-Opt-In
**Tag setzen:** `welcome-sequence:active`

**Betreff:** Willkommen bei traveling.prof -- Dein Freebie wartet
**Preview-Text:** Dein Download ist bereit + was dich die naechsten Tage erwartet.

---

**Mail-Body:**

```
Hey!

Ich bin Robert von traveling.prof und ich freue mich riesig, dass du hier bist.

Kurz zu mir: Ich reise seit Jahren mit Meilen und Punkten um die Welt -- Business Class, 5-Sterne-Hotels, Flughafen-Lounges. Und nein, ich bin kein Millionaer. Ich habe einfach gelernt, wie das System funktioniert.

Genau das moechte ich mit dir teilen.

Aber erstmal -- hier ist dein Download:

[BUTTON: Jetzt Freebie herunterladen]
{Download-Link zum jeweiligen Leadmagnet}

Was dich in den naechsten Tagen erwartet:

- Mein #1 Travel-Hack, mit dem alles angefangen hat
- Der Kreditkarten-Trick, der mir ueber 6.000 EUR im Jahr spart
- Wie du in jede Flughafen-Lounge kommst (auch ohne Vielflieger-Status)
- Exklusive Angebote, die es nur hier gibt

Ich schicke dir alle paar Tage eine Mail mit echtem Mehrwert -- kein Spam, versprochen.

Eine Bitte: Schieb diese Mail in deinen primaeren Posteingang (nicht Promotions/Spam), damit du nichts verpasst. Bei Gmail einfach auf "In primaer verschieben" klicken.

Und falls du mir auf Instagram noch nicht folgst -- da poste ich taeglich Travel Hacks, Deals und Behind-the-Scenes von meinen Reisen:

[BUTTON: Folge mir auf Instagram]
https://instagram.com/traveling.prof

Wenn du Fragen hast, antworte einfach auf diese Mail. Ich lese und beantworte jede Nachricht persoenlich.

Bis in 2 Tagen!

Robert
traveling.prof

P.S. Schau dir das Freebie am besten heute noch an -- der erste Tipp darin hat bei mir alles veraendert.
```

**CTA-Buttons:**
1. "Jetzt Freebie herunterladen" (primaer)
2. "Folge mir auf Instagram" (sekundaer)

---

## Email 2: Bester Travel Hack (Tag 2)

**Versandzeitpunkt:** 2 Tage nach Opt-in, morgens um 08:00 Uhr
**Segment/Bedingung:** `welcome-sequence:active`, NICHT `welcome-sequence:completed`

**Betreff:** Mein #1 Travel-Hack, der alles veraendert hat
**Preview-Text:** Mit diesem simplen Trick spare ich bei jedem Flug hunderte Euro.

---

**Mail-Body:**

```
Hey!

Heute teile ich meinen absoluten Lieblings-Hack mit dir. Das ist der Trick, mit dem bei mir alles angefangen hat -- und der immer noch funktioniert.

Er heisst: Der Open-Jaw-Trick.

Was ist das?

Statt einen normalen Hin- und Rueckflug zu buchen (z.B. Frankfurt -> Bangkok -> Frankfurt), buchst du den Rueckflug von einem anderen Ort:

Frankfurt -> Bangkok -> ... -> Singapur -> Frankfurt

Das "..." in der Mitte ist dein Bonus: Du kannst von Bangkok nach Singapur reisen, wie du willst -- Zug, Bus, Billigflieger, oder einfach ein paar Tage dort verbringen.

Warum ist das genial?

Airlines berechnen den Preis oft basierend auf dem teuersten Segment. Und bei vielen Routenkombinationen ist ein Open-Jaw GUENSTIGER als ein normaler Return-Flug.

Echtes Beispiel:
- Frankfurt -> Bangkok -> Frankfurt: 2.400 EUR (Business Class)
- Frankfurt -> Bangkok ... Singapur -> Frankfurt: 1.800 EUR (Business Class)

Das sind 600 EUR gespart UND du bekommst einen Stopp in Singapur quasi geschenkt.

So findest du Open-Jaw-Fluege:
1. Gehe auf Google Flights oder ITA Matrix
2. Waehle "Mehrere Staedte" statt "Hin- und Rueckflug"
3. Gib verschiedene Abflug-/Ankunftsorte ein
4. Vergleiche den Preis mit dem normalen Return

Pro-Tipp: Besonders gut funktioniert das bei Langstreckenfluegen innerhalb einer Region (z.B. Suedostasien, Suedamerika, Europa).

Probier es bei deiner naechsten Reise mal aus -- du wirst ueberrascht sein.

Auf Instagram zeige ich regelmaessig konkrete Beispiele mit Screenshots:

[BUTTON: Mehr Travel Hacks auf Instagram]
https://instagram.com/traveling.prof

Morgen uebermorgen geht's weiter mit dem Thema Kreditkarten -- da wird's richtig spannend.

Bis dann!

Robert

P.S. Hast du den Open-Jaw-Trick schon mal genutzt? Antworte auf diese Mail -- ich bin gespannt!
```

**CTA-Button:** "Mehr Travel Hacks auf Instagram"
**Button-Link:** https://instagram.com/traveling.prof

---

## Email 3: Kreditkarten-Tipp (Tag 4)

**Versandzeitpunkt:** 4 Tage nach Opt-in, morgens um 08:00 Uhr
**Segment/Bedingung:** `welcome-sequence:active`, NICHT `bought:tripwire`

**Betreff:** Diese Kreditkarte spart mir 6.000 EUR pro Jahr
**Preview-Text:** Warum die American Express Platinum mein wichtigstes Reise-Tool ist.

---

**Mail-Body:**

```
Hey!

Lass mich dir eine Frage stellen: Was ist das wichtigste Tool fuer einen Travel Hacker?

Nein, kein VPN. Keine App. Keine Webseite.

Es ist eine Kreditkarte.

Genauer gesagt: Die American Express Platinum.

Ich weiss, was du jetzt denkst: "Die kostet doch 720 EUR im Jahr!"

Ja, stimmt. Und genau das habe ich auch gedacht, bevor ich nachgerechnet habe.

Hier ist mein tatsaechlicher ROI im letzten Jahr:

| Vorteil | Wert |
|---|---|
| 200 EUR Reiseguthaben | 200 EUR |
| 200 EUR SIXT ride Guthaben | 200 EUR |
| Priority Pass (Lounge-Zugang weltweit) | ca. 600 EUR (20+ Besuche) |
| Membership Rewards Punkte | ca. 3.000 EUR (Transfer zu Airlines) |
| Hotel-Statusupgrade (Hilton Gold, Marriott Gold) | ca. 1.500 EUR |
| Versicherungspaket (Reise, Mietwagen, etc.) | ca. 500 EUR |
| **Gesamtwert** | **ca. 6.000 EUR** |

Das ist ein ROI von ueber 700%.

Und das Beste: Viele dieser Vorteile bekommst du automatisch, ohne irgendetwas Extra zu tun.

Klar, die Karte ist nicht fuer jeden. Wenn du einmal im Jahr nach Mallorca fliegst, lohnt sie sich wahrscheinlich nicht. Aber wenn du regelmaessig reist und das Meilen-System nutzt, ist sie ein absoluter Game-Changer.

Ich habe einen Rechner gebaut, mit dem du in 2 Minuten herausfinden kannst, ob sich die Amex Platinum fuer DICH lohnt:

[BUTTON: Zum Amex Platinum Rechner]
{Link zum Amex Platinum Rechner -- Tripwire 14 EUR}

Der Rechner beruecksichtigt dein Reiseverhalten, deine Ausgaben und zeigt dir deinen persoenlichen ROI. Fuer nur 14 EUR bekommst du Klarheit -- und sparst dir moeglicherweise 720 EUR Jahresgebuehr (oder findest heraus, dass du tausende Euro auf dem Tisch liegen laesst).

In 2 Tagen zeige ich dir, wie du in JEDE Flughafen-Lounge kommst -- auch ohne Vielflieger-Status oder teure Kreditkarte.

Bis dann!

Robert

P.S. Falls du die Amex Platinum ueber meinen Link beantragst, bekommen wir beide einen Bonus. Win-win. Aber nur, wenn der Rechner zeigt, dass sie sich fuer dich lohnt -- ich empfehle nichts, was keinen Sinn macht.
```

**CTA-Button:** "Zum Amex Platinum Rechner"
**Button-Link:** {URL zum Tripwire-Produkt: Amex Platinum Rechner, 14 EUR}

**Segment-Hinweis:** Wenn der Subscriber bereits den Tripwire gekauft hat (`bought:tripwire`), wird diese Mail uebersprungen oder eine Variante OHNE Kauf-CTA gesendet (stattdessen: Link zum bereits gekauften Rechner + Instagram-CTA).

---

## Email 4: Lounge-Geheimnis (Tag 6)

**Versandzeitpunkt:** 6 Tage nach Opt-in, morgens um 08:00 Uhr
**Segment/Bedingung:** `welcome-sequence:active`

**Betreff:** So kommst du in jede Flughafen-Lounge (auch ohne Status)
**Preview-Text:** Schluss mit ueberfuellten Gates -- 5 Wege in die Lounge, die kaum jemand kennt.

---

**Mail-Body:**

```
Hey!

Kennst du das? Du sitzt am Gate, um dich herum Chaos, ueberall Lautsprecherdurchsagen, der Kaffee kostet 6 EUR, und das WLAN funktioniert nicht.

Und dann siehst du diese Tuer mit der Aufschrift "Lounge" -- und fragst dich: Wie kommen die Leute da rein?

Heute verrate ich es dir. Und nein, du brauchst dafuer KEIN Business Class Ticket und KEINEN Vielflieger-Status.

Hier sind 5 Wege in die Lounge:

**1. Priority Pass**
Der Klassiker. Mit dem Priority Pass hast du Zugang zu ueber 1.500 Lounges weltweit. Einzeln kostet er 399 EUR/Jahr. ABER: Er ist bei der Amex Platinum kostenlos inklusive (und bei einigen anderen Kreditkarten auch).

**2. Lounge-Tageskarte**
Viele Lounges verkaufen Tagespaesse fuer 25-50 EUR. Oft direkt am Eingang oder ueber die App "LoungeBuddy". Lohnt sich besonders bei langen Layovern.

**3. Airline-Status durch Kreditkarten-Matching**
Manche Airlines geben dir einen Status, wenn du einen bestimmten Kreditkarten-Status hast. Beispiel: Hilton Gold durch Amex Platinum -> Zugang zu Hilton Airport Lounges.

**4. Meilen einloesen**
Bei vielen Programmen kannst du Meilen fuer Lounge-Zugang einloesen. Oft guenstiger als die Tageskarte.

**5. Einfach nett fragen**
Kein Witz. Besonders bei wenig ausgelasteten Lounges (Off-Peak-Zeiten, kleinere Flughaefen) klappt das oefter als du denkst. Schlimmstenfalls sagen sie nein.

Und dann gibt es noch die Koenigsklasse: **Die Amex Centurion Lounge.**

Das sind die eigenen Lounges von American Express -- und sie sind auf einem komplett anderen Level. Frisch zubereitetes Essen vom Sternekoch, Premium-Cocktails, Spa-Bereich, Arbeitsplaetze mit Tageslicht.

Zugang? Nur mit einer American Express Platinum oder Centurion Karte.

Ich war mittlerweile in ueber 100 verschiedenen Lounges weltweit. Meine Top 10, die besten Hacks und die Lounges, die du meiden solltest -- all das findest du im Lounge & Upgrade Masterplan:

[BUTTON: Zum Lounge & Upgrade Masterplan]
{Link zum Produkt}

Darin zeige ich dir Schritt fuer Schritt, wie du ab sofort bei jeder Reise Lounge-Zugang und Upgrades bekommst.

Bis in 2 Tagen!

Robert

P.S. Meine Lieblings-Lounge? Die Qatar Airways Al Mourjan Lounge in Doha. Ein Traum. Fotos davon findest du auf meinem Instagram @traveling.prof.
```

**CTA-Button:** "Zum Lounge & Upgrade Masterplan"
**Button-Link:** {URL zum Produkt: Lounge & Upgrade Masterplan}

---

## Email 5: Tripwire-Angebot (Tag 8)

**Versandzeitpunkt:** 8 Tage nach Opt-in, morgens um 09:00 Uhr
**Segment/Bedingung:** `welcome-sequence:active`, NICHT `bought:tripwire`

**Betreff:** Exklusiv fuer dich: -30% auf den Buchungs-Hacks Guide
**Preview-Text:** Nur 48 Stunden -- danach gilt wieder der regulaere Preis.

---

**Mail-Body:**

```
Hey!

Kurze Mail heute, weil ich ein Angebot fuer dich habe, das ich nur einmal mache.

Du bist jetzt seit gut einer Woche bei traveling.prof dabei. Du hast den Open-Jaw-Trick kennengelernt, weisst wie der Kreditkarten-ROI funktioniert, und kennst 5 Wege in die Lounge.

Aber das war erst die Spitze des Eisbergs.

In meinem "Top 10 Buchungs-Hacks" E-Book habe ich die 10 maechtigsten Strategien zusammengestellt, mit denen ich bei JEDER Buchung Geld spare. Das sind Techniken, die ich in Jahren des Travel Hackings perfektioniert habe.

Was drin steckt:
- Der Fehlerflug-Trick (wie du Airlines-Fehler fuer dich nutzt)
- Die Hidden-City-Strategie (und wann du sie NICHT nutzen solltest)
- Fuel Dumping erklaert -- Schritt fuer Schritt
- Der 24-Stunden-Trick bei Flugbuchungen
- Warum Dienstag NICHT der guenstigste Tag zum Buchen ist
- 5 weitere Strategien, die selbst erfahrene Reisende nicht kennen

Regulaerer Preis: 29 EUR.

**Dein Preis als Newsletter-Subscriber: 19,90 EUR.**

Das sind 30% Rabatt -- und das Angebot gilt nur 48 Stunden.

Was andere dazu sagen:

> "Allein der Fuel-Dumping-Trick hat mir bei meinem letzten Flug nach Tokio 380 EUR gespart. Das E-Book hat sich 20-fach ausgezahlt."
> -- Markus, 34, aus Muenchen

[BUTTON: Jetzt fuer 19,90 EUR sichern]
{Kauf-Link mit Rabattcode}

In 3 Tagen geht's weiter mit einem Thema, das alles zusammenbringt: Wie du in 5 Modulen zum Meilen-Profi wirst.

Bis dann!

Robert

P.S. Das Angebot laeuft automatisch in 48 Stunden ab. Danach gilt wieder der regulaere Preis von 29 EUR. Hier nochmal der Link: {Kauf-Link}
```

**CTA-Button:** "Jetzt fuer 19,90 EUR sichern"
**Button-Link:** {URL zum E-Book mit Rabattcode, z.B. ?coupon=WELCOME30}

**Dringlichkeitselement:**
- 48-Stunden-Timer (wenn technisch moeglich als visueller Countdown im Mail)
- Alternativ: Textbasierte Dringlichkeit wie oben
- Optional: Reminder-Mail nach 24 Stunden an Nicht-Kaeufer

**Segment-Hinweis:** Diese Mail wird NICHT an Personen gesendet, die bereits ein Tripwire-Produkt gekauft haben. Stattdessen erhalten sie eine alternative Mail mit reinem Content-Mehrwert.

---

## Email 6: Crashkurs-Vorstellung (Tag 11)

**Versandzeitpunkt:** 11 Tage nach Opt-in, morgens um 08:00 Uhr
**Segment/Bedingung:** `welcome-sequence:active`, NICHT `bought:crashkurs`

**Betreff:** In 5 Modulen zum Meilen-Profi
**Preview-Text:** Der Meilen-Crashkurs: Alles was du brauchst, um das System zu meistern.

---

**Mail-Body:**

```
Hey!

In den letzten Tagen habe ich dir einige meiner besten Travel Hacks gezeigt. Und vielleicht denkst du dir: "Cool, aber wie haengt das alles zusammen?"

Genau das ist der Punkt.

Einzelne Tipps sind gut. Aber um wirklich guenstig in Business Class zu fliegen, in Top-Hotels zu uebernachten und das Meilen-System systematisch zu nutzen, brauchst du einen klaren Plan.

Deshalb habe ich den **Meilen-Crashkurs** entwickelt.

**Was ist der Meilen-Crashkurs?**

Ein kompakter Online-Kurs in 5 Modulen, der dich vom Einsteiger zum Meilen-Profi macht. Kein Blabla, keine Theorie-Wuesten -- nur das, was du wirklich brauchst.

**Die 5 Module:**

**Modul 1: Das Meilen-System verstehen**
Wie Meilen und Punkte funktionieren, welche Programme es gibt, und warum eine Meile nicht gleich eine Meile ist.

**Modul 2: Die richtige Kreditkarten-Strategie**
Welche Karten sich fuer dich lohnen, wie du den maximalen Bonus rausholst, und wie du Punkte sammelst, ohne dein Ausgabeverhalten zu aendern.

**Modul 3: Meilen sammeln wie ein Profi**
Shopping-Portale, Transfer-Partner, Promotions und Bonus-Aktionen -- so sammelst du Meilen im Alltag, ohne mehr Geld auszugeben.

**Modul 4: Praemien buchen & maximieren**
Sweetspots bei Airlines, die besten Einloeseoptionen, und wie du den Wert deiner Meilen verdreifachst.

**Modul 5: Deine persoenliche Strategie**
Wie du alles zusammensetzt, deinen Reisestil optimierst und ab sofort systematisch Meilen sammelst.

**Fuer wen ist der Kurs?**

- Du reist gerne und willst mehr fuer dein Geld
- Du hast von Meilen gehoert, aber weisst nicht wo du anfangen sollst
- Du sammelst bereits Meilen, aber nutzt sie nicht optimal
- Du willst endlich verstehen, wie die "Travel-Hacker" das machen

**Was du bekommst:**

- 5 Module mit Video-Lektionen (je 15-25 Minuten)
- Begleitende Checklisten und Vorlagen
- Meilen-Rechner-Tool
- Zugang zur privaten Telegram-Gruppe
- Lebenslange Updates

**Der Preis: 39 EUR.**

Ja, richtig gelesen. Nicht 399 EUR, nicht 99 EUR. 39 EUR. Weil ich moechte, dass so viele Leute wie moeglich den Einstieg schaffen.

Zum Vergleich: Ein einziger Praemienflug in Business Class kann leicht 3.000-5.000 EUR wert sein. Und der Kurs zeigt dir, wie du dort hinkommst.

[BUTTON: Zum Meilen-Crashkurs fuer 39 EUR]
{Kauf-Link zum Crashkurs}

In 3 Tagen schicke ich dir die letzte Mail dieser Serie. Darin geht's um den naechsten Schritt -- aber dazu spaeter mehr.

Bis dann!

Robert

P.S. Du hast Fragen zum Kurs? Antworte einfach auf diese Mail. Ich helfe dir gerne bei der Entscheidung.
```

**CTA-Button:** "Zum Meilen-Crashkurs fuer 39 EUR"
**Button-Link:** {URL zum Crashkurs-Kaufseite}

**Segment-Hinweis:** Wer den Crashkurs bereits gekauft hat, erhaelt stattdessen eine Mail mit Bonus-Tipps oder einer Einladung, den Kurs zu bewerten.

---

## Email 7: Community-Einladung (Tag 14)

**Versandzeitpunkt:** 14 Tage nach Opt-in, morgens um 08:00 Uhr
**Segment/Bedingung:** `welcome-sequence:active`
**Tag setzen:** `welcome-sequence:completed`, Tag `welcome-sequence:active` entfernen

**Betreff:** Du bist bereit fuer den naechsten Schritt
**Preview-Text:** 14 Tage traveling.prof -- wie geht's jetzt weiter?

---

**Mail-Body:**

```
Hey!

Wow -- 14 Tage sind rum. In dieser Zeit hast du gelernt:

- Den Open-Jaw-Trick (hunderte Euro bei Fluegen sparen)
- Warum die richtige Kreditkarte ein Game-Changer ist
- 5 Wege in die Flughafen-Lounge
- Buchungs-Hacks, die selbst Profis nicht kennen
- Wie das Meilen-System wirklich funktioniert

Und das war erst der Anfang.

Jetzt habe ich eine Frage an dich: **Willst du das alleine weitermachen -- oder willst du Teil einer Community sein, die sich gegenseitig unterstuetzt?**

Ich habe die **traveling.prof VIP Community** gegruendet. Eine exklusive Gruppe fuer Menschen, die Travel Hacking ernst nehmen.

**Was dich in der VIP Community erwartet:**

- **Woechentliche Deal-Alerts:** Ich teile Fehlfluege, Schnäppchen und Promotions, bevor sie oeffentlich werden
- **Monatliche Live-Q&A Sessions:** Stell mir deine Fragen direkt -- ich beantworte alles
- **Community-Support:** Tausch dich mit anderen Travel Hackern aus dem DACH-Raum aus
- **Exklusive Inhalte:** Deep-Dives, Fallstudien und Strategien, die es nirgendwo sonst gibt
- **Fruehzeitiger Zugang:** Neue Produkte und Kurse bekommst du zuerst -- und guenstiger

[BUTTON: Zur VIP Community]
{Link zur VIP Community / Telegram-Gruppe / Memberbereich}

**Noch intensiver: Die Masterclass**

Fuer alle, die das Maximum rausholen wollen, gibt es die **traveling.prof Masterclass**. Ein umfassender Kurs mit persoenlicher Betreuung, der weit ueber den Crashkurs hinausgeht. Premium-Strategien, Advanced Booking Techniques, und ein persoenlicher Reiseplan von mir.

Mehr dazu erfahrst du in der Community -- oder schreib mir einfach.

**Und fuer individuelle Fragen:**

Manchmal ist ein persoenliches Gespraech der schnellste Weg. Wenn du eine konkrete Reise planst oder wissen willst, welche Strategie fuer DICH am besten funktioniert, buch dir einen kostenlosen 1:1 Call mit mir:

[BUTTON: Kostenlosen 1:1 Call buchen]
{Calendly-Link oder Buchungslink}

15 Minuten, kein Verkaufsgespraech, nur ehrliche Beratung.

---

Und wie geht's jetzt weiter mit den Mails?

Ab jetzt bekommst du meinen regulaeren Newsletter -- ca. 1x pro Woche. Darin teile ich:
- Aktuelle Deals und Schnaeppchen
- Neue Travel Hacks
- Erfahrungsberichte von meinen Reisen
- Exklusive Angebote fuer die Community

Kein Spam, nur Mehrwert. Und du kannst dich jederzeit abmelden.

Danke, dass du die letzten 14 Tage dabei warst. Das war erst der Anfang -- die besten Reisen liegen noch vor dir.

Bis bald!

Robert
traveling.prof

P.S. Falls du jemanden kennst, der auch guenstiger und besser reisen moechte -- leite diese Mail gerne weiter oder schick ihnen den Link zu meinem Freebie: {Freebie-Landing-Page-URL}
```

**CTA-Buttons:**
1. "Zur VIP Community" (primaer)
2. "Kostenlosen 1:1 Call buchen" (sekundaer)

**Nach dieser Mail:**
- Tag `welcome-sequence:completed` setzen
- Tag `welcome-sequence:active` entfernen
- Subscriber in regulaeren Newsletter-Flow verschieben
- Engagement-basierte Segmentierung starten

---

## Rechtliche Hinweise

### DSGVO-Compliance (Pflicht!)

Jede E-Mail MUSS folgende Elemente enthalten:

**1. Abmeldelink (Pflicht nach Art. 7 Abs. 3 DSGVO + UWG)**
```
Du moechtest keine Mails mehr von traveling.prof erhalten?
Kein Problem -- hier kannst du dich jederzeit abmelden:
[Abmeldelink]
```

**2. Impressums-Angaben im Footer (Pflicht nach TMG/DDG)**
```
traveling.prof
Robert Engel
[Strasse + Hausnummer]
[PLZ + Stadt]
E-Mail: robert@traveling.prof
Web: https://traveling.prof
```

**3. Datenschutzhinweis-Link**
```
Datenschutzerklaerung: https://traveling.prof/datenschutz
```

### Mail-Footer-Template (fuer JEDE Mail)

```
---

traveling.prof | Robert Engel
[Adresse]

Datenschutz: https://traveling.prof/datenschutz
Impressum: https://traveling.prof/impressum

Du erhaeltst diese Mail, weil du dich fuer den traveling.prof Newsletter angemeldet hast.
Abmelden: [Abmeldelink]
```

### Weitere rechtliche Hinweise

- **Double-Opt-In ist Pflicht** in DACH -- ohne bestatigten Opt-in keine Marketing-Mails
- **Opt-in dokumentieren:** Brevo speichert automatisch Zeitstempel, IP-Adresse und Opt-in-Quelle
- **Affiliate-Links kennzeichnen:** Wenn Mails Affiliate-Links enthalten (z.B. Amex), muss das erkennbar sein (z.B. Sternchen + Hinweis am Ende)
- **Werbliche Mails klar kennzeichnen:** Betreffzeilen duerfen nicht irrefuehrend sein
- **Abmeldelink darf nicht hinter Login versteckt sein** -- muss mit einem Klick funktionieren
- **List-Unsubscribe Header** in Brevo aktivieren (technischer Unsubscribe fuer Mail-Clients)

### Affiliate-Disclaimer (bei Mails mit Affiliate-Links)

```
* Dieser Link ist ein Affiliate-/Empfehlungslink. Wenn du ueber diesen Link ein Produkt abschliesst, erhalte ich eine Provision -- fuer dich entstehen keine zusaetzlichen Kosten. Ich empfehle nur Produkte, die ich selbst nutze und von denen ich ueberzeugt bin.
```

---

## n8n Workflow-Konzept

### Uebersicht

Die Welcome-Sequenz kann ueber n8n automatisiert werden, entweder als Ergaenzung zu Brevo's nativen Automationen oder als vollstaendiger Ersatz.

### Architektur

```
[Opt-in Formular / Landing Page]
        |
        v
[Webhook: Neuer Subscriber]
        |
        v
[Brevo API: Kontakt erstellen + DOI senden]
        |
        v
[Webhook: DOI bestaetigt]
        |
        v
[n8n: Welcome-Sequenz starten]
        |
        +---> [Tag 0] Email 1: Willkommen
        |
        +---> [Wait 2 Tage]
        |         |
        |         v
        +---> [Tag 2] Email 2: Travel Hack
        |
        +---> [Wait 2 Tage]
        |         |
        |         v
        +---> [Check: Hat Tripwire gekauft?]
        |         |          |
        |        JA         NEIN
        |         |          |
        |    [Alt-Mail]  [Tag 4] Email 3: Kreditkarten
        |
        +---> [Wait 2 Tage]
        |         |
        |         v
        +---> [Tag 6] Email 4: Lounge
        |
        +---> [Wait 2 Tage]
        |         |
        |         v
        +---> [Check: Hat Tripwire gekauft?]
        |         |          |
        |        JA         NEIN
        |         |          |
        |    [Skip]    [Tag 8] Email 5: Tripwire
        |
        +---> [Wait 3 Tage]
        |         |
        |         v
        +---> [Check: Hat Crashkurs gekauft?]
        |         |          |
        |        JA         NEIN
        |         |          |
        |    [Alt-Mail]  [Tag 11] Email 6: Crashkurs
        |
        +---> [Wait 3 Tage]
        |         |
        |         v
        +---> [Tag 14] Email 7: Community
        |
        v
[Tags aktualisieren: welcome-sequence:completed]
[In regulaeren Newsletter verschieben]
```

### n8n Nodes im Detail

**1. Trigger: Webhook Node**
- Empfaengt POST-Request von Brevo bei DOI-Bestaetigung
- Payload: E-Mail, Name, Tags, Quelle

**2. Set Node: Variablen setzen**
- `subscriberEmail`
- `subscriberName`
- `freebieName`
- `freebieDownloadUrl`
- `sequenceStartDate`

**3. Brevo Node: Mail senden**
- Nutzt Brevo API v3
- Sendet transaktionale Mails ueber Templates
- Template-IDs in n8n als Variablen hinterlegen

**4. Wait Node: Verzoegerung**
- Zwischen jeder Mail ein Wait-Node
- Konfigurierbare Wartezeit (2-3 Tage)

**5. IF Node: Bedingungen pruefen**
- Brevo API abfragen: Hat Kontakt bestimmten Tag?
- Bedingung: `bought:tripwire`, `bought:crashkurs`, etc.
- Verzweigung in alternative Mails oder Skip

**6. HTTP Request Node: Brevo API**
- Tags setzen/entfernen
- Kontakt-Attribute aktualisieren
- Segment-Zuordnung aendern

### n8n Credentials

```
Brevo API Key: [In n8n Credentials hinterlegen]
Webhook URL: https://n8n.traveling.prof/webhook/welcome-sequence
```

### Brevo Template-IDs (Mapping)

| E-Mail | Brevo Template-ID | n8n Variable |
|---|---|---|
| DOI-Bestaetigung | (nativ in Brevo) | -- |
| Email 1: Willkommen | TBD | `TEMPLATE_WELCOME` |
| Email 2: Travel Hack | TBD | `TEMPLATE_TRAVELHACK` |
| Email 3: Kreditkarten | TBD | `TEMPLATE_KREDITKARTE` |
| Email 4: Lounge | TBD | `TEMPLATE_LOUNGE` |
| Email 5: Tripwire | TBD | `TEMPLATE_TRIPWIRE` |
| Email 6: Crashkurs | TBD | `TEMPLATE_CRASHKURS` |
| Email 7: Community | TBD | `TEMPLATE_COMMUNITY` |

### Monitoring & KPIs

In n8n oder Brevo tracken:

| KPI | Ziel |
|---|---|
| Oeffnungsrate | > 40% (Welcome-Mails typischerweise hoch) |
| Klickrate | > 5% |
| Abmelderate | < 1% pro Mail |
| Tripwire-Conversion (Mail 3+5) | > 3% |
| Crashkurs-Conversion (Mail 6) | > 2% |
| Gesamte Sequenz-Completion | > 70% |

### Fehlerbehandlung

- **Bounce-Handling:** Brevo markiert automatisch Hard-Bounces
- **Retry-Logik:** Bei API-Fehlern 3x Retry mit exponential Backoff
- **Error-Notification:** Bei Fehlern Slack/Telegram-Benachrichtigung an Robert
- **Unsubscribe-Check:** Vor jeder Mail pruefen, ob Kontakt noch aktiv ist

---

## Zusammenfassung: Sequenz-Uebersicht

| Tag | Email | Betreff | Haupt-CTA | Ziel |
|---|---|---|---|---|
| 0 | 1: Willkommen | Willkommen bei traveling.prof -- Dein Freebie wartet | Freebie Download | Vertrauen aufbauen |
| 2 | 2: Travel Hack | Mein #1 Travel-Hack, der alles veraendert hat | Instagram | Mehrwert liefern |
| 4 | 3: Kreditkarten | Diese Kreditkarte spart mir 6.000 EUR pro Jahr | Amex Rechner (14 EUR) | Erster Sale |
| 6 | 4: Lounge | So kommst du in jede Flughafen-Lounge | Lounge Masterplan | Produkt vorstellen |
| 8 | 5: Tripwire | Exklusiv fuer dich: -30% auf den Buchungs-Hacks Guide | E-Book (19,90 EUR) | Tripwire-Conversion |
| 11 | 6: Crashkurs | In 5 Modulen zum Meilen-Profi | Crashkurs (39 EUR) | Hauptprodukt-Sale |
| 14 | 7: Community | Du bist bereit fuer den naechsten Schritt | VIP Community + 1:1 Call | Langfristige Bindung |

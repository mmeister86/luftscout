# LuftScout.de - Luftqualitätsmonitor für deutsche Städte

## Übersicht

LuftScout.de ist eine webbasierte Anwendung zur Überwachung und Visualisierung der Luftqualität in deutschen Städten. Die Plattform bietet Echtzeit-Informationen zu verschiedenen Luftschadstoffen und ermöglicht es Nutzern, fundierte Entscheidungen für ihre Gesundheit zu treffen.

## Features

- **Städtesuche**: Einfache Suche nach Luftqualitätsdaten für jede deutsche Stadt
- **Interaktive Karte**: Farbkodierte Kartendarstellung der Luftqualität in Echtzeit
- **Detaillierte Messwerte**: Umfassende Informationen zu verschiedenen Schadstoffen:
  - Feinstaub (PM10 und PM2.5)
  - Stickstoffdioxid (NO₂)
  - Ozon (O₃)
  - und weitere
- **Gesundheitsempfehlungen**: Bewertung der Luftqualität mit konkreten Handlungsempfehlungen
- **Responsive Design**: Optimiert für Desktop und mobile Geräte

## Technologien

- HTML5, CSS3 und JavaScript
- [Leaflet.js](https://leafletjs.com/) für interaktive Karten
- OpenWeatherMap API für Luftqualitätsdaten
- OpenStreetMap für Geodaten

## Installation und lokale Ausführung

1. Klonen Sie das Repository:
   ```
   git clone https://github.com/DEIN-USERNAME/luftscout.git
   ```

2. Navigieren Sie zum Projektverzeichnis:
   ```
   cd luftscout
   ```

3. Öffnen Sie `index.html` in Ihrem Browser oder verwenden Sie einen lokalen Server wie z.B.:
   ```
   python -m http.server
   ```
   und öffnen Sie dann http://localhost:8000 in Ihrem Browser.

## API-Schlüssel

Die Anwendung verwendet die OpenWeatherMap API für Luftqualitätsdaten. Um die Anwendung lokal auszuführen, benötigen Sie einen API-Schlüssel:

1. Erstellen Sie ein Konto bei [OpenWeatherMap](https://openweathermap.org/)
2. Generieren Sie einen API-Schlüssel
3. Fügen Sie Ihren API-Schlüssel in `script.js` ein

## Beitragen

Beiträge zum Projekt sind willkommen! So können Sie beitragen:

1. Fork des Repositories erstellen
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## Kontakt

Projektlink: [https://github.com/mmeister86/luftscout](https://github.com/mmeister86/luftscout)

---

&copy; 2025 LuftScout.de - Alle Rechte vorbehalten

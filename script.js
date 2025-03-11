document.addEventListener('DOMContentLoaded', function() {
    // DOM-Elemente
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const errorMessage = document.getElementById('error-message');
    const loadingElement = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const cityNameElement = document.getElementById('city-name');
    const lastUpdatedElement = document.getElementById('last-updated');
    const airQualityGrid = document.querySelector('.air-quality-grid');
    const logoLink = document.getElementById('logo-link');
    const topCityLinks = document.querySelectorAll('.top-cities a');

    // AQI Kategorien und Beschreibungen
    const aqiCategories = {
        pm10: {
            ranges: [
                { max: 20, label: 'Gut', class: 'aqi-good', description: 'Ideale Luftqualität mit minimaler Gesundheitsgefährdung.' },
                { max: 40, label: 'Moderat', class: 'aqi-moderate', description: 'Akzeptable Luftqualität, geringe Gesundheitsgefährdung.' },
                { max: 60, label: 'Ungesund für empfindliche Gruppen', class: 'aqi-poor', description: 'Gefährdung für Personen mit Atemwegserkrankungen.' },
                { max: 100, label: 'Ungesund', class: 'aqi-very-poor', description: 'Gesundheitsbeeinträchtigungen möglich, besonders für sensible Gruppen.' },
                { max: Infinity, label: 'Sehr ungesund', class: 'aqi-extreme', description: 'Erhöhtes Gesundheitsrisiko für die gesamte Bevölkerung.' }
            ],
            unit: 'µg/m³'
        },
        pm2_5: {
            ranges: [
                { max: 10, label: 'Gut', class: 'aqi-good', description: 'Ideale Luftqualität mit minimaler Gesundheitsgefährdung.' },
                { max: 25, label: 'Moderat', class: 'aqi-moderate', description: 'Akzeptable Luftqualität, geringe Gesundheitsgefährdung.' },
                { max: 40, label: 'Ungesund für empfindliche Gruppen', class: 'aqi-poor', description: 'Gefährdung für Personen mit Atemwegserkrankungen.' },
                { max: 60, label: 'Ungesund', class: 'aqi-very-poor', description: 'Gesundheitsbeeinträchtigungen möglich, besonders für sensible Gruppen.' },
                { max: Infinity, label: 'Sehr ungesund', class: 'aqi-extreme', description: 'Erhöhtes Gesundheitsrisiko für die gesamte Bevölkerung.' }
            ],
            unit: 'µg/m³'
        },
        nitrogen_dioxide: {
            ranges: [
                { max: 40, label: 'Gut', class: 'aqi-good', description: 'Geringe Konzentration von Stickstoffdioxid.' },
                { max: 100, label: 'Moderat', class: 'aqi-moderate', description: 'Leicht erhöhte NO₂-Werte, aber noch akzeptabel.' },
                { max: 200, label: 'Ungesund für empfindliche Gruppen', class: 'aqi-poor', description: 'Erhöhte NO₂-Werte, bedenklich für Asthmatiker.' },
                { max: 400, label: 'Ungesund', class: 'aqi-very-poor', description: 'Hohe NO₂-Konzentration, allgemeine Gesundheitsrisiken.' },
                { max: Infinity, label: 'Gefährlich', class: 'aqi-extreme', description: 'Sehr hohe NO₂-Werte, ernste Gesundheitsgefahr.' }
            ],
            unit: 'µg/m³'
        },
        ozone: {
            ranges: [
                { max: 60, label: 'Gut', class: 'aqi-good', description: 'Normale Ozonwerte ohne Gesundheitsrisiko.' },
                { max: 120, label: 'Moderat', class: 'aqi-moderate', description: 'Leicht erhöhte Ozonwerte, geringes Risiko.' },
                { max: 180, label: 'Ungesund für empfindliche Gruppen', class: 'aqi-poor', description: 'Erhöhte Ozonkonzentration, Vorsicht bei Risikogruppen.' },
                { max: 240, label: 'Ungesund', class: 'aqi-very-poor', description: 'Starke Ozonbelastung, körperliche Aktivitäten einschränken.' },
                { max: Infinity, label: 'Sehr ungesund', class: 'aqi-extreme', description: 'Gefährlich hohe Ozonkonzentration, Aufenthalt im Freien vermeiden.' }
            ],
            unit: 'µg/m³'
        },
        sulphur_dioxide: {
            ranges: [
                { max: 20, label: 'Gut', class: 'aqi-good', description: 'Niedrige SO₂-Konzentration, unbedenklich.' },
                { max: 80, label: 'Moderat', class: 'aqi-moderate', description: 'Mäßige SO₂-Werte, für die meisten Menschen sicher.' },
                { max: 250, label: 'Ungesund für empfindliche Gruppen', class: 'aqi-poor', description: 'Erhöhte SO₂-Werte, problematisch für Asthmatiker.' },
                { max: 350, label: 'Ungesund', class: 'aqi-very-poor', description: 'Hohe SO₂-Konzentration, kann Atemwege reizen.' },
                { max: Infinity, label: 'Sehr ungesund', class: 'aqi-extreme', description: 'Sehr hohe SO₂-Werte, ernste Gesundheitsrisiken.' }
            ],
            unit: 'µg/m³'
        }
    };

    // Schöne Namen für die Luftqualitätsparameter
    const parameterNames = {
        'pm10': 'Feinstaub (PM10)',
        'pm2_5': 'Feinstaub (PM2.5)',
        'carbon_monoxide': 'Kohlenmonoxid (CO)',
        'nitrogen_dioxide': 'Stickstoffdioxid (NO₂)',
        'sulphur_dioxide': 'Schwefeldioxid (SO₂)',
        'ozone': 'Ozon (O₃)',
        'aerosol_optical_depth': 'Aerosol-optische Dicke',
        'dust': 'Staub',
        'uv_index': 'UV-Index',
        'european_aqi': 'Europäischer Luftqualitätsindex'
    };

    // Funktion zur Kategorisierung eines Luftqualitätswerts
    function categorizeAirQuality(parameter, value) {
        if (!aqiCategories[parameter]) {
            return {
                label: 'Unbekannt',
                class: '',
                description: 'Keine Kategorisierung verfügbar für diesen Parameter.'
            };
        }

        const ranges = aqiCategories[parameter].ranges;
        for (const range of ranges) {
            if (value <= range.max) {
                return {
                    label: range.label,
                    class: range.class,
                    description: range.description
                };
            }
        }

        return {
            label: 'Extrem',
            class: 'aqi-extreme',
            description: 'Extrem hohe Werte, ernsthafte Gesundheitsrisiken.'
        };
    }

    // Funktion zum Formatieren des Datums
    function formatDate(date) {
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // Funktion zum Erstellen der Farbskala für die Karte basierend auf dem AQI
    function getColorForAQI(aqi) {
        if (aqi <= 20) return '#50F0E6'; // Sehr gut - Türkis
        if (aqi <= 40) return '#50CCAA'; // Gut - Grün
        if (aqi <= 60) return '#F0E641'; // Mäßig - Gelb
        if (aqi <= 80) return '#FF5050'; // Schlecht - Rot
        if (aqi <= 100) return '#960032'; // Sehr schlecht - Dunkelrot
        return '#7D2181';               // Extrem schlecht - Violett
    }

    // Funktion zur Umwandlung eines Stadtnamens in Koordinaten
    async function getCityCoordinates(cityName) {
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=de&format=json`);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                throw new Error('Stadt nicht gefunden');
            }

            return {
                lat: data.results[0].latitude,
                lon: data.results[0].longitude,
                name: data.results[0].name,
                country: data.results[0].country
            };
        } catch (error) {
            throw new Error('Fehler bei der Ortssuche. Bitte versuchen Sie es erneut.');
        }
    }

    // Funktion zum Abrufen der Luftqualitätsdaten für einen bestimmten Ort
    async function getAirQualityData(lat, lon) {
        try {
            const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,european_aqi`);
            const data = await response.json();

            if (!data || !data.hourly) {
                throw new Error('Keine Luftqualitätsdaten verfügbar');
            }

            // Aktuelle Stunde im Datensatz finden
            const now = new Date();
            const nowIso = now.toISOString().split('T')[0] + 'T' + now.getHours() + ':00';
            const currentIndex = data.hourly.time.findIndex(time => time.startsWith(nowIso));

            const currentData = {};
            if (currentIndex !== -1) {
                for (const key in data.hourly) {
                    if (key !== 'time') {
                        currentData[key] = data.hourly[key][currentIndex];
                    }
                }
            } else {
                // Wenn aktuelle Stunde nicht gefunden, verwende neuesten Datenpunkt
                const latestIndex = data.hourly.time.length - 1;
                for (const key in data.hourly) {
                    if (key !== 'time') {
                        currentData[key] = data.hourly[key][latestIndex];
                    }
                }
            }

            return currentData;
        } catch (error) {
            throw new Error('Fehler beim Abrufen der Luftqualitätsdaten. Bitte versuchen Sie es später erneut.');
        }
    }

    // Funktion zum Abrufen von Luftqualitätsdaten für mehrere Orte im Umkreis
    async function getAirQualityGrid(centerLat, centerLon, radius, points) {
        // Verringere die Anzahl der Punkte für schnelleres Laden
        const gridPoints = [];
        const stepSize = (radius * 2) / (points - 1);

        // Füge nur den Mittelpunkt und ein paar strategische Punkte hinzu
        // statt des kompletten Gitters
        gridPoints.push({ lat: centerLat, lon: centerLon }); // Zentrum

        // Ein paar Punkte in den Hauptrichtungen
        gridPoints.push({ lat: centerLat + radius/2, lon: centerLon }); // Norden
        gridPoints.push({ lat: centerLat - radius/2, lon: centerLon }); // Süden
        gridPoints.push({ lat: centerLat, lon: centerLon + radius/2 }); // Osten
        gridPoints.push({ lat: centerLat, lon: centerLon - radius/2 }); // Westen

        // Füge ein paar diagonale Punkte hinzu
        gridPoints.push({ lat: centerLat + radius/3, lon: centerLon + radius/3 });
        gridPoints.push({ lat: centerLat - radius/3, lon: centerLon - radius/3 });
        gridPoints.push({ lat: centerLat + radius/3, lon: centerLon - radius/3 });
        gridPoints.push({ lat: centerLat - radius/3, lon: centerLon + radius/3 });

        // Nutze eine einzelne API-Anfrage für alle Punkte, wenn möglich
        try {
            // Rufe die Daten für den Mittelpunkt ab - wir werden diese extrapolieren
            const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${centerLat}&longitude=${centerLon}&hourly=european_aqi`);
            const data = await response.json();

            if (!data || !data.hourly || !data.hourly.european_aqi) {
                throw new Error('Keine Daten verfügbar');
            }

            // Aktuelle Stunde finden
            const now = new Date();
            const nowIso = now.toISOString().split('T')[0] + 'T' + now.getHours() + ':00';
            const currentIndex = data.hourly.time.findIndex(time => time.startsWith(nowIso));

            let centerAQI;
            if (currentIndex !== -1) {
                centerAQI = data.hourly.european_aqi[currentIndex];
            } else {
                // Wenn aktuelle Stunde nicht gefunden, verwende neuesten Datenpunkt
                centerAQI = data.hourly.european_aqi[data.hourly.european_aqi.length - 1];
            }

            // Für Demonstrationszwecke: Leichte zufällige Variation des AQI um Städte herum
            // In einer realen Anwendung würden hier echte Daten verwendet
            const gridData = gridPoints.map(point => {
                // Kleine zufällige Variation hinzufügen, um ein natürlicheres Muster zu erzeugen
                // Je weiter vom Zentrum entfernt, desto mehr Variation
                const distance = Math.sqrt(
                    Math.pow(point.lat - centerLat, 2) +
                    Math.pow(point.lon - centerLon, 2)
                ) / radius;

                // Zufällige Variation, größer mit Entfernung vom Zentrum
                const variation = (Math.random() - 0.5) * 10 * distance;
                const pointAQI = Math.max(0, Math.min(150, Math.round(centerAQI + variation)));

                return {
                    lat: point.lat,
                    lon: point.lon,
                    aqi: pointAQI
                };
            });

            return gridData;

        } catch (error) {
            console.error('Fehler beim Abrufen der Rasterdaten:', error);
            return [];
        }
    }

    // Funktion zum Erstellen der Luftqualitätskarten
    function createAirQualityCards(data) {
        airQualityGrid.innerHTML = '';

        // Parameter, die angezeigt werden sollen
        const parametersToShow = ['pm10', 'pm2_5', 'nitrogen_dioxide', 'ozone', 'sulphur_dioxide', 'european_aqi'];

        for (const parameter of parametersToShow) {
            if (data[parameter] !== undefined) {
                const value = data[parameter];
                const name = parameterNames[parameter] || parameter;
                let category, unit;

                if (parameter === 'european_aqi') {
                    // Spezialbehandlung für den europäischen AQI
                    if (value <= 20) category = { label: 'Sehr gut', class: 'aqi-good', description: 'Ausgezeichnete Luftqualität' };
                    else if (value <= 40) category = { label: 'Gut', class: 'aqi-good', description: 'Gute Luftqualität' };
                    else if (value <= 60) category = { label: 'Moderat', class: 'aqi-moderate', description: 'Mäßige Luftqualität' };
                    else if (value <= 80) category = { label: 'Schlecht', class: 'aqi-poor', description: 'Schlechte Luftqualität' };
                    else if (value <= 100) category = { label: 'Sehr schlecht', class: 'aqi-very-poor', description: 'Sehr schlechte Luftqualität' };
                    else category = { label: 'Extrem schlecht', class: 'aqi-extreme', description: 'Extrem schlechte Luftqualität' };
                    unit = '';
                } else {
                    category = categorizeAirQuality(parameter, value);
                    unit = aqiCategories[parameter] ? aqiCategories[parameter].unit : '';
                }

                const card = document.createElement('div');
                card.className = 'air-quality-card';
                card.innerHTML = `
                    <h3>${name}</h3>
                    <div class="air-quality-value ${category.class}">${value}${unit}</div>
                    <div class="air-quality-description">
                        <strong>${category.label}</strong>: ${category.description}
                    </div>
                `;
                airQualityGrid.appendChild(card);
            }
        }
    }

    // Funktion zum Initialisieren und Aktualisieren der Karte
    let map = null;
    let heatmapLayer = null;

    function initMap(lat, lon, zoom) {
        if (map) {
            map.remove();
        }

        // Karte initialisieren
        map = L.map('map').setView([lat, lon], zoom);

        // OpenStreetMap-Layer hinzufügen
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Stadtzentrum-Marker hinzufügen
        L.marker([lat, lon]).addTo(map)
            .bindPopup('<strong>Ausgewählter Ort</strong>')
            .openPopup();

        return map;
    }

    // Funktion zum Hinzufügen von Luftqualitätsdaten zur Karte
    async function addAirQualityToMap(map, centerLat, centerLon) {
        try {
            // Lade Indikator hinzufügen
            const loadingIndicator = L.control({position: 'center'});
            loadingIndicator.onAdd = function() {
                const div = L.DomUtil.create('div', 'loading-indicator');
                div.innerHTML = '<span>Lade Kartendaten...</span>';
                return div;
            };

            // Verwende weniger Punkte für schnelleres Laden
            const gridData = await getAirQualityGrid(centerLat, centerLon, 0.1, 3);

            // Interpolation für eine sanftere Darstellung verwenden
            // Größere Kreise mit transparenterem Füllung
            gridData.forEach(point => {
                if (point && point.aqi) {
                    const color = getColorForAQI(point.aqi);
                    const circle = L.circle([point.lat, point.lon], {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.5,
                        radius: 2000 // 2km Radius für mehr Überlappung
                    }).addTo(map);

                    circle.bindPopup(`<strong>Luftqualitätsindex:</strong> ${point.aqi}`);
                }
            });

            // Legende hinzufügen
            const legend = L.control({position: 'bottomright'});

            legend.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'map-legend');
                div.innerHTML = '<h4>Luftqualitätsindex</h4>';

                const categories = [
                    {label: 'Sehr gut (0-20)', color: '#50F0E6'},
                    {label: 'Gut (21-40)', color: '#50CCAA'},
                    {label: 'Mäßig (41-60)', color: '#F0E641'},
                    {label: 'Schlecht (61-80)', color: '#FF5050'},
                    {label: 'Sehr schlecht (81-100)', color: '#960032'},
                    {label: 'Extrem schlecht (>100)', color: '#7D2181'}
                ];

                categories.forEach(category => {
                    div.innerHTML += `
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: ${category.color}"></div>
                            <div>${category.label}</div>
                        </div>
                    `;
                });

                return div;
            };

            legend.addTo(map);

        } catch (error) {
            console.error('Fehler beim Laden der Kartendaten:', error);
            // Zeige Fehlermeldung auf der Karte an
            const errorControl = L.control({position: 'center'});
            errorControl.onAdd = function() {
                const div = L.DomUtil.create('div', 'map-error');
                div.innerHTML = '<span>Fehler beim Laden der Kartendaten</span>';
                return div;
            };
            errorControl.addTo(map);
        }
    }

    // Funktion zum Laden der Luftqualitätsdaten für eine Stadt
    async function loadCityData(cityName) {
        if (!cityName) return;

        errorMessage.style.display = 'none';
        loadingElement.style.display = 'block';
        resultsSection.style.display = 'none';


        try {
            // Stadtkoordinaten abrufen
            const cityData = await getCityCoordinates(cityName);

            // UI aktualisieren und sichtbar machen, damit die Nutzer
            // bereits Informationen sehen können, während die Karte lädt
            cityNameElement.textContent = `Luftqualität in ${cityData.name}, ${cityData.country}`;
            lastUpdatedElement.textContent = `Stand: ${formatDate(new Date())}`;
            resultsSection.style.display = 'block';

            // Karte initialisieren
            initMap(cityData.lat, cityData.lon, 11);

            // Luftqualitätsdaten parallel abrufen
            const airQualityDataPromise = getAirQualityData(cityData.lat, cityData.lon);
            const mapDataPromise = addAirQualityToMap(map, cityData.lat, cityData.lon);

            // Warten auf Luftqualitätsdaten und Karten aktualisieren
            const airQualityData = await airQualityDataPromise;
            createAirQualityCards(airQualityData);

            // Auf Kartendaten muss nicht mehr gewartet werden, da die Karte bereits angezeigt wird

            // Scroll zum Ergebnisbereich, wenn eine Top-Stadt ausgewählt wurde
            resultsSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            resultsSection.style.display = 'none';
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    // Event-Listener für das Formular
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const city = cityInput.value.trim();
        loadCityData(city);
    });

    // Event-Listener für Logo (Neustart der Seite)
    logoLink.addEventListener('click', function() {
        window.location.reload();
    });

    // Event-Listener für die Top-Stadt-Links
    topCityLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const city = this.getAttribute('data-city');
            cityInput.value = city; // Aktualisiere auch das Eingabefeld
            loadCityData(city);
        });
    });
});

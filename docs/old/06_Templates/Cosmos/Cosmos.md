# Cosmos

## Purpose

Dieses Dokument definiert den zentralen Arbeitsraum von Cosmos.

Cosmos bildet die gemeinsame Umgebung, in der alle Projects, Nodes und Beziehungen dauerhaft organisiert werden.

Es beschreibt die räumliche Interaktion mit dem System und bildet den Ausgangspunkt sämtlicher Arbeitsabläufe.

---

## Responsibilities

Cosmos ist verantwortlich für:

- die Darstellung des gemeinsamen Arbeitsraums,
- die Navigation zwischen Projects,
- die Positionierung von Projects und Nodes,
- die Orientierung des Nutzers,
- die Visualisierung von Beziehungen,
- die Verwaltung der räumlichen Ansicht.

Cosmos enthält keine Werkzeuge und übernimmt keine Produktionsaufgaben.

---

## Spatial Workspace

Cosmos besteht aus einem zusammenhängenden Arbeitsraum.

Der Nutzer bewegt sich nicht zwischen einzelnen Seiten, sondern innerhalb einer gemeinsamen Umgebung.

Der Arbeitsraum unterstützt:

- Pan
- Zoom
- Focus
- Quick Travel

Die Position des Nutzers bleibt jederzeit nachvollziehbar.

---

## Startup Experience

Beim Start öffnet Cosmos zunächst die Gesamtübersicht des aktuellen Arbeitsraums.

Anschließend bewegt sich die Kamera automatisch zur zuletzt verwendeten Position.

Dadurch bleibt sowohl die Orientierung innerhalb des gesamten Cosmos als auch die Kontinuität der letzten Arbeitssitzung erhalten.

Beim ersten Start stellt Cosmos ein Beispielprojekt bereit, das die grundlegenden Möglichkeiten des Systems demonstriert.

---

## Projects

Projects bilden eigenständige Bereiche innerhalb des Cosmos.

Neue Projects werden automatisch mit sinnvollen Abständen innerhalb der bestehenden Umgebung platziert.

Anschließend können Projects frei verschoben werden.

Die Position eines Projects bleibt dauerhaft erhalten.

Projects wachsen organisch gemeinsam mit dem Arbeitsraum.

---

## Nodes

Nodes befinden sich innerhalb ihrer jeweiligen Projects.

Sie können frei angeordnet werden.

Manuell angeordnete Strukturen besitzen immer Vorrang vor automatischen Platzierungen.

Cosmos verändert die Organisation eines Projects niemals eigenständig.

---

## Camera

Cosmos besitzt eine frei bewegliche Kamera.

Die Kamera unterstützt:

- Pan
- Zoom zur Mausposition
- Focus
- Quick Travel

Die Kameraposition wird projektabhängig gespeichert.

---

## Navigation

Cosmos unterstützt mehrere gleichwertige Navigationsformen.

### Spatial Navigation

Der Nutzer bewegt sich frei innerhalb des Arbeitsraums.

### Quick Travel

Der Nutzer kann jederzeit direkt zwischen Projects wechseln.

Vor jedem Wechsel werden offene Änderungen automatisch gespeichert.

### Assisted Navigation

Companion unterstützt den Nutzer beim Auffinden von Projects, Nodes und Informationen.

---

## Context

Cosmos unterscheidet zwischen Position und Context.

Die Position beschreibt den aktuellen Aufenthaltsort innerhalb des Arbeitsraums.

Der Context beschreibt den aktiven Arbeitskontext.

Der Context orientiert sich ausschließlich am aktiven Project oder am globalen Cosmos.

Einzelne Nodes verändern den Context nicht automatisch.

---

## Base

Die Base begleitet den Nutzer dauerhaft.

Sie bildet den zentralen Zugang zu allen Systemen und Werkzeugen.

Die Base besitzt eine Standardposition, kann jedoch frei verschoben werden.

Die letzte Position der Base wird gespeichert.

Die konkrete Darstellung der Base wird vollständig durch das aktive Theme bestimmt.

---

## Search

Die globale Suche gehört zum Archive.

Companion verwendet dieselbe Suchfunktion und dient als alternativer Einstiegspunkt.

Suchergebnisse können Projects, Nodes, Knowledge, Capture-Inhalte oder Dateien umfassen.

---

## Connectors

Connectoren visualisieren Beziehungen zwischen Nodes.

Cosmos unterscheidet zwischen:

- Structural Connectors
- Inferred Connectors

Structural Connectors beschreiben die beabsichtigte Struktur.

Inferred Connectors visualisieren automatisch erkannte Zusammenhänge.

Automatisch erzeugte Connectoren verändern niemals die manuelle Struktur eines Projects.

---

## Level of Detail

Die Darstellung des Arbeitsraums passt sich automatisch dem aktuellen Fokus an.

Beim Herauszoomen reduziert Cosmos die sichtbaren Details.

Beim Fokussieren eines Projects werden dessen Inhalte vollständig dargestellt.

Die Orientierung bleibt unabhängig vom Zoom jederzeit erhalten.

---

## Themes

Das aktive Theme bestimmt ausschließlich die Darstellung des Cosmos.

Dazu gehören unter anderem:

- Hintergrund
- Farben
- Animationen
- Nodes
- Connectoren
- Base
- Bezeichnungen

Die zugrunde liegende Funktionalität bleibt unverändert.

---

## Future Extensions

Die Architektur des Cosmos soll zukünftige Erweiterungen ermöglichen.

Dazu gehören beispielsweise:

- weitere Themes
- Collaboration
- zusätzliche Darstellungsformen
- alternative Navigationskonzepte
- neue Visualisierungsmöglichkeiten

Neue Erweiterungen dürfen die bestehenden Grundprinzipien des Cosmos nicht verletzen.

---

## Design Goal

Cosmos soll sich nicht wie eine Sammlung einzelner Seiten anfühlen.

Cosmos soll sich wie eine zusammenhängende Arbeitswelt anfühlen, die gemeinsam mit ihrem Nutzer wächst.

Der Nutzer arbeitet dauerhaft innerhalb derselben Umgebung und nicht zwischen voneinander getrennten Ansichten.

---

## Principles

- Cosmos bildet den zentralen Arbeitsraum des Systems.
- Orientierung besitzt Vorrang vor Geschwindigkeit.
- Räumlicher Kontext bleibt jederzeit erhalten.
- Projects wachsen organisch innerhalb des Cosmos.
- Manuelle Organisation besitzt Vorrang vor automatischen Änderungen.
- Themes verändern ausschließlich die Darstellung.
- Cosmos bleibt langfristig konsistent, erweiterbar und verständlich.

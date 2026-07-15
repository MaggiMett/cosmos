# Implementation

## Purpose

Dieses Dokument definiert die grundlegenden Implementierungsregeln von Cosmos.

Es beschreibt, wie die Produktspezifikation in Software übersetzt wird, ohne Produktentscheidungen neu zu interpretieren.

Implementation beschreibt Architekturprinzipien, Verantwortlichkeiten und technische Grenzen.

Technologien, Frameworks und Programmiersprachen sind austauschbar und gehören nicht zu diesem Dokument.

---

## Source of Truth

Die Product Bible ist die verbindliche Quelle für das Verhalten von Cosmos.

Implementierungen orientieren sich immer an den folgenden Dokumenten:

1. Vision
2. Domain
3. Systems
4. Experience
5. Implementation

Falls bestehender Code der Product Bible widerspricht, besitzt die Product Bible Vorrang.

Abweichungen werden dokumentiert und nicht eigenständig interpretiert.

---

## Runtime Language

Die Runtime verwendet ausschließlich neutrale Begriffe.

Theme-spezifische Begriffe dürfen niemals Bestandteil der Runtime sein.

Beispiele:

- Cosmos
- Project
- Node
- Connector
- Base
- Quick Travel
- Context
- Knowledge
- Capture
- Workbench
- Module
- Theme

Themes dürfen diese Begriffe ausschließlich visuell und sprachlich übersetzen.

---

## Architecture Layers

Cosmos trennt seine Architektur in mehrere Verantwortungsbereiche.

### Domain Layer

Beschreibt ausschließlich fachliche Objekte.

### System Layer

Beschreibt Verantwortlichkeiten und autonome Systeme.

### Interaction Layer

Beschreibt Navigation und Nutzerinteraktionen.

### Presentation Layer

Beschreibt Darstellung, Themes und Animationen.

### Integration Layer

Beschreibt externe Systeme und Schnittstellen.

Jede Schicht besitzt klar definierte Verantwortlichkeiten.

---

## Domain Requirements

Die Runtime muss das in der Product Bible definierte Domänenmodell vollständig unterstützen.

Projects bestehen aus einer strukturellen Node-Hierarchie.

Nodes besitzen ausschließlich strukturelle Rollen.

Connectoren werden getrennt gespeichert als:

- Structural Connector
- Inferred Connector

Structural Connectoren dürfen niemals automatisch verändert werden.

---

## State and Persistence

Cosmos speichert Zustände auf mehreren Ebenen.

### Global

- Einstellungen
- Theme
- Base

### Project

- Layout
- Focus
- Workbench
- Camera

### Node

- Position
- Zustand
- Referenzen

### Session

- temporäre Eingaben
- offene Aktionen

Persistenz soll den Arbeitsfluss unterstützen und niemals behindern.

---

## Save and Undo

Cosmos speichert Änderungen automatisch in sinnvollen Abständen.

Zusätzlich erfolgt ein Speichervorgang:

- vor Quick Travel
- vor dem Verlassen eines Projects
- auf Wunsch des Nutzers

Undo betrifft ausschließlich Nutzeraktionen.

Autonome Hintergrundprozesse besitzen eigene Zustände.

---

## Context

Die Runtime kennt ausschließlich zwei automatische Context-Ebenen.

- Global Cosmos Context
- Project Context

Nodes verändern den Context nicht automatisch.

Context Builder erzeugt Arbeitskontexte, verändert jedoch niemals Originaldaten.

---

## Spatial Workspace

Die Runtime unterstützt einen frei navigierbaren Arbeitsraum.

Dazu gehören:

- Pan
- Zoom
- Focus
- Quick Travel
- freie Node-Positionierung
- automatische Erstplatzierung
- gespeicherte Positionen
- Level of Detail

Der Arbeitsraum besitzt keine klassische Seitenstruktur.

---

## Base and Modules

Die Base bildet die permanente Interaktionsschicht von Cosmos.

Sie stellt Systemmodule bereit.

Workbench enthält Module.

Module sind Werkzeuge und keine eigenständigen Systeme.

---

## Theme Architecture

Themes verändern ausschließlich die Darstellung.

Sie dürfen verändern:

- Farben
- Hintergründe
- Icons
- Animationen
- Base
- Companion
- Nodes
- Connectoren
- Fenster
- Bezeichnungen

Themes dürfen niemals:

- Runtime verändern
- Datenmodelle verändern
- Systemverantwortlichkeiten verändern
- Workflows verändern

---

## AI Independence

Companion ist unabhängig von einzelnen KI-Modellen.

Alle KI-Anbieter und Modelle müssen austauschbar bleiben.

Journeyman kann spezialisierte Modelle verwenden.

Companion kommuniziert.

Journeyman produziert.

MCP vermittelt Werkzeuge.

---

## MCP

MCP stellt definierte Werkzeuge für andere Systeme bereit.

MCP besitzt keine eigene Intelligenz.

MCP trifft keine Entscheidungen.

MCP verändert keine Daten eigenständig.

---

## Files

Dateien gehören zur Runtime.

Files sind global verfügbar.

Projects und Nodes können Dateien referenzieren.

Dateien besitzen keine Kenntnis über Projects oder Nodes.

---

## Quality Management

Autonome Systeme übergeben offene Fragen, Konflikte und Reviews an Quality Management.

Quality Management dient ausschließlich der Sicherung der Arbeitsqualität.

Es ersetzt keine Benachrichtigungszentrale.

---

## Testing

Jede Implementierung muss überprüfbar sein.

Neue Funktionen benötigen passende Tests.

Eine Implementierung gilt erst als abgeschlossen, wenn:

- die Product Bible eingehalten wird,
- bestehende Funktionen weiterhin korrekt arbeiten,
- neue Tests erfolgreich sind.

---

## Codex Execution Rules

Codex arbeitet ausschließlich auf Basis der Product Bible und des bestehenden Repositorys.

Vor jeder Implementierung gilt:

1. Product Bible lesen
2. bestehenden Code analysieren
3. Aufgabe verstehen
4. Umsetzung planen
5. implementieren
6. testen
7. dokumentieren

Codex darf niemals:

- Produktentscheidungen treffen
- UX eigenständig verändern
- neue Begriffe einführen
- Theme-Begriffe in die Runtime übernehmen
- Spezifikationen stillschweigend ändern

Bei Unklarheiten muss Codex Rückfragen stellen.

---

## Principles

- Die Product Bible besitzt Vorrang vor Implementierungsdetails.
- Runtime und Theme bleiben strikt getrennt.
- Systeme besitzen klar definierte Verantwortlichkeiten.
- Externe Technologien bleiben austauschbar.
- Nutzer behalten jederzeit die Kontrolle.
- Implementierungen folgen der Spezifikation und interpretieren sie nicht neu.
- Architektur soll langfristig verständlich, testbar und erweiterbar bleiben.

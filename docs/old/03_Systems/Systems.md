# Systems

## Purpose

Dieses Dokument definiert die Verantwortlichkeiten der einzelnen Systeme innerhalb von Cosmos.

Ein System besitzt genau eine Hauptverantwortung und arbeitet mit anderen Systemen zusammen, ohne deren Aufgaben zu übernehmen.

Systeme beschreiben ausschließlich Verhalten und Verantwortlichkeiten.

Benutzeroberflächen, Implementierungsdetails und Technologien gehören nicht zu diesem Dokument.

---

## User Systems

User Systems bilden die direkte Interaktionsschicht zwischen Nutzer und Cosmos.

Sie stellen Informationen, Werkzeuge und Arbeitsbereiche bereit und dienen als Einstiegspunkt für sämtliche Nutzerinteraktionen.

### Cosmos

Cosmos bildet die zentrale Arbeitsumgebung des Nutzers.

Es organisiert Projects, Nodes und deren Beziehungen innerhalb einer gemeinsamen Umgebung.

### Companion

Companion ist der persönliche Begleiter des Nutzers.

Er kommuniziert, erklärt, unterstützt beim Brainstorming und vermittelt Aktionen an andere Systeme.

Companion besitzt keine eigene Produktionslogik.

Sein Kommunikationsstil passt sich mit der Zeit an den Nutzer an, ohne seine eigene Identität zu verlieren.

### Workbench

Die Workbench stellt Werkzeuge und Module zur Verfügung.

Sie passt ihren Zustand automatisch an den aktuellen Arbeitskontext an.

### Capture

Capture dient als Einstiegspunkt für neue Gedanken, Ideen und Informationen.

Es unterstützt sowohl freie Gedanken als auch strukturierte Eingaben.

### Quality Management

Quality Management sammelt offene Fragen, Reviews, Entscheidungen und fehlende Informationen.

Es unterstützt den Nutzer bei der Sicherung der Arbeitsqualität, ohne den Arbeitsfluss unnötig zu unterbrechen.

---

## Autonomous Systems

Autonomous Systems arbeiten eigenständig im Hintergrund.

Sie unterstützen den Nutzer, treffen jedoch keine kreativen oder fachlichen Entscheidungen an seiner Stelle.

### Journeyman

Journeyman bildet das Produktionssystem von Cosmos.

Er analysiert Aufgaben, plant Arbeitsschritte und führt Produktionsprozesse aus.

Journeyman besteht aus mehreren internen Komponenten:

- Planner
- Prompt Builder
- Analysis Engine
- Reviewer
- Executor

Diese Komponenten unterstützen gemeinsam den Produktionsprozess.

### Knowledge Processor

Der Knowledge Processor verarbeitet Informationen aus unterschiedlichen Quellen, darunter Capture, Chats, Dateien und Nutzerentscheidungen.

Er erzeugt daraus langfristiges Knowledge.

### Context Builder

Der Context Builder erstellt den optimalen Arbeitskontext für andere Systeme.

Er stellt sicher, dass Companion, Journeyman und Workbench jederzeit mit den relevantesten Informationen arbeiten.

---

## Infrastructure Systems

Infrastructure Systems bilden die gemeinsame Grundlage aller anderen Systeme.

Sie arbeiten im Hintergrund und stellen zentrale Funktionen bereit.

### Context

Context beschreibt den aktuellen Arbeitsfokus innerhalb von Cosmos.

Er verbindet Projekte, Knowledge und Werkzeuge miteinander.

### Theme

Das Theme System definiert ausschließlich die Darstellung von Cosmos.

Es beeinflusst Farben, Hintergründe, Icons, Animationen und andere visuelle Elemente, ohne die Funktionalität des Systems zu verändern.

### MCP

Der Model Context Protocol (MCP) stellt anderen Systemen Werkzeuge und Fähigkeiten zur Verfügung.

MCP besitzt keine eigene Intelligenz und trifft keine Entscheidungen.

---

## External Systems

External Systems befinden sich außerhalb von Cosmos.

Sie erweitern die Fähigkeiten des Systems, gehören jedoch nicht zur eigentlichen Runtime.

Beispiele sind:

- KI-Modelle
- Internet
- Git
- Dateisystem
- APIs
- Plugins

Alle externen Systeme sind optional und sollen austauschbar bleiben.

---

## Principles

- Jedes System besitzt genau eine Hauptverantwortung.
- Systeme arbeiten zusammen, übernehmen jedoch niemals die Verantwortlichkeiten anderer Systeme.
- Benutzeroberflächen gehören nicht zu den Systemen.
- Technologien gehören nicht zu den Systemen.
- Externe Dienste bleiben jederzeit austauschbar.
- Cosmos soll unabhängig von einzelnen Technologien oder Anbietern bleiben.

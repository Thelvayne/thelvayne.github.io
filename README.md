# Projekt Game Of The Amazons

Im Rahmen dieses Abschlussprojektes soll eine Bedienoberfläche für das Spiel [*Game of the Amazons*](https://de.wikipedia.org/wiki/Amazonen_(Spiel)) entwickelt werden. Dabei soll ein Spieler gegen einen von einer künstlichen Intelligenz gesteuerten Spieler antreten. Der KI-Spieler soll nicht entwickelt werden.

## Anforderungen/Features:

Die Anforderungen entnehmen Sie bitte der jeweiligen Moodle-Seite zu ihrem Abschlussprojekt-Thema.

## Anmerkung

Das Projekt wird in Zusammenarbeit mit der Universität Paderborn umgesetzt. Ein Webservice zur Aktivierung von entsprechenden Computerspielern steht bereits zur Verfügung. 

## Kommunikation

Die folgenden Aufrufe folgen den REST-Prinzipien. Möglichst alle Daten werden in JSON übergeben. Ausnahmen können hierbei beispielsweise bei Fehlermeldungen auftreten. Kommunizieren Sie diese im Zweifelsfall an [Toni Barth](mailto:toni.barth@hs-anhalt.de), damit diese Fehler behoben werden können.
 
Selbiges gilt auch für fehlerhafte Daten, fehlende API-Aufrufe oder Situationen, in denen zusätzliche Daten oder Funktionen hilfreich wären.

### API-Spezifikation

Sämtliche Aufrufe sollten mit dem Status-Code 200 antworten, sofern der Aufruf erfolgreich war. Fehlerhafte Aufrufe sollten mit dem Status-Code 400 und einem hilfreichen Fehlertext beantwortet werden. Ausnahmen können hierbei Fehler in der Programmierung des Backends darstellen, bei welchen üblicherweise mit Status-Code 500 und einer Webseite im HTML-Format geantwortet wird, welche den Stacktrace des Fehlers beinhaltet. In diesem Fall, leiten Sie diesen bitte an [Toni Barth](mailto:toni.barth@hs-anhalt.de) weiter.

#### Spieler

##### Spieler anlegen

**POST**: `/players/`

Parameter:

* name (string): Spielername
* controllable (bool): handelt es sich um einen KI-Spieler (false) oder um einen menschlichen Spieler (true)?

Body:

```json
{
    "name":"Spieler1",
    "controllable":true,
}
```

Response: `200 OK`

```json
{
    "name":"Spieler1",
    "controllable":false,
    "id":0
}
```

##### alle Spieler abfragen

**GET**: `/players/`

Response: `200 OK`

```json
{
    "players": [
        {
            "id":0,
            "name":"Spieler 1",
            "controllable":true
        },
        {
            "id":1,
            "name":"Spieler 2",
            "controllable":false
        }
        // ...
    ]
}
```

##### einen Spieler löschen

**DELETE**: `/players/:id`

Parameter:

* id (int): Spieler ID

Response: `200 OK`

#### Spiel

##### Ein neues Spiel starten

**POST**: `/games/`

Parameter:

* maxTurnTime (int): Millisekunden, welche jeder Spieler Zeit hat, um seinen Zug auszuführen
* board (Board): Das Spielbrett, auf welchem das Spiel stattfindet (siehe Body)
* players (Array): Liste der Spieler-IDs, welche an diesem Spiel teilnehmen sollen (2 IDs notwendig)

Body:

```json
{
    "maxTurnTime": 60000, // eine Minute
    "players": [
        0,
        1
    ],
    "board": {
        "gameSizeRows": 10, // Zeilen des Spielbrettes
        "gameSizeColumns": 10, // Spalten des Spielbrettes
        "squares": [ // Liste von Zeilen des Spielbrettes (von 0 bis gameSizeRows - 1)
            // folgende Integer-Werte sind in diesen Arrays erlaubt:
            // 0: Amazone des Spielers mit Index 0 in players
            // 1: Amazone des Spielers mit Index 1 in players
            // -1: leeres Feld
            // -2: Giftpfeil
            [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
            [0, -1, -1, -1, -1, -1, -1, -1, -1, 0],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [1, -1, -1, -1, -1, -1, -1, -1, -1, 1],
            [1, -1, 1, -1, 1, -1, 1, -1, 1, -1]
        ]
    }
}
```

Response: `200 OK`

```json
{
    "id": 0,
    "players": [
        {
            "id": 0,
            "name": "Spieler1",
            "controllable": true
        },
        {
            "id": 1,
            "name": "Spieler2",
            "controllable": false
        }
    ]
}
```

##### alle Spiele abfragen

**GET**: `/games/`

Response: `200 OK`

```json
{
    "games": [
        {
            "id": 0,
            "winningPlayer": 0, // optional: gibt den Siegspieler an
            "players": [
                {
                    "id": 0,
                    "name": "Spieler 1",
                    "controllable": true
                },
                {
                    "id": 1,
                    "name": "Spieler 2",
                    "controllable": false
                }
            ]
        },
        {
            // ...
        }
        // ...
    ]
}
```

##### ein bestimmtes Spiel und dessen aktuellen Zustand abfragen

**GET**: `/games/:id`

Parameter:

* id (int): ID des Spiels

Response: `200 OK`

```json
{
    "id": 0,
    "turnPlayer": 0, // Spieler, der gerade am Zug ist (entweder 0 oder 1, Index des Spielers im players-Array dieses Objektes)
    "winningPlayer": 0, // optional: gibt an, welcher Spieler gewonnen hat
    "board": { // siehe oben
        // ...
    },
    "maxTurnTime": 60000, // maximale Zugzeit
    "remainingTurnTime": 59000, // verbleibende Zugzeit
    "turns": [ // Liste aller Züge
        {
            "move": {
                "start": {
                    "row": 3, // Startzeile der Bewegung
                    "column": 2, // Startspalte der Bewegung
                },
                "end": {
                    "row": 5, // Zielzeile der Bewegung
                    "column": 2, // Zielspalte der Bewegung
                }
            },
            "shot": {
                "row": 3, // Zeile des Pfeilschusses
                "column": 2, // Spalte des Pfeilschusses
            }
        },
    ],
    "players": [
        {
            "id":0,
            "name":"Spieler 1",
            "controllable":true
        },
        {
            "id":1,
            "name":"Spieler 2",
            "controllable":false
        }
    ]
}
```

##### ein Spiel löschen

**DELETE**: `/games/:id`

Parameter:

* id (int): ID des Spiels

Response: `200 OK`

#### Züge

##### einen Zug setzen

**POST**: `/move/:playerId/:gameId`

Parameter:

* playerId (int): ID des Spielers, welcher den Zug setzt
* gameId (int): ID des Spiels

Body:

```json
{
    "move": {
        "start": {
            "row": 3, // Startzeile der Bewegung
            "column": 2, // Startspalte der Bewegung
        },
        "end": {
            "row": 6, // Zielzeile der Bewegung
            "column": 2, // Zielspalte der Bewegung
        }
    },
    "shot": {
        "row": 5, // Zeile des Pfeilschusses
        "column": 2, // Spalte des Pfeilschusses
    }
}
```

Response: `200 OK`

#### Resetting

##### Alles auf Standardwerte zurücksetzen (bedarf keiner Authentifizierung)

**DELETE**: `/reset/`

Response: `200 OK`

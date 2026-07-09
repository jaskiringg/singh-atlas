# Atlas 3D Room — Design

## Concept: **The Singh Command Room**

A first-person 3D space you enter like a game. Not a website with a 3D background — the room *is* the interface.

```
                    ┌─────────────────────────┐
                    │   RECRUITER MONOLITH    │  ← spawn facing this (HR glance)
                    │   (all facts on screen) │
                    └─────────────────────────┘
                             
     [Brain]                              [Operate]
         ╲                                  ╱
          ╲    ┌─── SINGH CORE ───┐        ╱
           ╲   │   (dodecahedron)  │      ╱
            ╲  └───────────────────┘     ╱
     [Mitra] ───────── floor ─────── [Enterprise]
                    ╱         ╲
              [PIKU]           [Relive]
```

## Modes (same room, two speeds)

| Visitor | Experience |
|---------|------------|
| **Recruiter** | Spawns facing monolith. Reads everything without moving. Optional: turn around later. |
| **Founder** | Clicks to play. WASD walk. E on glowing stations. Bloom, fog, portals. |

## Controls

- **Click** — lock mouse (enter game)
- **WASD** — walk
- **Mouse** — look
- **E** — interact with nearest station
- **ESC** — unlock / close app panel / return to room

## Stations → Apps

Each station is a 3D portal (pedestal + ring + particles). Interacting opens a fullscreen in-world terminal with app content — room stays mounted behind.

## Visual language

- Void black room, reflective grid floor
- Accent `#5e6ad2` + per-app colors
- Fog, bloom, emissive strips on walls
- PIKU cyan only at PIKU station

## Tech

- R3F + drei PointerLockControls
- Html for monolith + HUD (crisp text in 3D space)
- Postprocessing bloom
- Single `AtlasExperience` component — `/` and `/os` both load it

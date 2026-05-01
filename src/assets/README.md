# Image assets

Every image on the site lives under this folder.

## Where new images go

```
src/assets/
├── hero/                       Homepage + location-page hero strip
├── services/
│   ├── childrens-parties/      /childrens-parties/
│   ├── milestones/             /milestone-celebrations/
│   └── corporate/              /corporate-brand-styling/
├── locations/
│   ├── cobham/                 /party-styling-cobham/
│   ├── weybridge/              /party-styling-weybridge/
│   ├── esher/                  /party-styling-esher/
│   ├── reigate/                /party-styling-reigate/
│   ├── oxshott/                /party-styling-oxshott/
│   ├── guildford/              /party-styling-guildford/
│   ├── walton-on-thames/       /party-styling-walton-on-thames/
│   ├── dorking/                /party-styling-dorking/
│   └── oxted/                  /party-styling-oxted/
├── journal/
│   └── lollipop-rebrand/       Rebrand article
├── social/                     Per-page 1200×630 OG share images
└── shared/                     Brand assets, studio shots, Laura portrait
```

Subfolders are empty — drop images straight in.

## Adding new images — workflow

1. **Drop raw files** (any format — JPG, PNG, HEIC from iPhone) into
   the relevant subfolder. Name them descriptively. Example:
   `locations/cobham/cake-table-pastel-pink.jpg`.

2. **Tell Claude** when you push. Include:
   - **Where it goes** (which page/section)
   - **One sentence** describing what's in the photo (used for alt text)
   - **Focal point** if not centred — e.g. "cake is in the bottom-third,
     don't crop that out"
   - **Size category**:
     - `hero` (1920 px wide max)
     - `content` (1280 px wide max)
     - `social` (fixed 1200×630)

3. **Claude does the rest:**
   - Convert to WebP, quality 75
   - Resize so the longest side hits the cap
   - Place into the right subfolder
   - Update the relevant data file to import + use it
   - Write the alt text following the site convention
   - Set `objectPosition` if the subject isn't centred

## Existing images

Files in the **root** of `src/assets/` (e.g. `cp-celebrations.webp`,
`hero-2.webp`, `studio.webp`) were imported before this structure
existed. They stay where they are to avoid breaking dozens of imports
across the codebase. New imagery uses the subfolders above.

## Why WebP

Smaller files (25-35% leaner than JPEG at the same visual quality) →
faster page loads → better Core Web Vitals score → better SEO. Every
modern browser supports it.

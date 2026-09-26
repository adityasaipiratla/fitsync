# FitSync Dashboard — Personal Fitness & Nutrition Tracker

A lightweight, **zero-cost, privacy-first, local-browser personal health dashboard** designed for daily calorie/protein logging, vegetarian diet tracking, 4-day dumbbell & pull-up workout splits, recovery monitoring, and data backups.

## Key Features

- **Vegetarian Cut Profile Defaults**: Pre-configured target macros (~1,700 kcal / ~130g protein / 70.0 kg target weight).
- **22-Item Vegetarian Food Cheatsheet**: Quick-add staples (Phulkas, Amul Protein Curd, Whey, Rajma, Soya, Makhana, Omelettes).
- **4-Day Home Workout Split Cards**: Monday Upper Body + Pull-ups, Tuesday Legs, Wednesday Upper Focus, Thursday Legs Emphasis (from `Daily_Workout_Checklist_Cards.txt`).
- **Daily Post-Workout Recovery Log**: Soreness (1-10), mood/energy, knee/joint status, session notes.
- **Zero-Cost & Private**: Runs entirely in your browser using local `localStorage` persistence.
- **JSON Backup Export & Restore**: Download or upload full backup JSON files from Settings anytime.
- **Local Network Serving (Phone/Tablet)**: Serve on your home Wi-Fi for multi-device access without public internet exposure.

## Quick Start (Local Use)

1. Open `index.html` directly in any web browser, OR serve locally via Python:

```bash
cd "/Users/adityapiratla/Library/CloudStorage/OneDrive-LondonBusinessSchool/Work/_Personal/Fitness"
python3 -m http.server 8000
```

2. Open `http://localhost:8000` on your Mac.

## Accessing from iPhone / iPad / Tablet (Home Wi-Fi LAN)

To access your dashboard from your phone or tablet on the same Wi-Fi network:

1. Open Safari / Chrome on your phone or tablet on home Wi-Fi and visit:
   `http://192.168.1.4:8000`

> **Note:** LAN access requires your Mac to be awake and connected to the same Wi-Fi network.

## Optional Cloud Sync (Supabase Email Auth)

If you want cross-device cloud sync without public web hosting:

1. Create a free Supabase project at `https://supabase.com`.
2. Execute the SQL in `supabase-schema.sql`.
3. Enable Email/Password auth in Supabase Authentication settings.
4. Add your project URL and Anon Key to `config.js`:

```js
window.__FITNESS_APP_CONFIG__ = {
  supabaseUrl: 'https://your-project-id.supabase.co',
  supabaseAnonKey: 'your-anon-key-here'
};
```

## Data Privacy & Backups

- All log data remains stored locally on your device in `localStorage`.
- You can export a full `.json` backup file from the **Settings & Data Backup** menu.
- If you move devices or clear browser data, simply upload your saved `.json` file in Settings to restore all historical logs instantly.

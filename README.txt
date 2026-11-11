# AI Car Mechanic — iPhone PWA starter

This is a web app that can be hosted from Windows and added to an iPhone Home Screen.

## Run a local preview on Windows
1. Extract this ZIP to a folder.
2. Install Python 3 from python.org if it is not already installed.
3. Open Command Prompt in this folder.
4. Run: `py -m http.server 8000`
5. On the PC, open `http://localhost:8000`.

The local preview is useful for testing on the PC. For iPhone installation, the site must be hosted over HTTPS and opened in Safari.

## Publish free with GitHub Pages
1. Create or sign in to a GitHub account.
2. Create a new public repository, for example `ai-car-mechanic`.
3. Upload all files in this folder to the repository root (not the ZIP itself).
4. In repository Settings → Pages, choose deploy from a branch, select `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the HTTPS site. Its URL will look like `https://YOUR-USERNAME.github.io/ai-car-mechanic/`.
6. Open that URL in Safari on your iPhone.
7. Tap Share → Add to Home Screen → Add.
8. Open the installed app once while online so its app shell is cached. Then the included guides and app interface can load offline.

## Included features
- Responsive phone-friendly layout
- Four tabs: Identify, Diagnose, Repair, My Garage
- Select a car/component photo as a visual reference
- Manually enter vehicle make, model, year, engine, registration/VIN and notes
- Save/delete vehicle records in browser local storage
- Offline symptom check suggestions
- Offline built-in general repair guides
- Service worker caches the app shell for offline use

## Limitations — read before relying on it
This is a functional starter PWA, not a full AI mechanic:
- The photo picker does not recognise a vehicle. No image-recognition model or vehicle database is included.
- Symptom checks are general rule-based prompts, not AI diagnosis.
- It does not contain VIN decoding, exact vehicle specifications, wiring diagrams, torque values, workshop manuals, parts catalogues or confirmed part compatibility.
- Offline data stays in the browser storage on that iPhone. Clearing Safari website data can erase it. This starter does not sync records between devices.
- A PWA cannot provide all native iOS capabilities. A later native app could add Core ML, Bluetooth OBD-II adapters and richer offline data packs.

## Safety
Do not treat generic guidance as a vehicle-specific repair procedure. Use the exact vehicle workshop manual for torque values, fluids, jacking points and procedures. Airbags, brakes, steering, fuel systems and high-voltage hybrid/EV systems require appropriate training. Stop driving for brake failure, severe overheating, oil-pressure warnings, smoke, fuel smell or steering faults.

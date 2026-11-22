AI Car Mechanic — iPhone PWA

This project is a Progressive Web App for GitHub Pages. See SETUP-AI.txt for the one-time secure AI service setup and publishing instructions.

Features:
- Identify, Diagnose, Repair and My Garage sections.
- Multiple vehicles stored locally on the device.
- Repair search requires selecting one vehicle from My Garage.
- AI repair guidance is generated through a Cloudflare Worker connected to the OpenAI Responses API.
- The OpenAI API key is stored as a Cloudflare Worker secret, not in browser code.
- Built-in repair guides remain available offline; AI answers require internet access.

The app sends only selected vehicle year/make/model/engine and the repair question to the AI service. It does not send VIN/registration or garage notes.

Safety: AI guidance is educational and may be incomplete or incorrect. Verify exact procedures, parts, fluids and torque values against the correct workshop manual. Safety-critical work should be performed by a qualified technician.

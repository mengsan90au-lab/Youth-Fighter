# Optional solo map testing — v0.5.0

The five new wards are available in normal browser gameplay and LAN; they do not need a debug unlock. Use **Walk to Market Ward** for ordinary city entry.

For unfinished-country testing, click **Map entrances [TEST]** or **Unlock ALL maps for testing** in the atlas. All 127 browser locations become enterable. Seven retain implemented gameplay (old city, grove, five wards); 120 use generated test layouts. Every location receives Next/Previous test entrances in a connected circuit, with safe district-specific spawns. These are debug routes, not final political/geographic transport links.

The explicit TEST: Travel here button remains available in solo sandbox mode. Original progress is saved before enabling it; subsequent autosaves use the testing slot. Reload to return to normal locks. Test progress is not automatically loaded into normal play. Debug unlock/travel is unavailable to LAN clients and is never added to the server command protocol. Native Unity retains its earlier locks.

The automated suite walks the full 127-map circuit, validates safe spawns and both gate coordinates, checks actual physical entry/initialization and ensures normal saves stay protected. See TEST-RESULTS.md for the full current evidence and live-browser limitations.

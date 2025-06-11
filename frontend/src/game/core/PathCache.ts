import { CachedPath } from "../types";

export default class PathCache {
    private cache: Map<string, CachedPath>
    private defaultTTL: number;
    private lastCleanup: number;

    constructor(defaultTTL: number = 5000) {
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
        this.lastCleanup = Date.now();
    }

    public isValid(key: string): boolean {
        const entry = this.cache.get(key);
        if(!entry) return false;
        return entry && (Date.now() - entry.timestamp < entry.ttl);
    }

    public prune(maxSize: number) {
        if (this.cache.size > maxSize) {
            const entries = Array.from(this.cache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            this.cache = new Map(entries.slice(-maxSize));
        }
    }

    public generateKey(startTile: Phaser.Math.Vector2, endTile: Phaser.Math.Vector2, gridResolution: number = 1): string {
        const round = (v: number) => Math.floor(v / gridResolution);
        return `${round(startTile.x)}_${round(startTile.y)}-${round(endTile.x)}_${round(endTile.y)}`;
    }

    public set(key: string, path: Phaser.Math.Vector2[], customTTL?: number): void {
        this.cache.set(key, { path, timestamp: Date.now(), ttl: customTTL ?? this.defaultTTL });
        this.autoCleanup();
    }

    public get(key: string): Phaser.Math.Vector2[] | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const age = Date.now() - entry.timestamp;
        return (age < entry.ttl!) ? entry.path : null;
    }

    private autoCleanup(): void {
        if (Date.now() - this.lastCleanup < 10000) return;

        const now = Date.now();
        this.cache.forEach((value, key) => { if (now - value.timestamp > value.ttl!) this.cache.delete(key) });
        this.lastCleanup = now;
    }

    public clear(): void {
      this.cache.clear();
    }

    destroy(): void {
      this.cache.clear();
    }
}

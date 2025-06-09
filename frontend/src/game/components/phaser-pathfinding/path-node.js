"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathNode = void 0;
/**
 * @class
 * @classdesc
 * The PathNode class is returned by the pathfinding algorithm and represents the node in the found path
 * @param {number} tileX The x position in tile unit
 * @param {number} tileY The y position in tile unit
 * @param {number} worldX The x position in pixels
 * @param {number} worldY The y position in pixels
 * @param {number} tileWidth The width of the tile in px
 * @param {number} tileHeight The height of the tile in px
 *
 * @property {number} tileX The x position in tile unit
 * @property {number} tileY The y position in tile unit
 * @property {number} worldX The x position in pixels
 * @property {number} worldY The y position in pixels
 * @property {number} tileWidth The width of the tile in px
 * @property {number} tileHeight The height of the tile in px
 * @memberof module:PhaserPathfinding
 */
var PathNode = /** @class */ (function () {
    function PathNode(tileX, tileY, worldX, worldY, tileWidth, tileHeight) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.worldX = worldX;
        this.worldY = worldY;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
    return PathNode;
}());
exports.PathNode = PathNode;
//# sourceMappingURL=path-node.js.map
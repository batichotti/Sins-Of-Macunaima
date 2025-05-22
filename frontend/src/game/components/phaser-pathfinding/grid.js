"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var phaser_1 = __importDefault(require("phaser"));
var lodash_1 = __importDefault(require("./lodash"));
var node_1 = require("./node");
/**
 * @class
 * @classdesc
 * The grid class is used to create a grid that the pathfinding algorithm can use
 * @param {number} sizeX The width of the grid in tile units
 * @param {number} sizeY The height of the grid in tile units
 * @param {number} walkableLayerIndex
 * @memberof module:PhaserPathfinding
 */
var Grid = /** @class */ (function () {
    function Grid(sizeX, sizeY, walkableLayerIndex) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.walkableLayerIndex = walkableLayerIndex;
        this.grid = [];
    }
    /**
     * Gets a node from the grid at a specific position in tile units or undefined if the position is not in the grid
     * @param {number} x The x position in tile units
     * @param {number} y The y position in tile units
     * @param {module:PhaserPathfinding.Node[][]} [matrix=default] The matrix to get the node from, default is the current one
     * @return {module:PhaserPathfinding.Node?} The node at the position or undefined if the position is not in the grid
     */
    Grid.prototype.getNode = function (x, y, matrix) {
        var _a;
        if (matrix === void 0) { matrix = this.grid; }
        return (_a = matrix[parseInt(y.toString())]) === null || _a === void 0 ? void 0 : _a[parseInt(x.toString())];
    };
    /**
     * Clones the matrix of nodes, used internally by the pathfinding algorithm to avoid modifying the original grid when calculating costs
     * @returns {module:PhaserPathfinding.Node[][]}
     */
    Grid.prototype.cloneMatrix = function () {
        return lodash_1.default.cloneDeep(this.grid);
    };
    /**
     * This method is used internally by the pathfinding algorithm
     * @ignore
     */
    Grid.prototype.getNeighbors = function (node, matrix, diagonal) {
        if (matrix === void 0) { matrix = this.grid; }
        var neighbors = [];
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                    continue;
                }
                if (!diagonal && Math.abs(x) === Math.abs(y)) {
                    continue;
                }
                if (Math.abs(x) === Math.abs(y) &&
                    !this.checkIfPossibleNeighbor(x, y, node)) {
                    continue;
                }
                var posCheck = new phaser_1.default.Math.Vector2(node.x + x, node.y + y);
                if (posCheck.x >= 0 &&
                    posCheck.x < this.sizeX &&
                    posCheck.y >= 0 &&
                    posCheck.y < this.sizeY) {
                    var neighbor = this.getNode(posCheck.x, posCheck.y, matrix);
                    if (neighbor) {
                        neighbors.push(neighbor);
                    }
                }
            }
        }
        return neighbors;
    };
    /**
     * Gets the position in tile units from the position in pixels or undefined if the position is not in the walkable grid
     * @param {Phaser.Math.Vector2} position The position in pixels
     * @return {Phaser.Math.Vector2?} The position in tile unit or undefined if the position is not in the walkable grid
     */
    Grid.prototype.getTilePositionInWorld = function (position) {
        var _a;
        var tile = (_a = this.map) === null || _a === void 0 ? void 0 : _a.getTileAtWorldXY(position.x, position.y, false, undefined, this.walkableLayerIndex);
        if (!tile) {
            return;
        }
        return new phaser_1.default.Math.Vector2(tile.x, tile.y);
    };
    /**
     * Gets the position in pixels for a specific node
     * @param {module:PhaserPathfinding.Node} node The node to get the position from
     * @return {Phaser.Math.Vector2?} The position in the grid in pixels
     */
    Grid.prototype.getWorldPositionFromNode = function (node) {
        var _a;
        var tile = (_a = this.map) === null || _a === void 0 ? void 0 : _a.getTileAt(node.x, node.y, false, this.walkableLayerIndex);
        if (!tile) {
            return;
        }
        return new phaser_1.default.Math.Vector2(tile.pixelX, tile.pixelY);
    };
    /**
     * Creates a new grid from a tilemap
     * @param {Phaser.Tilemaps.Tilemap} map The tilemap to create the grid from
     * @param {Phaser.Tilemaps.TilemapLayer[]} obstacles An array of tilemap layers that are considered as obstacles
     * @param {number} [walkableLayerIndex=0] - The layer index that is considered as walkable Default: 0
     * @return {module:PhaserPathfinding.Grid} The created grid
     */
    Grid.createFromMap = function (map, obstacles, walkableLayerIndex) {
        if (walkableLayerIndex === void 0) { walkableLayerIndex = 0; }
        var base = map.getLayer(walkableLayerIndex);
        if (!base) {
            throw new Error('No base layer found');
        }
        var grid = new Grid(base.width, base.height, walkableLayerIndex).setMap(map);
        obstacles.forEach(function (_a) {
            var data = _a.layer.data;
            data.forEach(function (row) {
                row.forEach(function (tile) {
                    if (tile.index === -1) {
                        return;
                    }
                    grid.addNode(tile.x, tile.y, false, tile.width, tile.height);
                });
            });
        });
        base.data.forEach(function (row) {
            row.forEach(function (tile) {
                if (tile.index === -1) {
                    return;
                }
                grid.addNode(tile.x, tile.y, true, tile.width, tile.height);
            });
        });
        return grid;
    };
    Grid.prototype.setMap = function (map) {
        this.map = map;
        return this;
    };
    Grid.prototype.addNode = function (x, y, walkable, width, height) {
        var _a;
        if (this.getNode(x, y)) {
            return;
        }
        this.grid[parseInt(y.toString())] = (_a = this.grid[parseInt(y.toString())]) !== null && _a !== void 0 ? _a : [];
        this.grid[parseInt(y.toString())][parseInt(x.toString())] = new node_1.Node(walkable, x, y, width, height);
    };
    Grid.prototype.checkIfPossibleNeighbor = function (x, y, origin) {
        var _this = this;
        var isWalkable = function (nX, nY) {
            var check = new phaser_1.default.Math.Vector2(origin.x + nX, origin.y + nY);
            var n = _this.getNode(check.x, check.y);
            if (!n) {
                return false;
            }
            return n.walkable;
        };
        if (Math.abs(x) === 1 &&
            Math.abs(y) === 1 &&
            isWalkable(0, y) &&
            isWalkable(x, 0)) {
            return true;
        }
        return false;
    };
    return Grid;
}());
exports.Grid = Grid;
//# sourceMappingURL=grid.js.map
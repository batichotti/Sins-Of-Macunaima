"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pathfinding = void 0;
var lodash_1 = __importDefault(require("./lodash"));
var distance_method_1 = require("./distance-method");
var path_node_1 = require("./path-node");
var heap_1 = require("./heap");
/**
 * @typedef DistanceMethod
 * @property {octile} Octile (Recommended) Is a variant of Chebyshev distance used when movement is allowed along diagonals in addition to horizontal and vertical directions, but diagonal movement has a cost of √2 times that of horizontal or vertical movement
 * @property {manhattan} Manhattan It is a distance metric between two points in an N-dimensional vector space.<br/>**When set to this method, and if the diagonal is disabled, the path won't include zig zag moves**
 * @property {chebyshev} Chebyshev It is a distance metric defined on a vector space where the distance between two vectors is the greatest of their differences along any coordinate dimension
 *
 * @memberof module:PhaserPathfinding
 */
/**
 * @typedef {Object} PathfindingConfig
 * @memberof module:PhaserPathfinding
 *
 * @property {boolean} [simplify=false] If true the path will return only the nodes that change direction
 * @property {module:PhaserPathfinding.DistanceMethod} [distanceMethod=Octile] Choose the distance method to use, for more info see {@link module:PhaserPathfinding.DistanceMethod}
 * @property {boolean} [diagonal=true] If false the path won't have diagonal moves, and the Manhattan distance method will not have zig zag moves
 */
/**
 * @class
 * @classdesc
 * The Pathfinding class is used to find a path between 2 points in a grid
 * NOTE: If you want to change the grid after creating the Pathfinding object you need to create a new one as the grid is cloned internally
 * @param {module:PhaserPathfinding.Grid} grid
 * @memberof module:PhaserPathfinding
 */
var Pathfinding = /** @class */ (function () {
    function Pathfinding(grid) {
        this.grid = grid;
        this.matrixClone = [];
        this.matrixClone = grid.cloneMatrix();
    }
    /**
     * The 2 vectors must point to the position in tile unit not in px
     * @param {Phaser.Math.Vector2} start The start position in tile unit
     * @param {Phaser.Math.Vector2} target The target position in tile unit
     * @param {module:PhaserPathfinding.PathfindingConfig} config Extra parameters to configure the pathfinder
     * @return {module:PhaserPathfinding.PathNode[]} An array of nodes that represent the path, empty if no path was found
     */
    Pathfinding.prototype.findPathBetweenTl = function (start, target, config) {
        var defaultConfig = __assign({ distanceMethod: distance_method_1.DistanceMethod.Octile, diagonal: true, simplify: false }, __assign({}, config));
        var pathMatrix = lodash_1.default.cloneDeep(this.matrixClone);
        var startNode = this.grid.getNode(start.x, start.y, pathMatrix);
        var targetNode = this.grid.getNode(target.x, target.y, pathMatrix);
        if (!startNode || startNode.walkable === false) {
            return [];
        }
        if (!targetNode || targetNode.walkable === false) {
            return [];
        }
        var openSet = new heap_1.Heap();
        var closedSet = {};
        openSet.add(startNode);
        while (openSet.length > 0) {
            var currentNode = openSet.removeFirst();
            closedSet[currentNode.name.toString()] = true;
            if (currentNode.equals(targetNode)) {
                return this.retracePath(startNode, currentNode, defaultConfig.simplify, defaultConfig.diagonal);
            }
            for (var _i = 0, _a = this.grid.getNeighbors(currentNode, pathMatrix, defaultConfig.diagonal); _i < _a.length; _i++) {
                var neighbor = _a[_i];
                if (neighbor.walkable === false ||
                    closedSet[neighbor.name.toString()]) {
                    continue;
                }
                var getDistance = this.getOctileDistance;
                switch (defaultConfig.distanceMethod) {
                    case distance_method_1.DistanceMethod.Chebyshev:
                        getDistance = this.getChebyshevDistance;
                        break;
                    case distance_method_1.DistanceMethod.Manhattan:
                        getDistance = this.getManhattanDistance;
                        break;
                }
                var newMoveCost = currentNode.gCost + getDistance(currentNode, neighbor);
                if (newMoveCost < neighbor.gCost || !openSet.contains(neighbor)) {
                    neighbor.gCost = newMoveCost;
                    neighbor.hCost = getDistance(neighbor, targetNode);
                    neighbor.parent = currentNode;
                    if (!openSet.contains(neighbor)) {
                        openSet.add(neighbor);
                    }
                    else {
                        openSet.updateItem(neighbor);
                    }
                }
            }
        }
        return [];
    };
    /**
     * The 2 vectors must point to the position in pixels
     * @param {Phaser.Math.Vector2} start The start position in pixels
     * @param {Phaser.Math.Vector2} target The target position in tile unit
     * @param {module:PhaserPathfinding.PathfindingConfig} config Extra parameters to configure the pathfinder
     * @return {module:PhaserPathfinding.PathNode[]} An array of nodes that represent the path, empty if no path was found
     */
    Pathfinding.prototype.findPathBetweenPx = function (start, target, config) {
        if (!start || !target) {
            return [];
        }
        var startPosition = this.grid.getTilePositionInWorld(start);
        var targetPosition = this.grid.getTilePositionInWorld(target);
        if (!startPosition || !targetPosition) {
            return [];
        }
        return this.findPathBetweenTl(startPosition, targetPosition, config);
    };
    // Method not currently used but could be useful in the future
    Pathfinding.prototype.getOctileDistance = function (first, second) {
        var disX = Math.abs(first.x - second.x);
        var disY = Math.abs(first.y - second.y);
        if (disX > disY) {
            return 14 * disY + 10 * (disX - disY);
        }
        return 14 * disX + 10 * (disY - disX);
    };
    Pathfinding.prototype.getChebyshevDistance = function (first, second) {
        var disX = Math.abs(first.x - second.x);
        var disY = Math.abs(first.y - second.y);
        return 10 * Math.max(disX, disY);
    };
    Pathfinding.prototype.getManhattanDistance = function (first, second) {
        var disX = Math.abs(first.x - second.x);
        var disY = Math.abs(first.y - second.y);
        return 10 * (disX + disY);
    };
    Pathfinding.prototype.retracePath = function (start, target, simplify, diagonal) {
        var path = [];
        var currentNode = target;
        while (!currentNode.equals(start)) {
            if (!currentNode.parent) {
                throw new Error('PANIC No parent found');
            }
            var pos = this.grid.getWorldPositionFromNode(currentNode);
            if (!pos) {
                break;
            }
            currentNode.worldX = pos.x + currentNode.width / 2;
            currentNode.worldY = pos.y + currentNode.height / 2;
            var nodeToPush = lodash_1.default.cloneDeep(currentNode);
            currentNode = currentNode.parent;
            path.push(nodeToPush);
        }
        return this.normalizePath(path, simplify, diagonal, start).reverse();
    };
    Pathfinding.prototype.normalizePath = function (path, simplify, diagonal, startNode) {
        if (!simplify || path.length <= 2) {
            return path.map(function (node) {
                return new path_node_1.PathNode(node.x, node.y, node.worldX, node.worldY, node.width, node.height);
            });
        }
        var normalizedPath = [];
        var oldPosition = new Phaser.Math.Vector2();
        for (var i = 1; i < path.length; i++) {
            var newPosition = new Phaser.Math.Vector2(path[i - 1].x - path[parseInt(i.toString())].x, path[i - 1].y - path[parseInt(i.toString())].y);
            if (!oldPosition.equals(newPosition)) {
                var node = path[i - 1];
                normalizedPath.push(new path_node_1.PathNode(node.x, node.y, node.worldX, node.worldY, node.width, node.height));
            }
            if (path.length - 1 === i && !diagonal) {
                var checkStart = new Phaser.Math.Vector2(path[parseInt(i.toString())].x - startNode.x, path[parseInt(i.toString())].y - startNode.y);
                if (!newPosition.equals(checkStart)) {
                    var node = path[parseInt(i.toString())];
                    normalizedPath.push(new path_node_1.PathNode(node.x, node.y, node.worldX, node.worldY, node.width, node.height));
                }
            }
            oldPosition = newPosition;
        }
        return normalizedPath;
    };
    return Pathfinding;
}());
exports.Pathfinding = Pathfinding;
//# sourceMappingURL=pathfinding.js.map
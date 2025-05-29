"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
/* eslint-disable no-use-before-define */
var heap_1 = require("./heap");
/**
 * @class
 * @classdesc
 * The Node class represents a node in the grid, normally you don't need to use this one, usually the pathfinding algorithm will return a [PathNode]{@link module:PhaserPathfinding.PathNode}
 * @param {boolean} walkable If false the node is an obstacle
 * @param {number} x The x position in tile unit
 * @param {number} y The y position in tile unit
 * @param {number} width The width of the tile in px
 * @param {number} height The height of the tile in px
 *
 * @property {number} x The x position in tile unit
 * @property {number} y The y position in tile unit
 * @property {number} worldX Only exists on the nodes returned by the pathfinding algorithm and represents the x position in pixels
 * @property {number} worldY Only exists on the nodes returned by the pathfinding algorithm and represents the y position in pixels
 * @property {number} width The width of the tile in px
 * @property {number} height The height of the tile in px
 * @property {boolean} walkable If false the node is an obstacle
 * @memberof module:PhaserPathfinding
 */
var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node(
    /**
     * If true the node is walkable
     */
    walkable, 
    /**
     * The x position in tile unit
     */
    x, 
    /**
     * The y position in tile unit
     */
    y, 
    /**
     * The width of the tile in px
     */
    width, 
    /**
     * The height of the tile in px
     */
    height) {
        var _this = _super.call(this) || this;
        _this.walkable = walkable;
        _this.x = x;
        _this.y = y;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Object.defineProperty(Node.prototype, "name", {
        /**
         * Used for by the pathfinding algorithm
         * @ignore
         */
        get: function () {
            return "".concat(this.x, ",").concat(this.y);
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * This is used internally by the pathfinding algorithm
     * @param {module:PhaserPathfinding.Node} other Another node to compare the cost
     * @return {number}
     */
    Node.prototype.compare = function (other) {
        if (!other) {
            return -1;
        }
        var compare = this.fCost - other.fCost;
        if (compare === 0) {
            compare = this.hCost - other.hCost;
        }
        return -compare;
    };
    /**
     *
     * This is used internally by the pathfinding algorithm
     * @param {module:PhaserPathfinding.Node} other Another node to compare the equality
     * @return {boolean}
     */
    Node.prototype.equals = function (other) {
        if (!other) {
            return false;
        }
        if (!(other instanceof Node)) {
            return false;
        }
        return this.x === other.x && this.y === other.y;
    };
    return Node;
}(heap_1.HeapItem));
exports.Node = Node;
//# sourceMappingURL=node.js.map
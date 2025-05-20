import { HeapItem } from './heap';
export type NodeMatrix = Node[][];
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
export declare class Node extends HeapItem {
    /**
     * If true the node is walkable
     */
    readonly walkable: boolean;
    /**
     * The x position in tile unit
     */
    readonly x: number;
    /**
     * The y position in tile unit
     */
    readonly y: number;
    /**
     * The width of the tile in px
     */
    readonly width: number;
    /**
     * The height of the tile in px
     */
    readonly height: number;
    /**
     * This is used internally by the pathfinding algorithm and it will be undefined on the nodes returned by the pathfinding algorithm
     */
    parent?: Node;
    /**
     * Only exists on the nodes returned by the pathfinding algorithm and represents the x position in pixels
     */
    worldX?: number;
    /**
     * Only exists on the nodes returned by the pathfinding algorithm and represents the y position in pixels
     */
    worldY?: number;
    /**
     * Used for by the pathfinding algorithm
     * @ignore
     */
    get name(): string;
    constructor(
    /**
     * If true the node is walkable
     */
    walkable: boolean, 
    /**
     * The x position in tile unit
     */
    x: number, 
    /**
     * The y position in tile unit
     */
    y: number, 
    /**
     * The width of the tile in px
     */
    width: number, 
    /**
     * The height of the tile in px
     */
    height: number);
    /**
     *
     * This is used internally by the pathfinding algorithm
     * @param {module:PhaserPathfinding.Node} other Another node to compare the cost
     * @return {number}
     */
    compare(other: Node): number;
    /**
     *
     * This is used internally by the pathfinding algorithm
     * @param {module:PhaserPathfinding.Node} other Another node to compare the equality
     * @return {boolean}
     */
    equals(other: Node): boolean;
}
//# sourceMappingURL=node.d.ts.map
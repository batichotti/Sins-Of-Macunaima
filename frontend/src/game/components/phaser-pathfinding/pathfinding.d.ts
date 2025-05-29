import { DistanceMethod } from './distance-method';
import { PathNode } from './path-node';
import { Grid } from './grid';
export interface PathfindingConfig {
    distanceMethod: DistanceMethod;
    simplify: boolean;
    diagonal: boolean;
}
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
export declare class Pathfinding {
    private readonly grid;
    private readonly matrixClone;
    constructor(grid: Grid);
    /**
     * The 2 vectors must point to the position in tile unit not in px
     * @param {Phaser.Math.Vector2} start The start position in tile unit
     * @param {Phaser.Math.Vector2} target The target position in tile unit
     * @param {module:PhaserPathfinding.PathfindingConfig} config Extra parameters to configure the pathfinder
     * @return {module:PhaserPathfinding.PathNode[]} An array of nodes that represent the path, empty if no path was found
     */
    findPathBetweenTl(start: Phaser.Math.Vector2, target: Phaser.Math.Vector2, config?: PathfindingConfig): PathNode[];
    /**
     * The 2 vectors must point to the position in pixels
     * @param {Phaser.Math.Vector2} start The start position in pixels
     * @param {Phaser.Math.Vector2} target The target position in tile unit
     * @param {module:PhaserPathfinding.PathfindingConfig} config Extra parameters to configure the pathfinder
     * @return {module:PhaserPathfinding.PathNode[]} An array of nodes that represent the path, empty if no path was found
     */
    findPathBetweenPx(start: Phaser.Math.Vector2, target: Phaser.Math.Vector2, config?: PathfindingConfig): PathNode[];
    private getOctileDistance;
    private getChebyshevDistance;
    private getManhattanDistance;
    private retracePath;
    private normalizePath;
}
//# sourceMappingURL=pathfinding.d.ts.map
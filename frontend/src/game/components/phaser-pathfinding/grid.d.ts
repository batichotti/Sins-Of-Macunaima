import Phaser from 'phaser';
import { Node, NodeMatrix } from './node';
/**
 * @class
 * @classdesc
 * The grid class is used to create a grid that the pathfinding algorithm can use
 * @param {number} sizeX The width of the grid in tile units
 * @param {number} sizeY The height of the grid in tile units
 * @param {number} walkableLayerIndex
 * @memberof module:PhaserPathfinding
 */
export declare class Grid {
    private readonly sizeX;
    private readonly sizeY;
    private readonly walkableLayerIndex;
    private readonly grid;
    private map?;
    constructor(sizeX: number, sizeY: number, walkableLayerIndex: number);
    /**
     * Gets a node from the grid at a specific position in tile units or undefined if the position is not in the grid
     * @param {number} x The x position in tile units
     * @param {number} y The y position in tile units
     * @param {module:PhaserPathfinding.Node[][]} [matrix=default] The matrix to get the node from, default is the current one
     * @return {module:PhaserPathfinding.Node?} The node at the position or undefined if the position is not in the grid
     */
    getNode(x: number, y: number, matrix?: NodeMatrix): Node | undefined;
    /**
     * Clones the matrix of nodes, used internally by the pathfinding algorithm to avoid modifying the original grid when calculating costs
     * @returns {module:PhaserPathfinding.Node[][]}
     */
    cloneMatrix(): NodeMatrix;
    /**
     * This method is used internally by the pathfinding algorithm
     * @ignore
     */
    getNeighbors(node: Node, matrix: NodeMatrix | undefined, diagonal: boolean): Node[];
    /**
     * Gets the position in tile units from the position in pixels or undefined if the position is not in the walkable grid
     * @param {Phaser.Math.Vector2} position The position in pixels
     * @return {Phaser.Math.Vector2?} The position in tile unit or undefined if the position is not in the walkable grid
     */
    getTilePositionInWorld(position: Phaser.Math.Vector2): Phaser.Math.Vector2 | undefined;
    /**
     * Gets the position in pixels for a specific node
     * @param {module:PhaserPathfinding.Node} node The node to get the position from
     * @return {Phaser.Math.Vector2?} The position in the grid in pixels
     */
    getWorldPositionFromNode(node: Node): Phaser.Math.Vector2 | undefined;
    /**
     * Creates a new grid from a tilemap
     * @param {Phaser.Tilemaps.Tilemap} map The tilemap to create the grid from
     * @param {Phaser.Tilemaps.TilemapLayer[]} obstacles An array of tilemap layers that are considered as obstacles
     * @param {number} [walkableLayerIndex=0] - The layer index that is considered as walkable Default: 0
     * @return {module:PhaserPathfinding.Grid} The created grid
     */
    static createFromMap(map: Phaser.Tilemaps.Tilemap, obstacles: Phaser.Tilemaps.TilemapLayer[], walkableLayerIndex?: number): Grid;
    private setMap;
    private addNode;
    private checkIfPossibleNeighbor;
}
//# sourceMappingURL=grid.d.ts.map
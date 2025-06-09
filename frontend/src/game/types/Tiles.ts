/**
 * Responsável por lidar com os tiles animados.
 */
export interface AnimatedTileData {
    /**
     * O tile em si.
     */
    tile: Phaser.Tilemaps.Tile,
    /**
     * Os quadros de animação.
     */
    animationFrames: { 
        /**
         * O id do tile.
         */
        tileid: number;
        
        /**
         * A duração da animação.
         */
        duration: number 
    }[],
    /**
     * O id do 1° tile.
     */
    firstgid: number,
    /**
     * Tempo passado entre animações.
     */
    elapsedTime: number
}
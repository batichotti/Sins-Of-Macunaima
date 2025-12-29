import 'phaser';

declare module 'phaser-navmesh' {
  import Phaser from 'phaser';

  export class PhaserNavMeshPlugin extends Phaser.Plugins.ScenePlugin {
    createMesh(key: string, polygons: Phaser.Types.Math.Vector2Like[][]): void;
    createMeshFromPolygons(key: string, polygons: Phaser.Types.Math.Vector2Like[][]): void;
    findPath(
      start: Phaser.Types.Math.Vector2Like,
      end: Phaser.Types.Math.Vector2Like
    ): Phaser.Math.Vector2[] | null;
  }

  const plugin: typeof PhaserNavMeshPlugin;
  export default plugin;
}

declare global {
  namespace Phaser {
    namespace Plugins {
      class NavMeshPlugin extends Phaser.Plugins.ScenePlugin {
        createMesh(key: string, polygons: Phaser.Types.Math.Vector2Like[][]): void;
        createMeshFromPolygons(key: string, polygons: Phaser.Types.Math.Vector2Like[][]): void;
        findPath(
          start: Phaser.Types.Math.Vector2Like,
          end: Phaser.Types.Math.Vector2Like
        ): Phaser.Math.Vector2[] | null;
      }
    }

    interface Scene {
      navMesh: Plugins.NavMeshPlugin;
    }
  }
}

export {};

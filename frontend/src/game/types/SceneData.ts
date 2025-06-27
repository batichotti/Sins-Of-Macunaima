import { ICharacter, ILevel, IPlayerExport } from "./Player";
import { IMatchStats } from "./PlayerProgressionSystem";
import { WeaponSet } from "./Weapon";

/**
 * Dados da cena anterior.
 */
export type SceneData = {
    /**
     * Cena de destino.
     *
     * Deve ser a cena atual.
     */
    targetScene: string;

    /**
     * Cena anterior.
     *
     * Útil para definir pontos de spawn do jogador por exemplo.
     */
    previousScene: string;

    /**
     * O jogador em si.
     */
    player: IPlayerExport;

    /**
     * O personagem do jogador.
     */
    character: ICharacter;

    /**
     * O nível do jogador.
     */
    level: ILevel;

    /**
     * Set de armas do jogador.
     */
    weaponSet: WeaponSet;
}

/**
 * Dados da partida.
 */
export type MatchData = {
  /**
  * Nome do mapa.
  */
  scene: string;
  /**
   * Estatísticas da partida.
   */
  data: IMatchStats;
}

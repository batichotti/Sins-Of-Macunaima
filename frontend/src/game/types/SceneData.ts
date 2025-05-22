import { ICharacter, ILevel, IPlayer } from "./Player";
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
    player: IPlayer;

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
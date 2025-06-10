/**
 * Classe utilitária que cronometra tempo e exporta o resultado.
 */
export class Timer {
    private startTime: number;
    private endTime: number;

    constructor() {
        this.startTime = Date.now();
    }

    public stop(): number {
        this.endTime = Date.now();
        return this.endTime - this.startTime;
    }
}

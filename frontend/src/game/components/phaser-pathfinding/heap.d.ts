export declare abstract class HeapItem {
    abstract compare(other: HeapItem): number;
    abstract equals(other: HeapItem): boolean;
    abstract parent?: HeapItem;
    index: number;
    gCost: number;
    hCost: number;
    get fCost(): number;
}
export declare class Heap<T extends HeapItem> {
    private items;
    private currentCount;
    get length(): number;
    add(item: T): void;
    removeFirst(): T;
    contains(item: T): boolean;
    updateItem(item: T): void;
    private sortUp;
    private sortDown;
    private swap;
}
//# sourceMappingURL=heap.d.ts.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heap = exports.HeapItem = void 0;
var lodash_1 = __importDefault(require("./lodash"));
/* eslint-disable no-use-before-define */
var HeapItem = /** @class */ (function () {
    function HeapItem() {
        this.index = -1;
        this.gCost = 0;
        this.hCost = 0;
    }
    Object.defineProperty(HeapItem.prototype, "fCost", {
        get: function () {
            return this.gCost + this.hCost;
        },
        enumerable: false,
        configurable: true
    });
    return HeapItem;
}());
exports.HeapItem = HeapItem;
var Heap = /** @class */ (function () {
    function Heap() {
        this.items = [];
        this.currentCount = 0;
    }
    Object.defineProperty(Heap.prototype, "length", {
        get: function () {
            return this.items.length;
        },
        enumerable: false,
        configurable: true
    });
    Heap.prototype.add = function (item) {
        item.index = this.currentCount;
        this.items[this.currentCount] = item;
        this.sortUp(item);
        this.currentCount++;
    };
    Heap.prototype.removeFirst = function () {
        var first = lodash_1.default.cloneDeep(this.items[0]);
        this.currentCount--;
        this.items[0] = this.items[this.currentCount];
        this.items[0].index = 0;
        this.sortDown(this.items[0]);
        return first;
    };
    Heap.prototype.contains = function (item) {
        if (item == null) {
            return false;
        }
        var check = this.items[item.index];
        if (!check) {
            return false;
        }
        return check.equals(item);
    };
    Heap.prototype.updateItem = function (item) {
        this.sortUp(item);
    };
    Heap.prototype.sortUp = function (item) {
        var parentIndex = (item.index - 1) / 2;
        while (true) {
            var parent_1 = this.items[parseInt(parentIndex.toString())];
            if (item.compare(parent_1) <= 0) {
                break;
            }
            this.swap(item, parent_1);
            parentIndex = (item.index - 1) / 2;
        }
    };
    Heap.prototype.sortDown = function (item) {
        while (true) {
            var leftChildIndex = item.index * 2 + 1;
            var rightChildIndex = item.index * 2 + 2;
            if (leftChildIndex < this.currentCount) {
                var swapIndex = leftChildIndex;
                if (rightChildIndex < this.currentCount) {
                    if (this.items[parseInt(leftChildIndex.toString())].compare(this.items[parseInt(rightChildIndex.toString())]) < 0) {
                        swapIndex = rightChildIndex;
                    }
                }
                var child = this.items[parseInt(swapIndex.toString())];
                if (item.compare(child) < 0) {
                    this.swap(item, child);
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
    };
    Heap.prototype.swap = function (first, second) {
        this.items[parseInt(first.index.toString())] = second;
        this.items[parseInt(second.index.toString())] = first;
        var itemAIndex = parseInt(first.index.toString());
        first.index = parseInt(second.index.toString());
        second.index = itemAIndex;
    };
    return Heap;
}());
exports.Heap = Heap;
//# sourceMappingURL=heap.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceMethod = void 0;
var DistanceMethod;
(function (DistanceMethod) {
    /**
     * It is a distance metric defined on a vector space where the distance between two vectors is the greatest of their differences along any coordinate dimension
     */
    DistanceMethod["Chebyshev"] = "chebyshev";
    /**
     * It is a distance metric between two points in an N-dimensional vector space.
     *
     * _**When set to this method, and if the diagonal is disabled, the path won't include zig zag moves**_
     */
    DistanceMethod["Manhattan"] = "manhattan";
    /**
     * (Recommended) Is a variant of Chebyshev distance used when movement is allowed along diagonals in addition to horizontal and vertical directions, but diagonal movement has a cost of √2 times that of horizontal or vertical movement
     */
    DistanceMethod["Octile"] = "octile";
})(DistanceMethod || (exports.DistanceMethod = DistanceMethod = {}));
//# sourceMappingURL=distance-method.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopwatch = void 0;
class Stopwatch {
    start() {
        this.startTime = process.hrtime();
    }
    stop() {
        this.time = process.hrtime(this.startTime);
        return this.elapsed;
    }
    get elapsed() {
        return (this.time[0] + this.time[1] / 1e9).toFixed(3);
    }
}
exports.Stopwatch = Stopwatch;

export class Stopwatch {
  declare private startTime: [number,number]; 
  declare private time: [number,number];

  start(){this.startTime = process.hrtime();};
  stop(){this.time = process.hrtime(this.startTime)};

  get elapsed(){
    return (this.time[0] + (this.time[1] / 1e9))
      .toFixed(3);
  }
}


/////////////////////////////////////////////////////////
// Patched version of noise.js from p5.js to typescript
// source: https://github.com/processing/p5.js/blob/main/src/math/noise.js
//
/////////////////////////////////////////////////////////
// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

// someday we might consider using "improved noise"
// http://mrl.nyu.edu/~perlin/paper445.pdf
// See: https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/
//      blob/main/introduction/Noise1D/noise.js

export class PerlinNoise {
  private PERLIN_YWRAPB = 4;
  private PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
  private PERLIN_ZWRAPB = 8;
  private PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
  private PERLIN_SIZE = 4095;

  private perlin_octaves = 4; // default to medium smooth
  private perlin_amp_falloff = 0.5; // 50% reduction/octave

  private scaled_cosine(i: number) {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
  }

  declare perlin: number[]; // will be initialized lazily by noise() or noiseSeed()

  public noise(x: number, y = 0, z = 0) {
    if (this.perlin == null) {
      this.perlin = new Array(this.PERLIN_SIZE + 1);
      for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
        this.perlin[i] = Math.random();
      }
    }

    if (x < 0) {
      x = -x;
    }
    if (y < 0) {
      y = -y;
    }
    if (z < 0) {
      z = -z;
    }

    let xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let rxf, ryf;

    let r = 0;
    let ampl = 0.5;

    let n1, n2, n3;

    for (let o = 0; o < this.perlin_octaves; o++) {
      let of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);

      rxf = this.scaled_cosine(xf);
      ryf = this.scaled_cosine(yf);

      n1 = this.perlin[of & this.PERLIN_SIZE];
      n1 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n1);
      n2 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n2 +=
        rxf *
        (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);

      of += this.PERLIN_ZWRAP;
      n2 = this.perlin[of & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n2);
      n3 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n3 +=
        rxf *
        (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);

      n1 += this.scaled_cosine(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= this.perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;

      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
      if (zf >= 1.0) {
        zi++;
        zf--;
      }
    }
    return r;
  }

  public noiseDetail(lod: number, falloff: number) {
    if (lod > 0) {
      this.perlin_octaves = lod;
    }
    if (falloff > 0) {
      this.perlin_amp_falloff = falloff;
    }
  }

  public noiseSeed(seed: number) {
    // Linear Congruential Generator
    // Variant of a Lehman Generator
    const lcg = (() => {
      // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
      const m = 4294967296;
      // a - 1 should be divisible by m's prime factors
      const a = 1664525;
      // c and m should be co-prime
      const c = 1013904223;
      let seed: number, z: number;
      return {
        setSeed(val: number) {
          // pick a random seed if val is undefined or null
          // the >>> 0 casts the seed to an unsigned 32-bit integer
          z = seed = (val == null ? Math.random() * m : val) >>> 0;
        },
        getSeed() {
          return seed;
        },
        rand() {
          // define the recurrence relationship
          z = (a * z + c) % m;
          // return a float in [0, 1)
          // if z = m then z / m = 0 therefore (z % m) / m < 1 always
          return z / m;
        },
      };
    })();

    lcg.setSeed(seed);
    this.perlin = new Array(this.PERLIN_SIZE + 1);
    for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
      this.perlin[i] = lcg.rand();
    }
  }
}

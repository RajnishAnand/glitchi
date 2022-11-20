import { Canvas, loadImage, FontLibrary } from 'skia-canvas';
import { randomQuote } from './@quotes';

FontLibrary.use({
  Rajdhani: ['res/Rajdhani-Medium.ttf'],
});

export default async function () {
  const img = await loadImage(
    'https://source.unsplash.com/random/900x500?sunrise,nature',
  );
  const canvas = new Canvas(900, 500);
  const ctx = canvas.getContext('2d');

  const quote = (await randomQuote()).value;

  ctx.drawImage(img, 10, 10, 880, 480);

  ctx.font = '40px Rajdhani';
  ctx.textAlign = 'center';
  ctx.textWrap = true;
  ctx.textBaseline = 'bottom';
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#0e1019';

  const th = 40 * ctx.measureText(quote.content).lines.length;

  ctx.filter = 'blur(20px)';
  ctx.strokeText(quote.content, 450, 250 - th / 2, 700);

  ctx.beginPath();
  ctx.filter = 'none';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(quote.content, 450, 250 - th / 2, 700);

  ctx.beginPath();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`-${quote.author}`, 870, 470);

  return canvas.toBufferSync('png');
}

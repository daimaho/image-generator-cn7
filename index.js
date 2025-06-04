import express from 'express';
import axios from 'axios';
import { createCanvas, loadImage, registerFont } from 'canvas';
import sharp from 'sharp';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
registerFont('Roboto-Bold.ttf', { family: 'Roboto' });

app.post('/generate', async (req, res) => {
  const { title, image_url } = req.body;

  if (!title || !image_url) return res.status(400).send('Falta title o image_url');

  try {
    const bg = await loadImage('./fondo.jpg');

    // Descargar la imagen desde la URL
    const response = await axios.get(image_url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    const img = await loadImage(imageBuffer);

    const canvas = createCanvas(1080, 1350);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(bg, 0, 0, 1080, 1350);
    ctx.drawImage(img, 65, 100, 950, 750);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 54px Roboto';
    ctx.textAlign = 'center';
    const lines = wrapText(ctx, title, 951);
    lines.forEach((line, i) => {
      ctx.fillText(line, 540, 1000 + i * 65);
    });

    const buffer = canvas.toBuffer('image/png');
    const output = await sharp(buffer).jpeg().toBuffer();
    res.set('Content-Type', 'image/jpeg').send(output);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando la imagen');
  }
});

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = test;
    }
  }
  lines.push(line.trim());
  return lines;
}

app.listen(port, () => console.log(`Servidor en ${port}`));

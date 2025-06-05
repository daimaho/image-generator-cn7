import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/generate-image', (req, res) => {
  const { title, image_url } = req.body;

  if (!title || !image_url) {
    return res.status(400).json({ error: 'Title and image_url are required' });
  }

  res.json({ title, imageUrl: image_url });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


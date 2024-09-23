const express = require('express');
const axios = require('axios');
const Jimp = require('jimp');
const app = express();

// Convert YouTube thumbnail to PNG
app.get('/convert-thumbnail', async (req, res) => {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).send('Please provide a videoId as a query parameter.');
  }

  try {
    // Fetch YouTube thumbnail image in .jpg format
    const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // Convert the image to PNG using Jimp
    const image = await Jimp.read(response.data);
    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
      if (err) {
        return res.status(500).send('Error converting image.');
      }

      res.set('Content-Type', 'image/png');
      res.send(buffer);
    });
  } catch (error) {
    console.error('Error fetching or converting image:', error);
    res.status(500).send('Error converting thumbnail.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

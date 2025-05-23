const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// .env er moto environment variable er jonno fallback
const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyAQ4d4WsLeXV-3G5H5UvPB1vEyNF2A6Wvo';
const CX = process.env.GOOGLE_CX || 'b22a9408f67644a34';

app.use(cors());
app.use(express.json());

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query parameter "q" missing' });

  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.items) return res.json({ results: [] });

    const results = data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    res.json({ results });
  } catch (error) {
    console.error('Google API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

app.listen(PORT, () => {
  console.log(`Google Search API running on port ${PORT}`);
});

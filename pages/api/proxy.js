import { parse } from 'url';

export default async function handler(req, res) {
  try {
    const { url } = req.body;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const extension = parse(url).pathname.split('.').pop();

    const contentType = {
      'pdf': 'application/pdf',
      'mp4': 'video/mp4'
    }[extension] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}

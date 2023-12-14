import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (url.endsWith(".pdf") === false) {
    return res.status(400).end();
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(response);
      return res.status(response.status).end();
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader("Content-Disposition", "attachment; filename=file.pdf");
    res.setHeader("Cache-Control", "no-store");

    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the request.");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

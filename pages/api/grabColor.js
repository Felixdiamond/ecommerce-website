import { getColor, getPalette } from "colorthief";

export default async function handler(req, res) {
  try {
    const { image, primary, secondary } = req.body;
    if (primary == "true" && secondary == "false") {
      const color = await getColor(image);
      res.status(200).json({ color });
    } else if (secondary == "true" && primary == "false") {
      const color = await getPalette(image);
      res.status(200).json({ color });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
}

import { getColor, getPalette } from "colorthief";
import NodeCache from "node-cache";

// Initialize cache
const myCache = new NodeCache();

export default async function handler(req, res) {
  try {
    const { image, primary, secondary } = req.body;

    // Check if result is in cache
    const cacheKey = `${image}-${primary}-${secondary}`;
    const cachedResult = myCache.get(cacheKey);

    if (cachedResult) {
      // Return cached result
      res.status(200).json(cachedResult);
    } else {
      // Fetch color and cache the result
      let color;
      if (primary == "true" && secondary == "false") {
        color = await getColor(image);
      } else if (secondary == "true" && primary == "false") {
        color = await getPalette(image);
      } else {
        return res.status(400).json({ success: false });
      }

      // Cache the result
      myCache.set(cacheKey, { color });

      res.status(200).json({ color });
    }
  } catch (err) {
    console.error(err.message); // Log only the error message
    res.status(400).json({ success: false });
  }
}

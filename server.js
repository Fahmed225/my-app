import express from "express";
import * as Replicate from "replicate";
import dotenv from "dotenv";
import cors from "cors"; // Import cors

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const replicate = new Replicate.default({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/replicate', async (req, res) => {
  try {
    const { image } = req.body;
    const output = await replicate.run(
      "lucataco/florence-2-base:c81609117f666d3a86b262447f80d41ac5158a76adb56893301843a23165eaf8",
      {
        input: {
          task_input: "More Detailed Caption",
          image: image,
        }
      }
    );
    res.json({ output });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process image with Florence 2' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
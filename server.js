const express = require('express');
const Replicate = require('replicate');

const app = express();
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/replicate', async (req, res) => {
  try {
    const { task_input, image } = req.body;
    const output = await replicate.run(
      "lucataco/florence-2-base:c81609117f666d3a86b262447f80d41ac5158a76adb56893301843a23165eaf8",
      {
        input: {
          task_input,
          image,
        },
      }
    );
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process image with Florence 2' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

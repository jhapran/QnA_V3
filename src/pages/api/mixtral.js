import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/mixtral-8x7B', // Replace with Mixtral model endpoint
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer YOUR_HUGGING_FACE_API_KEY`, // Replace with your API key
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error loading Mixtral model:', error);
    res.status(500).json({ message: 'Error loading Mixtral model', error: error.message });
  }
}

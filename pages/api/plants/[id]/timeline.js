import dbConnect from '@/lib/db';
import Plant from '../../../../models/Plant';

export default async function handler(req, res) {
  const { id } = req.query;
  
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const plant = await Plant.findByIdAndUpdate(
        id,
        { $push: { timeline: req.body } },
        { new: true }
      );
      res.status(200).json(plant);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
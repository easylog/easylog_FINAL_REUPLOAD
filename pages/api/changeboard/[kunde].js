
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { kunde } = req.query;
  const client = await clientPromise;
  const db = client.db('easylog');
  const collection = db.collection('changeboard_' + kunde);

  if (req.method === 'GET') {
    const posts = await collection.find().sort({ createdAt: -1 }).toArray();
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Kein Token' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      const user = decoded.email;

      const entry = {
        text: req.body.text,
        createdAt: new Date(),
        user,
      };
      await collection.insertOne(entry);
      return res.status(201).json({ message: 'Gespeichert', entry });
    } catch (err) {
      return res.status(403).json({ message: 'Token ungültig' });
    }
  }

  res.status(405).end();
}

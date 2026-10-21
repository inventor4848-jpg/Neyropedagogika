const bcrypt = require('bcryptjs');
const db = require('./_firebaseAdmin');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" });
    }

    const existing = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!existing.empty) {
      return res.status(400).json({ message: "Bu elektron pochta allaqachon ro'yxatdan o'tgan" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const docRef = await db.collection('users').add({
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      user: { id: docRef.id, name, email }
    });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

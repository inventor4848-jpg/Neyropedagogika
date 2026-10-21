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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email va parolni kiriting' });
    }

    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
    }

    const doc = snapshot.docs[0];
    const userData = doc.data();
    const match = await bcrypt.compare(password, userData.passwordHash || '');
    if (!match) {
      return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
    }

    await doc.ref.update({ lastLogin: new Date().toISOString() });

    res.status(200).json({
      message: 'Kirish muvaffaqiyatli!',
      user: { id: doc.id, name: userData.name, email: userData.email }
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

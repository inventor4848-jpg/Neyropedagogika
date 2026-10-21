const db = require('./_firebaseAdmin');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        docId: doc.id,
        name: d.name || '',
        email: d.email || '',
        createdAt: d.createdAt || null,
        lastLogin: d.lastLogin || null
      };
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error('admin-users error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

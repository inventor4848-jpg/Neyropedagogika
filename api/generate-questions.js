module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, count } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Ma'ruza matni bo'sh bo'lishi mumkin emas" });
    }

    const qCount = Math.min(Math.max(parseInt(count) || 5, 1), 10);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: "Siz o'zbek tilida ta'lim testlarini tuzuvchi mutaxasssissiz. Faqat so'ralgan JSON formatida javob bering, boshqa hech qanday matn yozmang."
          },
          {
            role: 'user',
            content: `Quyidagi maruza matnidan ${qCount} ta test savoli tuz. Savollar va javob variantlari o'zbek tilida bo'lishi shart. Faqat quyidagi JSON array formatida qaytargil, boshqa hech narsa yozma:

[
  {
    "q": "savol matni",
    "opts": ["A javob", "B javob", "C javob", "D javob"],
    "ans": 0
  }
]

"ans" - to'g'ri javob indeksi (0=A, 1=B, 2=C, 3=D). Har bir savolda aniq 4 ta javob varianti bo'lsin.

Maruza matni:
${text.substring(0, 4000)}`
          }
        ],
        temperature: 0.6,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({ error: 'Groq API xatolik: ' + response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', content);
      return res.status(500).json({ error: "AI javobidan savollar topilmadi. Qayta urinib ko'ring." });
    }

    const questions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ error: "Savollar to'g'ri formatda kelmadi." });
    }

    const cleaned = questions.slice(0, 10).map(q => ({
      q: String(q.q || '').trim(),
      opts: (q.opts || []).slice(0, 4).map(o => String(o).trim()),
      ans: Math.min(Math.max(parseInt(q.ans) || 0, 0), 3)
    })).filter(q => q.q && q.opts.length === 4);

    res.status(200).json({ questions: cleaned });
  } catch (err) {
    console.error('generate-questions error:', err);
    res.status(500).json({ error: 'Server xatolik: ' + err.message });
  }
};

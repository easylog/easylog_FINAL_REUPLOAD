
export default async function handler(req, res) {
  const { input } = req.body;
  const output = `Formuliert (Demo): ${input}`;
  res.status(200).json({ output });
}

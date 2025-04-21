import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Journal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: 'de-DE' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setInput(transcript);
  };

  const generateText = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });

      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      setOutput('Fehler beim Laden der KI.');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">📝 EasyLog Journal</h1>
      <div className="max-w-xl mx-auto space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Beschreibe den Vorfall oder Tagesverlauf..."
          className="w-full h-32 p-4 border rounded-lg resize-none"
        />

        <div className="flex gap-4">
          <button
            onClick={startListening}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            🎤 Start
          </button>
          <button
            onClick={stopListening}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            🛑 Stop
          </button>
        </div>

        <button
          onClick={generateText}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Formuliere...' : 'Mit GPT umformulieren'}
        </button>

        {output && (
          <div className="bg-white p-4 border rounded-lg shadow space-y-2">
            <p className="whitespace-pre-wrap">{output}</p>
          </div>
        )}
      </div>
    </main>
  );
}

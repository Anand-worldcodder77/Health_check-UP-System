import React, { useMemo, useState } from 'react';
import { AlertTriangle, Bot, FileText, Loader2, MessageCircle, RotateCcw, Send, Sparkles, TestTube2, Upload, X } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const starterQuestions = [
  'Mujhe cough aur breathing me problem hai, kya karu?',
  'Diabetes ke symptoms par kaunsa test useful hai?',
  'Thyroid symptoms ke liye kaunsa package book karu?',
];

const toPointList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return value
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const HealthAiChatbot = ({ onBook }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [chatItems, setChatItems] = useState([]);

  const hasAnswer = useMemo(() => answer && (answer.summary || answer.homeRemedies?.length), [answer]);

  const askQuestion = async (question = message) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion && !selectedPdf) return;

    setOpen(true);
    setMessage(cleanQuestion);
    setLoading(true);
    setError('');
    const userItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: cleanQuestion || `Uploaded report: ${selectedPdf?.name || 'report file'}`,
      fileName: selectedPdf?.name,
    };
    setChatItems((current) => [...current, userItem]);
    try {
      let response;
      if (selectedPdf) {
        const formData = new FormData();
        formData.append('report', selectedPdf);
        formData.append('message', cleanQuestion || 'Is report ko simple language me analyze karke bataiye.');
        response = await fetch(`${API_BASE}/api/chatbot/analyze-file`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE}/api/chatbot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: cleanQuestion }),
        });
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI response failed');
      setAnswer(data);
      setChatItems((current) => [...current, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        answer: data,
      }]);
      setMessage('');
    } catch (err) {
      setError(err.message || 'AI response failed');
    } finally {
      setLoading(false);
    }
  };

  const bookCard = (card) => {
    onBook(card.title);
    setOpen(false);
  };

  const startNewChat = () => {
    setMessage('');
    setSelectedPdf(null);
    setAnswer(null);
    setError('');
    setLoading(false);
    setChatItems([]);
  };

  const handlePdfSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Sirf PDF, JPG, PNG ya WEBP report upload karein.');
      event.target.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Report file 8 MB se chhota hona chahiye.');
      event.target.value = '';
      return;
    }
    setSelectedPdf(file);
    setError('');
  };

  const renderComposer = (sticky = false) => (
    <div className={sticky ? 'sticky bottom-0 z-10 -mx-4 mt-4 border-t border-slate-100 bg-white/95 px-4 pb-1 pt-3 backdrop-blur' : 'mt-4'}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          askQuestion();
        }}
        className="flex gap-2"
      >
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Agla question ya symptoms likhein..."
          className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#009494]"
        />
        <label className="grid h-12 w-12 cursor-pointer place-items-center rounded-2xl border border-slate-100 bg-white text-slate-500 transition hover:border-[#009494] hover:text-[#009494]" title="Upload PDF/image report">
          <Upload size={18} />
          <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={handlePdfSelect} />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-[#009494] text-white transition hover:bg-slate-950 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>

      {selectedPdf && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="shrink-0 text-indigo-600" size={18} />
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-indigo-800">{selectedPdf.name}</p>
              <p className="text-[10px] font-bold text-indigo-500">Report ready to scan</p>
            </div>
          </div>
          <button type="button" onClick={() => setSelectedPdf(null)} className="rounded-xl bg-white px-3 py-2 text-[10px] font-black text-indigo-700 transition hover:bg-indigo-600 hover:text-white">
            Remove
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-48 right-4 z-[720] flex h-14 items-center gap-2 rounded-full bg-slate-950 px-4 text-white shadow-2xl shadow-slate-400/40 transition hover:bg-[#009494] lg:bottom-40 lg:right-6"
          aria-label="Open AI health assistant"
        >
          <MessageCircle size={24} />
          <span className="hidden text-xs font-black uppercase tracking-[0.08em] sm:inline">AI Help</span>
        </button>
      )}

      {open && (
        <section className="fixed inset-x-3 bottom-20 z-[730] mx-auto max-h-[78vh] max-w-md overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-2xl shadow-slate-500/30 lg:bottom-6 lg:right-6 lg:left-auto">
          <header className="flex items-center justify-between gap-4 bg-slate-950 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#009494]">
                <Bot size={22} />
              </div>
              <div>
                <p className="text-sm font-black">Health AI Assistant</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Gemini + Grok fallback</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={startNewChat} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20" title="Start new chat">
                <RotateCcw size={17} />
              </button>
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20" title="Close chatbot">
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="max-h-[calc(78vh-76px)] overflow-y-auto p-4">
            <div className="rounded-2xl bg-teal-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 shrink-0 text-[#009494]" size={18} />
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  Symptoms bataiye ya report PDF/image upload karein. Main text-based, scanned PDFs aur report images se values read karke safe guidance dunga.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {starterQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => askQuestion(question)}
                  className="rounded-full bg-slate-100 px-3 py-2 text-left text-[11px] font-bold text-slate-600 transition hover:bg-[#009494] hover:text-white"
                >
                  {question}
                </button>
              ))}
            </div>

            {!hasAnswer && renderComposer()}

            {error && (
              <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                {error}
              </div>
            )}

            {loading && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                <Loader2 className="animate-spin text-[#009494]" size={18} /> {selectedPdf ? 'Report scan aur AI analysis ho raha hai...' : 'AI platform data read kar raha hai...'}
              </div>
            )}

            {chatItems.length > 0 && (
              <div className="mt-4 space-y-3">
                {chatItems.map((item) => (
                  item.role === 'user' ? (
                    <div key={item.id} className="ml-auto max-w-[88%] rounded-2xl bg-[#009494] px-4 py-3 text-sm font-bold leading-6 text-white">
                      {item.text}
                      {item.fileName && <p className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-white/70">File attached</p>}
                    </div>
                  ) : (
                    <div key={item.id} className="rounded-2xl border border-slate-100 bg-white p-3">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        AI response | {item.answer.provider || 'assistant'}
                      </p>
                      <p className="text-sm font-semibold leading-6 text-slate-700">{item.answer.summary}</p>
                    </div>
                  )
                ))}
              </div>
            )}

            {hasAnswer && !loading && (
              <div className="mt-4 space-y-3">
                {answer.emergency && (
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <AlertTriangle className="mt-1 shrink-0 text-amber-600" size={18} />
                    <p className="text-sm font-bold leading-6 text-amber-800">
                      Breathing problem urgent ho sakta hai. Severe symptoms me emergency help ya doctor ko turant contact karein.
                    </p>
                  </div>
                )}

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#009494]">AI guidance</p>
                  {answer.reportScanned && (
                    <p className="mb-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-indigo-700">
                      Report scanned | {answer.usedVisionPdf ? 'visual scan used' : `${answer.extractedCharacters || 0} chars read`}
                  </p>
                  )}
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{answer.summary}</p>
                </div>

                {answer.clinicalContext && (
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical context</p>
                    <ul className="mt-3 space-y-2">
                      {toPointList(answer.clinicalContext).map((point, index) => (
                        <li key={`${point}-${index}`} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#009494] text-[10px] font-black text-white">{index + 1}</span>
                          <p className="text-sm font-semibold leading-6 text-slate-700">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {answer.reportFindings?.length > 0 && (
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Report remarks</p>
                    <div className="mt-3 space-y-3">
                      {answer.reportFindings.map((finding, index) => (
                        <article key={`${finding.testName}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-black text-slate-900">{finding.testName || 'Report value'}</p>
                            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
                              finding.status === 'high'
                                ? 'bg-rose-50 text-rose-700'
                                : finding.status === 'low'
                                  ? 'bg-amber-50 text-amber-700'
                                  : finding.status === 'normal'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-indigo-50 text-indigo-700'
                            }`}>
                              {finding.status || 'review_needed'}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-bold text-slate-700">{finding.value || '-'}</p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{finding.remark || '-'}</p>
                          {finding.possibleReasons?.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Possible reasons</p>
                              <ul className="mt-1 space-y-1">
                                {finding.possibleReasons.map((reason) => (
                                  <li key={reason} className="text-xs font-semibold leading-5 text-slate-600">- {reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {finding.action && (
                            <div className="mt-3 rounded-xl bg-white p-3 text-xs font-bold leading-5 text-slate-700">
                              Next action: {finding.action}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {answer.possibleCauses?.length > 0 && (
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Possible reasons</p>
                    <ul className="mt-2 space-y-2">
                      {answer.possibleCauses.map((item) => (
                        <li key={item} className="text-sm font-semibold leading-6 text-slate-700">- {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {answer.homeRemedies?.length > 0 && (
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Home remedies</p>
                    <ul className="mt-2 space-y-2">
                      {answer.homeRemedies.map((step) => (
                        <li key={step} className="text-sm font-semibold leading-6 text-slate-700">- {step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {answer.redFlags?.length > 0 && (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Red flags</p>
                    <ul className="mt-2 space-y-2">
                      {answer.redFlags.map((item) => (
                        <li key={item} className="text-sm font-bold leading-6 text-rose-800">- {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {answer.nextSteps?.length > 0 && (
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next steps</p>
                    <ul className="mt-2 space-y-2">
                      {answer.nextSteps.map((step) => (
                        <li key={step} className="text-sm font-semibold leading-6 text-slate-700">- {step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {answer.recommendedTests?.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Related tests</p>
                    <div className="grid gap-2">
                      {answer.recommendedTests.map((card) => (
                        <button
                          key={`${card.type}-${card.id}`}
                          type="button"
                          onClick={() => bookCard(card)}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left transition hover:border-[#009494] hover:shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-[#009494]">
                              <TestTube2 size={19} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{card.title}</p>
                              <p className="text-xs font-semibold text-slate-500">{card.category || 'Health check'} | Report in {card.reportTimeHours || 24} hrs</p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-xl bg-slate-950 px-3 py-2 text-[10px] font-black text-white">
                            Rs. {Number(card.price || 0).toLocaleString('en-IN')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-[11px] font-semibold leading-5 text-slate-400">
                  {answer.disclaimer || 'AI guidance educational hai. Doctor final diagnosis/treatment karega.'}
                </p>
              </div>
            )}

            {hasAnswer && renderComposer(true)}
          </div>
        </section>
      )}
    </>
  );
};

export default HealthAiChatbot;

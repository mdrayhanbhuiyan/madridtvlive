import { useState, useMemo } from 'react';
import { Sparkles, Brain, Search, Image as ImageIcon, Send, Save, RefreshCw, Eye, Wand2, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';
import slugify from 'slugify';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const SPORTS = ['Football', 'Cricket', 'NBA', 'Tennis', 'F1', 'Golf', 'UFC', 'Boxing', 'Baseball', 'General'];
const NEWS_TYPES = ['Breaking', 'Transfer', 'Match Preview', 'Match Report', 'Injury Update', 'Rumor', 'Analysis'];
const COUNTRIES = ['Global', 'Bangladesh', 'India', 'UK', 'Spain', 'USA'];
const TONES = ['Professional', 'Viral', 'Friendly', 'Neutral'];
const LENGTHS = ['Short (300 words)', 'Medium (600 words)', 'Long (1200 words)'];

export default function AINewsLab() {
  const [loading, setLoading] = useState(false);
  const [humanizing, setHumanizing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [params, setParams] = useState({
    sport: 'Football',
    type: 'Breaking',
    country: 'Global',
    tone: 'Viral',
    length: 'Medium (600 words)',
    seo: 'High'
  });

  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Initialize GenAI directly in the component (Vite/AI Studio handles the key)
  const ai = useMemo(() => {
    const key = process.env.GEMINI_API_KEY || '';
    if (!key) {
      console.warn("GEMINI_API_KEY is missing in the frontend environment.");
    }
    return new GoogleGenAI({ apiKey: key });
  }, []);

  const generateNews = async () => {
    setLoading(true);
    setAiError(null);
    try {
      const prompt = `
        As a senior sports journalist and SEO expert for "Madrid TV Live", generate a unique sports news article.
        
        Sport: ${params.sport}
        Type: ${params.type}
        Target Country: ${params.country}
        Tone: ${params.tone}
        Article Length: ${params.length}
        SEO Priority: ${params.seo}
        
        Requirements:
        1. Unique, human-like writing (no plagiarism).
        2. Format output as a STRICT JSON object with these keys: 
           title, metaTitle, metaDescription, slug, category, content (HTML with H2 tags), excerpt, tags (array), faqs (array of {q, a}), imagePrompt.
        3. Include a "Suggested Internal Links" placeholder in the content.
        4. Focus on viral and engaging headlines.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a professional sports journalist. Always return valid JSON."
        }
      });

      const text = response.text;
      if (!text) throw new Error("AI returned empty response");

      try {
        const parsedData = JSON.parse(text);
        setGeneratedResult(parsedData);
        setViewMode('edit');
      } catch (parseError) {
        console.error("JSON Parse Error. Raw text:", text);
        setAiError("AI returned invalid data format. Please try again.");
      }
    } catch (err: any) {
      console.error("Gemini Error:", err);
      setAiError(err.message || 'AI Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const humanizeContent = async (intensity: string) => {
    if (!generatedResult) return;
    setHumanizing(true);
    setAiError(null);
    try {
      const prompt = `
        Humanize the following sports news content. Intensity: ${intensity}.
        Rewrite to make it look natural and human-written. 
        Reduce repetitive AI patterns, add natural transitions, and keep the SEO structure (H2 tags etc).
        
        Content:
        ${generatedResult.content}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a master editor refining sports articles to sound natural and engaging."
        }
      });

      const text = response.text;
      if (text) {
        setGeneratedResult({ ...generatedResult, content: text });
      }
    } catch (err: any) {
      console.error("Humanization Error:", err);
      setAiError("Humanization failed: " + err.message);
    } finally {
      setHumanizing(false);
    }
  };

  const publishNews = async () => {
    if (!generatedResult) return;
    try {
      await addDoc(collection(db, 'news'), {
        ...generatedResult,
        status: 'Published',
        publishDate: Date.now(),
        createdAt: Date.now(),
        allowComments: true,
        isFeatured: false
      });
      alert('News published successfully!');
      setGeneratedResult(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'news');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-neon-lime flex items-center gap-2">
              <Sparkles size={14} /> Generator Config
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Sport Category</label>
                <select className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={params.sport} onChange={e => setParams({...params, sport: e.target.value})}>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/30 uppercase ml-1">News Type</label>
                <select className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={params.type} onChange={e => setParams({...params, type: e.target.value})}>
                  {NEWS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Target Country</label>
                <select className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={params.country} onChange={e => setParams({...params, country: e.target.value})}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Writing Tone</label>
                <select className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={params.tone} onChange={e => setParams({...params, tone: e.target.value})}>
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <button 
              disabled={loading}
              onClick={generateNews}
              className="w-full group relative bg-neon-lime text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all overflow-hidden flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Brain size={16} />}
              <span className="relative z-10">{loading ? 'Generating Intelligence...' : 'Generate AI News'}</span>
            </button>

            {aiError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold leading-relaxed">{aiError}</p>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
               <Wand2 size={14} /> Humanizer Engine
             </h3>
             <div className="grid grid-cols-1 gap-2">
                {['Light', 'Medium', 'Strong'].map(intensity => (
                  <button 
                    key={intensity} 
                    disabled={!generatedResult || humanizing}
                    onClick={() => humanizeContent(intensity)}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    {humanizing ? <RefreshCw className="animate-spin" size={12} /> : null}
                    Humanize {intensity}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Editor/Preview Column */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!generatedResult ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-[600px] bg-white/5 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                  <Brain size={32} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest text-white/20">Awaiting AI Brainstorm</h4>
                <p className="text-xs text-white/10 mt-2 max-w-xs">Select options and click generate to start creating SEO-optimized sports content.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900 border border-white/10 rounded-3xl flex flex-col h-[700px] overflow-hidden"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                  <div className="flex gap-2">
                    <button onClick={() => setViewMode('edit')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'edit' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Editor</button>
                    <button onClick={() => setViewMode('preview')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Preview</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={publishNews} className="flex items-center gap-2 bg-neon-lime text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                      <Send size={14} /> Publish Now
                    </button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                  {viewMode === 'edit' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">SEO Title</label>
                        <input value={generatedResult.title} onChange={e => setGeneratedResult({...generatedResult, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-lg font-black uppercase tracking-tight text-white focus:border-neon-lime" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Article Body (HTML/Markdown)</label>
                        <textarea 
                          value={generatedResult.content} 
                          onChange={e => setGeneratedResult({...generatedResult, content: e.target.value})}
                          className="w-full h-80 bg-black border border-white/10 rounded-2xl p-4 text-sm font-medium text-white/80 focus:border-neon-lime font-mono leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Meta Title</label>
                          <input value={generatedResult.metaTitle} onChange={e => setGeneratedResult({...generatedResult, metaTitle: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-[11px] text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Featured Image URL</label>
                          <input value={generatedResult.image} onChange={e => setGeneratedResult({...generatedResult, image: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-[11px] text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <article className="prose prose-invert max-w-none">
                      <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-8">
                         {generatedResult.image && generatedResult.image.trim() !== '' ? (
                           <img src={generatedResult.image} className="w-full h-full object-cover" alt="" />
                         ) : (
                           <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="" />
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                         <div className="absolute bottom-4 left-6">
                            <span className="bg-neon-lime text-black px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">{generatedResult.category}</span>
                         </div>
                      </div>
                      <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-6">{generatedResult.title}</h1>
                      <div dangerouslySetInnerHTML={{ __html: generatedResult.content }} />
                      
                      <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                         <h4 className="text-xs font-black uppercase text-[#CCFF00]">AI-Generated Meta Tags</h4>
                         <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-2">
                            <p className="text-[10px] text-white/40"><span className="text-white font-bold">Meta Title:</span> {generatedResult.metaTitle}</p>
                            <p className="text-[10px] text-white/40"><span className="text-white font-bold">Meta Desc:</span> {generatedResult.metaDescription}</p>
                            <div className="flex gap-2 flex-wrap mt-4">
                               {generatedResult.tags?.map((t: string) => <span key={t} className="px-2 py-1 bg-white/5 rounded text-[8px] text-white/60">#{t}</span>)}
                            </div>
                         </div>
                      </div>
                    </article>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

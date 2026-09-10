import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, RotateCcw, X, AlertCircle } from 'lucide-react';
import { getAIProvider, isDemoMode } from '../lib/ai/provider';
import { ComplaintAnalysis, GeneratedComplaint } from '../types/complaint';
import { getCategoryConfig } from '../lib/categories';

type RecordingState = 'idle' | 'recording' | 'processing' | 'followup' | 'error';

export function Report() {
  const navigate = useNavigate();
  const [state, setState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<ComplaintAnalysis | null>(null);
  const [generated, setGenerated] = useState<GeneratedComplaint | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(20).fill(0));

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startVisualization = useCallback((stream: MediaStream) => {
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(data);
        const normalized = Array.from(data).slice(0, 20).map(v => v / 255);
        setWaveformData(normalized);
        animationRef.current = requestAnimationFrame(update);
      };
      update();
    } catch {
      // Visualization is non-critical
    }
  }, []);

  const stopVisualization = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setWaveformData(new Array(20).fill(0));
  }, []);

  const startRecording = async () => {
    try {
      setError('');
      setPermissionDenied(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        stopVisualization();
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 1000) {
          setError('Recording too short. Please try again.');
          setState('idle');
          return;
        }
        await processAudio(blob);
      };

      mediaRecorder.start();
      setState('recording');
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      startVisualization(stream);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setError('Microphone permission denied. Please allow access and try again.');
      } else {
        setError('Unable to access microphone. Please check your device settings.');
      }
      setState('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopVisualization();
    setState('idle');
    setTimer(0);
  };

  const processAudio = async (blob: Blob) => {
    setState('processing');
    setError('');
    try {
      const provider = getAIProvider();
      const transcriptText = await provider.transcribeAudio(blob);
      setTranscript(transcriptText);
      
      const analysisResult = await provider.analyzeComplaint(transcriptText);
      setAnalysis(analysisResult);

      if (analysisResult.missingInformation.length > 0) {
        setState('followup');
      } else {
        const generatedResult = await provider.generateComplaint(analysisResult);
        setGenerated(generatedResult);
        // Store in session for result page
        sessionStorage.setItem('awaaz-current', JSON.stringify({
          analysis: analysisResult,
          generated: generatedResult,
        }));
        navigate('/report/result');
      }
    } catch {
      setError('Unable to process your recording. Please try again.');
      setState('error');
    }
  };

  const handleFollowupSubmit = async () => {
    if (!analysis) return;
    setState('processing');
    try {
      const provider = getAIProvider();
      const updatedAnalysis = {
        ...analysis,
        ...additionalInfo,
        missingInformation: [],
      };
      const generatedResult = await provider.generateComplaint(updatedAnalysis as ComplaintAnalysis, additionalInfo);
      setGenerated(generatedResult);
      sessionStorage.setItem('awaaz-current', JSON.stringify({
        analysis: updatedAnalysis,
        generated: generatedResult,
      }));
      navigate('/report/result');
    } catch {
      setError('Unable to generate complaint. Please try again.');
      setState('followup');
    }
  };

  const reset = () => {
    setState('idle');
    setTranscript('');
    setAnalysis(null);
    setGenerated(null);
    setAdditionalInfo({});
    setError('');
    setTimer(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopVisualization();
    };
  }, [stopVisualization]);

  const demoMode = isDemoMode();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {demoMode && (
          <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-center text-xs text-amber-400">
            Demo Mode — Using sample responses. Configure API key for live AI.
          </div>
        )}

        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Apni shikayat bolain
          </h1>
          <p className="mb-1 text-sm text-zinc-500 font-urdu">
            اپنی شکایت بولیں
          </p>
          <p className="text-xs text-zinc-600">Speak your complaint in Urdu</p>
        </div>

        {/* Recording Area */}
        <div className="mt-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <button
                  onClick={startRecording}
                  className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 transition-all hover:bg-zinc-700 hover:shadow-lg hover:shadow-zinc-800/50 sm:h-28 sm:w-28"
                  aria-label="Start recording"
                >
                  <Mic size={32} className="text-zinc-300 transition-colors group-hover:text-emerald-400" />
                  <div className="absolute inset-0 rounded-full border border-zinc-700 transition-colors group-hover:border-emerald-500/30" />
                </button>
                <p className="mt-4 text-sm text-zinc-400">Tap to speak</p>
                <p className="mt-1 text-xs text-zinc-600">Hold or tap the microphone</p>
              </motion.div>
            )}

            {state === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <button
                    onClick={stopRecording}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 transition-all hover:bg-red-500/20 sm:h-28 sm:w-28"
                    aria-label="Stop recording"
                  >
                    <Square size={28} className="text-red-400" fill="currentColor" />
                  </button>
                  <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-pulse-ring" />
                </div>

                {/* Waveform */}
                <div className="mt-6 flex h-12 items-center gap-0.5">
                  {waveformData.map((v, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-emerald-400/60 transition-all duration-75"
                      style={{ height: `${Math.max(4, v * 48)}px` }}
                    />
                  ))}
                </div>

                <p className="mt-3 text-sm font-medium text-red-400">Recording</p>
                <p className="mt-1 font-mono text-lg text-zinc-300">{formatTime(timer)}</p>

                <button
                  onClick={cancelRecording}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                >
                  <X size={12} /> Cancel
                </button>
              </motion.div>
            )}

            {state === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-400" />
                </div>
                <p className="mt-4 text-sm text-zinc-300">Understanding your complaint...</p>
                <p className="mt-1 text-xs text-zinc-600">This may take a moment</p>
              </motion.div>
            )}

            {state === 'followup' && analysis && (
              <motion.div
                key="followup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <div className="mb-4">
                    <p className="text-xs text-zinc-500 mb-2">Awaaz understood:</p>
                    <p className="text-sm text-zinc-300 font-urdu leading-relaxed">{analysis.transcript}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                        {getCategoryConfig(analysis.category).icon} {getCategoryConfig(analysis.category).label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                        🏢 {analysis.department}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <p className="mb-3 text-sm font-medium text-zinc-200">
                      I need {analysis.missingInformation.length} more detail{analysis.missingInformation.length > 1 ? 's' : ''}
                    </p>
                    {analysis.missingInformation.map(field => (
                      <div key={field} className="mb-3">
                        <label className="mb-1 block text-xs text-zinc-500 capitalize">
                          {field === 'location' ? 'Where is this happening?' : 
                           field === 'duration' ? 'Since when?' : field}
                        </label>
                        <input
                          type="text"
                          value={additionalInfo[field] || ''}
                          onChange={e => setAdditionalInfo(prev => ({ ...prev, [field]: e.target.value }))}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50 focus:bg-zinc-800"
                          placeholder={field === 'location' ? 'e.g., University Town' : 'e.g., 2 days'}
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleFollowupSubmit}
                      className="mt-2 w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:bg-white"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle size={24} className="text-red-400" />
                </div>
                <p className="mt-3 text-sm text-zinc-300">{error || 'Something went wrong.'}</p>
                {permissionDenied && (
                  <p className="mt-1 text-xs text-zinc-500">Check your browser settings to allow microphone access.</p>
                )}
                <button
                  onClick={reset}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <RotateCcw size={14} /> Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust message */}
        {state === 'idle' && (
          <p className="mt-10 text-center text-[11px] text-zinc-600">
            Your recording is processed securely. AI-generated drafts should be reviewed before submission.
          </p>
        )}
      </motion.div>
    </main>
  );
}

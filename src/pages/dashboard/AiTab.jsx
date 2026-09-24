import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertCircle, Copy, Loader2, CheckCircle, Zap } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { endpointsService } from '../../services/endpointsService';
import { logsService } from '../../services/logsService';
import toast from 'react-hot-toast';
import { TitleGraphBackdrop } from '../../components/animations/TitleGraphBackdrop';
import { PageLoader } from '../../components/PageLoader';

const getCachedAi = () => {
  try {
    const cached = sessionStorage.getItem('vixiem_ai_cache');
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return null;
};

export const AiTab = () => {
  const cached = getCachedAi();
  const [limitStatus, setLimitStatus] = useState(cached?.limitStatus || { limit: 50, used: 0, remainingCalls: 50 });
  const [stats, setStats] = useState(cached?.stats || null);
  const [loadingInitial, setLoadingInitial] = useState(!cached);

  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  
  const [errorLogs, setErrorLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      if (!cached) setLoadingInitial(true);
      const fetchPromise = Promise.all([
        aiService.getLimitStatus().catch(() => null),
        aiService.getStats().catch(() => null),
        endpointsService.getEndpoints().catch(() => [])
      ]);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 800));
      const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
      let limitRes, statsRes, endpointsRes;
      if (raceResult === 'TIMEOUT') {
        setLoadingInitial(false);
        [limitRes, statsRes, endpointsRes] = await fetchPromise;
      } else {
        [limitRes, statsRes, endpointsRes] = raceResult;
      }
      if (limitRes) setLimitStatus(limitRes);
      if (statsRes) setStats(statsRes);
      if (endpointsRes && endpointsRes.length > 0) {
        setEndpoints(endpointsRes);
        setSelectedEndpoint(endpointsRes[0].id);
      }
      try {
        sessionStorage.setItem('vixiem_ai_cache', JSON.stringify({ limitStatus: limitRes, stats: statsRes }));
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching AI initial data', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    if (!selectedEndpoint) return;
    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const res = await logsService.getLogs({ endpointId: selectedEndpoint, level: 'ERROR' });
        const logsArray = Array.isArray(res) ? res : (res.content || []);
        setErrorLogs(logsArray.slice(0, 20));
      } catch (err) {
        toast.error('Failed to load error logs');
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [selectedEndpoint]);

  const handleToggleLog = (id) => {
    setSelectedLogs(prev => 
      prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (selectedLogs.length === 0) {
      toast.error('Select at least one error log to analyze.');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    setAiError(null);

    try {
      const selectedLogObjects = errorLogs.filter(l => selectedLogs.includes(l.id));
      const logMessages = selectedLogObjects.map(l => l.message);

      const res = await aiService.analyzeErrors(selectedEndpoint, logMessages);
      setAnalysisResult(res.analysis);
      
      // Update quota status after successful analysis
      const newLimitStatus = await aiService.getLimitStatus();
      setLimitStatus(newLimitStatus);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'QUOTA_EXCEEDED') {
        setAiError('QUOTA');
      } else {
        setAiError('ERROR');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingInitial) {
    return <PageLoader message="Connecting to AI telemetry engine..." />;
  }

  const limit = limitStatus?.limit || 50;
  const used = limitStatus?.used || 0;
  const remaining = limitStatus?.remainingCalls ?? (limit - used);
  const percentage = Math.min((used / limit) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 flex items-center gap-4 mb-8 transition-colors">
        <TitleGraphBackdrop />
        <div className="relative z-10 w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center border border-sky-200 dark:border-sky-500/20 shadow-sm shrink-0">
          <Brain className="w-6 h-6 text-sky-600 dark:text-sky-400" />
        </div>
        <div className="relative z-10">
           <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">AI Error Analysis</h2>
           <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Leverage AI to instantly diagnose endpoint failures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Usage & Selection */}
        <div className="lg:col-span-1 space-y-8">
          {/* Usage Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm dark:shadow-xl dark:shadow-black/30"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-400 fill-sky-400" />
                Daily AI Quota
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-neutral-700 rounded-md text-slate-700 dark:text-slate-300 tracking-wider">
                {limitStatus?.subscriptionPlan || 'FREE'}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-neutral-900 rounded-full h-2.5 mb-3 overflow-hidden border border-slate-200 dark:border-neutral-800">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${percentage > 90 ? 'bg-rose-500' : percentage > 75 ? 'bg-sky-400' : 'bg-sky-400 dark:bg-sky-400'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span>{used} used</span>
              <span>{remaining} remaining</span>
            </div>
          </motion.div>

          {/* Endpoint & Logs Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col h-[550px] shadow-sm dark:shadow-xl dark:shadow-black/30"
          >
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-5 text-lg">Select Errors to Analyze</h3>
            
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 tracking-wide uppercase">Target Endpoint</label>
              <select
                className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
              >
                {endpoints.map(ep => (
                  <option key={ep.id} value={ep.id} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">{ep.name} ({ep.url})</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {loadingLogs ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
              ) : errorLogs.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800">No recent errors found for this endpoint.</div>
              ) : (
                errorLogs.map(log => (
                  <label 
                    key={log.id} 
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedLogs.includes(log.id) 
                        ? 'bg-sky-400/10 dark:bg-sky-400/10 border-sky-400/50 dark:border-sky-400/50 shadow-sm' 
                        : 'bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="pt-0.5">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-sky-400 dark:text-sky-400 focus:ring-sky-400 cursor-pointer"
                        checked={selectedLogs.includes(log.id)}
                        onChange={() => handleToggleLog(log.id)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">ERROR</span>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-mono truncate">{log.message}</p>
                    </div>
                  </label>
                ))
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || selectedLogs.length === 0 || remaining <= 0}
              className="mt-5 w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze Selected Errors ({selectedLogs.length})
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Right Column: AI Results & Insights */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 min-h-[660px] shadow-sm dark:shadow-xl dark:shadow-black/30"
          >
            {aiError === 'QUOTA' && (
              <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 flex flex-col items-center text-center">
                <AlertCircle className="w-12 h-12 mb-3 text-rose-500" />
                <h4 className="text-lg font-bold mb-1">Daily AI Quota Reached</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">You have used all available AI calls for today. Please wait for the 24-hour rolling reset window.</p>
              </div>
            )}

            {aiError === 'ERROR' && (
              <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 flex flex-col items-center text-center">
                <AlertCircle className="w-12 h-12 mb-3 text-rose-500" />
                <h4 className="text-lg font-bold mb-1">Analysis Failed</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">An error occurred while communicating with the AI service. Please try again.</p>
              </div>
            )}

            {!analyzing && !analysisResult && !aiError && (
              <div className="flex flex-col items-center justify-center h-[550px] text-center text-slate-500 dark:text-slate-400">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-sky-400 dark:text-sky-400">
                  <Brain size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2">No Analysis Running</h3>
                <p className="max-w-md text-sm font-light text-slate-600 dark:text-slate-400">
                  Select error logs from the left panel and click "Analyze Selected Errors" to generate root cause diagnosis and fix solutions.
                </p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-[550px] text-center">
                <Loader2 className="w-12 h-12 text-sky-400 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2">Analyzing Logs with AI...</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-light">Diagnosing stack traces and root causes...</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
                      <CheckCircle className="w-5 h-5" />
                      AI Diagnosis Complete
                    </div>
                    {analysisResult.severity && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                        analysisResult.severity === 'HIGH' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                        analysisResult.severity === 'MEDIUM' ? 'bg-sky-400/10 text-sky-500 dark:text-sky-400 border-sky-400/30' :
                        'bg-emerald-500/10 text-sky-600 dark:text-sky-400 border-emerald-500/30'
                      }`}>
                        {analysisResult.severity} SEVERITY
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
                      toast.success('Analysis copied to clipboard');
                    }}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Copy size={15} /> Copy Report
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="p-5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-sm">
                    <h4 className="text-xs font-semibold text-sky-500 dark:text-sky-400 uppercase tracking-wider mb-2">ROOT CAUSE</h4>
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{analysisResult.rootCause || analysisResult.summary || 'Root cause identified.'}</p>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-sm">
                    <h4 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-3">SUGGESTED RESOLUTION</h4>
                    {Array.isArray(analysisResult.recommendations) && analysisResult.recommendations.length > 0 ? (
                      <ul className="space-y-2.5">
                        {analysisResult.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-light whitespace-pre-wrap">
                        {analysisResult.solution || analysisResult.recommendedFix || 'Follow recommended fixes.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AiTab;

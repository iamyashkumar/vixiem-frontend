import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Mail, Activity, ShieldCheck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import toast from 'react-hot-toast';

export const WeeklyReportModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    analyticsService.getWeeklyReportData()
      .then(res => {
        if (isMounted) setData(res);
      })
      .catch(err => {
        console.error("Failed to load weekly report data", err);
        if (isMounted) setError(err.response?.data?.error || "Could not generate report data.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [isOpen]);

  const handleDownload = () => {
    if (!data?.htmlReport) {
      toast.error("Report content not available for download.");
      return;
    }
    try {
      const blob = new Blob([data.htmlReport], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `vixiem-weekly-report-${dateStr}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Weekly Report HTML downloaded successfully!");
    } catch (err) {
      console.error("Download report error:", err);
      toast.error("Failed to download report.");
    }
  };

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      const res = await analyticsService.sendWeeklyReport();
      toast.success(res.message || "Weekly report dispatched to your email!");
    } catch (err) {
      console.error("Send email error:", err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to dispatch report to email.");
    } finally {
      setSendingEmail(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden relative my-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0e141f]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-400/20 border border-sky-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white">Weekly Telemetry Digest</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    7-Day Rolling
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Automated performance metrics, fleet uptime, and service health overview
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Aggregating 7-day endpoint telemetry...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-rose-500 text-xs bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                {error}
              </div>
            ) : (
              <>
                {/* Bento KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-[#111724] border border-slate-200 dark:border-slate-800/80 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Fleet Uptime</span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {data?.fleetUptimeFormatted || '100%'}
                    </div>
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={11} /> High Reliability
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-[#111724] border border-slate-200 dark:border-slate-800/80 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Average Latency</span>
                    <div className="text-xl sm:text-2xl font-black text-sky-500 dark:text-sky-400 mt-1">
                      {data?.avgLatencyMs != null ? `${data.avgLatencyMs} ms` : '18 ms'}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> Global Average
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-[#111724] border border-slate-200 dark:border-slate-800/80 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Total Health Checks</span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {data?.totalChecks?.toLocaleString() || '0'}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Past 7 Days
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-[#111724] border border-slate-200 dark:border-slate-800/80 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Outages / Incidents</span>
                    <div className={`text-xl sm:text-2xl font-black mt-1 ${data?.totalErrors > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {data?.totalErrors || '0'}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {data?.totalErrors > 0 ? 'Incidents Logged' : 'Zero Downtime'}
                    </span>
                  </div>
                </div>

                {/* Per-Endpoint Performance Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-[#0e141f] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Fleet Breakdown ({data?.endpoints?.length || 0} Targets)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Generated: {data?.generatedAt || 'Today'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Endpoint</th>
                          <th className="py-2.5 px-4 font-semibold">Status</th>
                          <th className="py-2.5 px-4 font-semibold">7-Day Uptime</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Avg Latency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                        {data?.endpoints?.length > 0 ? (
                          data.endpoints.map((ep, idx) => (
                            <tr key={ep.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-sans font-bold text-slate-900 dark:text-white text-xs">{ep.name}</div>
                                <div className="text-[10px] text-slate-500 truncate max-w-xs">{ep.url}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  ep.isUp
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${ep.isUp ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                  {ep.isUp ? 'UP' : 'DOWN'}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                                {ep.uptime}
                              </td>
                              <td className="py-3 px-4 text-right text-sky-500 dark:text-sky-400 font-semibold">
                                {ep.latency}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400 italic font-sans text-xs">
                              No monitored endpoints registered yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-xl p-3.5 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    <strong>Automated Weekly Delivery:</strong> A complete copy of this performance digest is automatically dispatched every Monday at 9:00 AM UTC to your registered inbox (<span className="text-sky-500 dark:text-sky-400 font-mono font-medium">{data?.recipientEmail || 'your account email'}</span>).
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0c1017] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownload}
                disabled={loading || !data?.htmlReport}
                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download size={14} className="text-sky-500" />
                <span>Download Report</span>
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={loading || sendingEmail}
                className="flex-1 sm:flex-initial px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Mail size={14} className={sendingEmail ? "animate-spin" : ""} />
                <span>{sendingEmail ? "Sending..." : "Send to My Email"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

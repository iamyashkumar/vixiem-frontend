import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Type, Clock, Mail, MessageSquare, Bell } from 'lucide-react';

export const EndpointModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    checkIntervalSeconds: 60,
    isActive: true,
    alertsEnabled: false,
    alertEmail: '',
    discordWebhookUrl: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        url: initialData.url || '',
        checkIntervalSeconds: initialData.checkIntervalSeconds || 60,
        isActive: initialData.isActive !== undefined ? initialData.isActive : (initialData.active !== undefined ? initialData.active : true),
        alertsEnabled: initialData.alertsEnabled || false,
        alertEmail: initialData.alertEmail || '',
        discordWebhookUrl: initialData.discordWebhookUrl || '',
        tags: initialData.tags || []
      });
    } else {
      setFormData({ name: '', url: '', checkIntervalSeconds: 60, isActive: true, alertsEnabled: false, alertEmail: '', discordWebhookUrl: '', tags: [] });
    }
    setTagInput('');
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        const parsed = new URL(formData.url);
        if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
          throw new Error('Unsupported URL');
        }
      } catch (e) {
        newErrors.url = "Please enter a valid URL (e.g., https://api.example.com)";
      }
    }
    if (formData.checkIntervalSeconds < 30) newErrors.checkIntervalSeconds = "Minimum 30 seconds";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const finalData = { ...formData };
      if (tagInput.trim()) {
        const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
        finalData.tags = [...new Set([...finalData.tags, ...newTags])];
      }
      onSave(finalData);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh] my-auto overflow-hidden"
        >
          <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 shrink-0 relative z-10">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Endpoint' : 'Add New Endpoint'}
            </h3>
            <button 
              onClick={onClose} 
              aria-label="Close endpoint dialog"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 tracking-wide uppercase">Endpoint Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Type size={18} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-12 px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                  placeholder="e.g. Production Payment API"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1"><X size={14}/> {errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 tracking-wide uppercase">URL to Monitor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-12 px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-sm"
                  placeholder="https://api.yourdomain.com/health"
                />
              </div>
              {errors.url && <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1"><X size={14}/> {errors.url}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 tracking-wide uppercase">Check Interval (Seconds)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Clock size={18} />
                </div>
                <input
                  type="number"
                  min="30"
                  value={formData.checkIntervalSeconds}
                  onChange={(e) => setFormData({ ...formData, checkIntervalSeconds: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-12 px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-display text-lg"
                />
              </div>
              {errors.checkIntervalSeconds && <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1"><X size={14}/> {errors.checkIntervalSeconds}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 tracking-wide uppercase">Tags (optional)</label>
              <div className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all flex flex-wrap gap-2 min-h-[52px]">
                {formData.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 rounded-lg text-xs uppercase tracking-wider font-medium">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-slate-500 hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="bg-transparent border-none text-slate-900 dark:text-white focus:outline-none flex-1 min-w-[150px] text-sm py-1 px-2 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder={formData.tags.length === 0 ? "e.g. prod, payment (Press Enter)" : "Add tag..."}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center p-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 text-sky-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="ml-3 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer flex-1">
                  Active (Enable Monitoring)
                </label>
              </div>

              <div className="flex items-center p-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer" onClick={() => setFormData({ ...formData, alertsEnabled: !formData.alertsEnabled })}>
                <input
                  type="checkbox"
                  id="alertsEnabled"
                  checked={formData.alertsEnabled}
                  onChange={(e) => setFormData({ ...formData, alertsEnabled: e.target.checked })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 text-sky-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="alertsEnabled" className="ml-3 flex items-center text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer flex-1">
                  <Mail size={18} className="mr-2.5 text-sky-500 dark:text-sky-400" />
                  Receive Email Alerts
                </label>
              </div>

              {formData.alertsEnabled && (
                <div className="pl-2 animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 tracking-wide uppercase">Custom Alert Email (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={formData.alertEmail}
                      onChange={(e) => setFormData({ ...formData, alertEmail: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-12 px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                      placeholder="alerts@yourcompany.com (Defaults to account email)"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 tracking-wide uppercase flex items-center gap-2">
                  <MessageSquare size={16} className="text-indigo-500 dark:text-indigo-400" />
                  Discord Webhook Alert (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Bell size={18} className="text-indigo-500/70" />
                  </div>
                  <input
                    type="url"
                    value={formData.discordWebhookUrl}
                    onChange={(e) => setFormData({ ...formData, discordWebhookUrl: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-12 px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-xs"
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Receive instant rich embed downtime & recovery notifications directly in Discord.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-8 py-2.5 font-semibold"
              >
                {isEditing ? 'Save Changes' : 'Add Endpoint'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default EndpointModal;

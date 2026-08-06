import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Server, Clock, Trash2, Edit3, ArrowUpRight, Mail, MessageSquare } from 'lucide-react';
import { endpointsService } from '../../services/endpointsService';
import { PageLoader } from '../../components/PageLoader';
import { ApiError } from '../../components/ApiError';
import { EndpointModal } from '../../components/modals/EndpointModal';
import { ConfirmDeleteModal } from '../../components/modals/ConfirmDeleteModal';

const StatusBadge = ({ isUp }) => (
  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider flex items-center gap-1.5 border ${
    isUp 
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  }`}>
    <span className={`w-2 h-2 rounded-full ${isUp ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
    {isUp ? 'UP' : 'DOWN'}
  </span>
);

export const EndpointsTab = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);
  const [deletingEndpoint, setDeletingEndpoint] = useState(null);

  const fetchEndpoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await endpointsService.getEndpoints();
      setEndpoints(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch monitored endpoints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const openAddModal = () => {
    setEditingEndpoint(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (endpoint) => {
    setEditingEndpoint(endpoint);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (endpoint) => {
    setDeletingEndpoint(endpoint);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEndpoint = async (formData) => {
    try {
      if (editingEndpoint) {
        const updated = await endpointsService.updateEndpoint(editingEndpoint.id, formData);
        setEndpoints(prev => prev.map(ep => ep.id === editingEndpoint.id ? updated : ep));
      } else {
        const newEp = await endpointsService.createEndpoint(formData);
        setEndpoints(prev => [newEp, ...prev]);
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setEditingEndpoint(null);
    } catch (err) {
      console.error("Save endpoint failed", err);
    }
  };

  const handleDeleteEndpoint = async () => {
    if (!deletingEndpoint) return;
    try {
      await endpointsService.deleteEndpoint(deletingEndpoint.id);
      setEndpoints(prev => prev.filter(ep => ep.id !== deletingEndpoint.id));
      setIsDeleteModalOpen(false);
      setDeletingEndpoint(null);
    } catch (err) {
      console.error("Delete endpoint failed", err);
    }
  };

  const filteredEndpoints = endpoints.filter(ep => {
    const matchesSearch = ep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ep.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? (ep.tags && ep.tags.includes(selectedTag)) : true;
    return matchesSearch && matchesTag;
  });

  // Extract unique tags
  const allTags = Array.from(new Set(endpoints.flatMap(ep => ep.tags || []))).filter(Boolean);

  if (loading) return <PageLoader />;
  if (error) return <ApiError message={error} onRetry={fetchEndpoints} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Monitored Endpoints</h2>
           <p className="text-slate-600 dark:text-slate-400 font-light mt-1">Manage and monitor your API targets.</p>
        </div>
        
        <div className="flex w-full sm:w-auto gap-4">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all cursor-pointer h-full text-sm"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
          
          <button
            onClick={openAddModal}
            className="btn-primary flex items-center gap-2 h-full py-2.5 font-semibold shadow-md"
          >
            <Plus size={18} />
            <span>Add Endpoint</span>
          </button>
        </div>
      </div>

      {/* Endpoints Grid */}
      {filteredEndpoints.length === 0 ? (
        <div className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm dark:shadow-xl">
          <Server className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Endpoints Found</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
            {searchQuery || selectedTag ? "No endpoints match your search criteria." : "Get started by adding your first API target for automated uptime monitoring."}
          </p>
          {!searchQuery && !selectedTag && (
            <button onClick={openAddModal} className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Add Your First Endpoint
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEndpoints.map(endpoint => (
            <motion.div
              key={endpoint.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-sm dark:shadow-xl dark:shadow-black/30 hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                      {endpoint.name}
                    </h3>
                    <a
                      href={endpoint.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 mt-1 truncate max-w-[240px]"
                    >
                      <span className="truncate">{endpoint.url}</span>
                      <ArrowUpRight size={13} className="shrink-0" />
                    </a>
                  </div>
                  <StatusBadge isUp={endpoint.lastStatus !== false} />
                </div>

                {/* Tags */}
                {endpoint.tags && endpoint.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {endpoint.tags.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-mono border border-slate-200 dark:border-slate-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Endpoint Footer Info */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock size={13} /> {endpoint.checkIntervalSeconds || 60}s
                  </span>
                  {endpoint.alertsEnabled && (
                    <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400" title={`Email Alerts Active (${endpoint.alertEmail || 'Account Email'})`}>
                      <Mail size={13} /> Email
                    </span>
                  )}
                  {endpoint.discordWebhookUrl && (
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400" title="Discord Webhook Active">
                      <MessageSquare size={13} /> Discord
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(endpoint)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Endpoint"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(endpoint)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Endpoint"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <EndpointModal 
        isOpen={isAddModalOpen || isEditModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setEditingEndpoint(null); }} 
        onSave={handleSaveEndpoint} 
        initialData={editingEndpoint} 
      />
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setDeletingEndpoint(null); }} 
        onConfirm={handleDeleteEndpoint} 
        title="Delete Monitored Endpoint" 
        message={`Are you sure you want to delete ${deletingEndpoint?.name}? This action cannot be undone.`} 
      />
    </div>
  );
};

export default EndpointsTab;

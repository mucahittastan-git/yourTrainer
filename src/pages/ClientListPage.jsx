import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, UserPlus, Filter, TrendingUp, BarChart3, Star, Target, CheckCircle } from 'lucide-react';
import { getFromLocalStorage } from '../utils/helpers';
import { useToast } from '../utils/ToastContext';
import { useDebounce, usePerformanceMonitor } from '../hooks/usePerformance';
import ClientCard from '../components/client/ClientCard';
import { ClientListSkeleton } from '../components/client/ClientSkeletons';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { deleteClientFromApi } from '../utils/api';

// Memoized Premium Search Input
const SearchInput = memo(({ value, onChange, placeholder, disabled }) => (
  <div className="relative group">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="input-premium pl-12"
    />
  </div>
));

SearchInput.displayName = 'SearchInput';

// Memoized Premium Filter Select
const FilterSelect = memo(({ value, onChange, options, disabled }) => (
  <div className="relative group">
    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="input-premium pl-12 appearance-none cursor-pointer"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

FilterSelect.displayName = 'FilterSelect';

// Main Page Component
const ClientListPage = () => {
  const { toast } = useToast();
  usePerformanceMonitor('ClientListPage');
  
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        const savedClients = getFromLocalStorage('musteriler', []);
        setClients(savedClients);
      } catch (error) {
        toast.error('Müşteri verileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, [toast]);

  const stats = useMemo(() => {
    const now = new Date();
    const active = clients.filter(c => !c.tahmini_bitis_tarihi || new Date(c.tahmini_bitis_tarihi) > now).length;
    return {
      total: clients.length,
      active,
      completed: clients.length - active
    };
  }, [clients]);

  const filteredClients = useMemo(() => {
    let filtered = clients;
    if (debouncedSearchTerm.trim()) {
      const s = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(c => `${c.ad} ${c.soyad}`.toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(c => {
        const isAct = !c.tahmini_bitis_tarihi || new Date(c.tahmini_bitis_tarihi) > now;
        return statusFilter === 'active' ? isAct : !isAct;
      });
    }
    return filtered;
  }, [clients, debouncedSearchTerm, statusFilter]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedClient) return;
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newList = clients.filter(c => c.id !== selectedClient.id);
      setClients(newList);
      localStorage.setItem('musteriler', JSON.stringify(newList));
      await deleteClientFromApi(selectedClient.id);
      
      toast.success(`${selectedClient.ad} ${selectedClient.soyad} silindi.`);
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  }, [selectedClient, clients, toast]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in p-4 lg:p-0 mb-20 md:mb-0">
      
      {/* 👑 Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-widest">
            <Users className="h-3 w-3" />
            <span>Müşteri Portföyü</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-main tracking-tight">
            Müşteri <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">Yönetimi</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
            Tüm kursiyerlerinin ilerlemesini takip et, programlarını yönet ve performanslarını zirveye taşı.
          </p>
        </div>
        
        <Link
          to="/clients/new"
          className="btn-primary btn-magnetic btn-dark-bg inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-lg hover:scale-[1.02] hover:shadow-primary-500/25"
        >
          <UserPlus className="h-5 w-5 text-indigo-200 group-hover:scale-110 transition-transform" />
          <span>Yeni Kayıt</span>
        </Link>
      </div>

      {/* 🔍 Elite Filters Bento */}
      <div className="glass-card rounded-[3rem] overflow-hidden p-8 lg:p-10 border-none shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center">
              <Star className="h-4 w-4 mr-2 text-primary-500" />
              Arama ve Filtreleme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İsim veya soyisim ile ara..."
              />
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'Tüm Durumlar' },
                  { value: 'active', label: 'Aktif Üyeler' },
                  { value: 'completed', label: 'Biten Programlar' }
                ]}
              />
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Portföy Durumu</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600">Toplam Kursiyer</span>
                <span className="text-xl font-black text-main">{stats.total}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                  style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                <div className="flex items-center text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-lg shadow-emerald-500/20" />
                  {stats.active} AKTİF
                </div>
                <div className="flex items-center text-slate-500 border-l border-slate-200 hide-scrollbar pl-4">
                  <div className="w-2 h-2 rounded-full bg-slate-300 mr-2" />
                  {stats.completed} BİTEN
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 👥 Client Grid */}
      {filteredClients.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-20 text-center border-none shadow-2xl">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-black text-main mb-2 tracking-tight">Sonuç Bulunamadı</h3>
          <p className="text-slate-600 font-medium">Arama kriterlerinize uygun kursiyer bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredClients.map((client, i) => (
            <ClientCard
              key={client.id}
              client={client}
              onDeleteClick={(c) => { setSelectedClient(c); setShowDeleteModal(true); }}
              className={`animate-slide-up animate-stagger-${Math.min(i % 4 + 1, 4)}`}
            />
          ))}
        </div>
      )}

      {/* 💎 Footer Stat (Development) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-6 right-6 z-40 glass-card !bg-slate-950 !border-slate-800 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-pulse flex items-center space-x-2">
          <span className="opacity-50">SYS OPTIMIZED</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-primary-400">RENDER OK</span>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        customerName={selectedClient ? `${selectedClient.ad} ${selectedClient.soyad}` : ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default memo(ClientListPage);

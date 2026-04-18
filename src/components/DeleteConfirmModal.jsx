import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  customerName = '', 
  loading = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setConfirmText(''); // Modal açıldığında text'i temizle
    }
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return; // Loading sırasında kapanmasını engelle
    
    setIsVisible(false);
    setTimeout(() => {
      setConfirmText('');
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    if (loading) return;
    onConfirm();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Confirm text kontrolü
  const isConfirmValid = confirmText.toLowerCase() === 'sil';

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-w-md w-full ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Close Button */}
          {!loading && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Warning Icon */}
            <div className="mx-auto mb-6">
              <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-main mb-3 text-center tracking-tight">
              Müşteriyi Sil
            </h3>

            {/* Warning Message */}
            <div className="mb-8">
              <p className="text-slate-600 text-center mb-6 font-medium leading-relaxed">
                <strong className="text-main">{customerName}</strong> adlı müşteriyi silmek istediğinizden emin misiniz?
              </p>
              
              <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="text-[10px] font-black text-red-800 uppercase tracking-widest leading-none">Kritik Uyarı</h4>
                    <div className="text-xs text-red-700/80 mt-3 font-medium space-y-2">
                      <p>Bu işlem portföyünüzden şu verileri kalıcı olarak siler:</p>
                      <ul className="space-y-1">
                        <li>• Kişisel bilgiler ve ölçüm geçmişi</li>
                        <li>• Tüm seans takvimi ve notlar</li>
                        <li>• Finansal ödeme kayıtları</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="mb-8">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">
                Onaylamak için <span className="text-red-600">SİL</span> yazın:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="sil"
                disabled={loading}
                className="input-premium border-red-100 focus:border-red-500 placeholder:opacity-30"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleClose}
                disabled={loading}
                className="btn-ghost flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                İptal
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={!isConfirmValid || loading}
                className="btn-danger flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Siliniyor...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Kalıcı Olarak Sil</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="bg-slate-50/50 px-8 py-4 rounded-b-3xl border-t border-slate-100">
            <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-tighter">
              BU İŞLEM PT ALTYAPISINDAN VERİLERİ KALICI OLARAK KALDIRIR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

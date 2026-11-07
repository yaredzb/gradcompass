import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, HelpCircle, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Move to Trash',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button by default to prevent accidental confirmations
    const timer = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-[420px] bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E6DFD5] dark:border-[#334155] shadow-2xl p-6 sm:p-7 text-center overflow-hidden my-auto transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close 'X' button top-right */}
        <button
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Top Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${
              isDanger
                ? 'bg-rose-50 dark:bg-rose-950/50 text-[#E11D48] dark:text-rose-400 ring-8 ring-rose-50/60 dark:ring-rose-950/30'
                : isWarning
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 ring-8 ring-amber-50/60 dark:ring-amber-950/30'
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 ring-8 ring-blue-50/60 dark:ring-blue-950/30'
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-7 h-7" strokeWidth={2.2} />
            ) : isWarning ? (
              <AlertTriangle className="w-7 h-7" strokeWidth={2.2} />
            ) : (
              <HelpCircle className="w-7 h-7" strokeWidth={2.2} />
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          id="confirm-modal-title"
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display text-center leading-tight tracking-tight"
        >
          {title}
        </h3>

        {/* Message / Description */}
        <div
          id="confirm-modal-description"
          className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed max-w-xs mx-auto break-words"
        >
          {message}
        </div>

        {/* Action Buttons: Cancel and Move to Trash */}
        <div className="mt-6 grid grid-cols-2 gap-3 w-full">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full py-2.5 px-4 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full py-2.5 px-4 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl text-white shadow-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 ${
              isDanger
                ? 'bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239]'
                : isWarning
                ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500'
            }`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

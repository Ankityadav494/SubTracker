const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-stone-700 bg-stone-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-stone-100">{title}</h3>
        <p className="mt-2 text-sm text-stone-400">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-stone-600 px-4 py-2 text-sm text-stone-300 hover:bg-stone-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-sm font-medium text-white hover:from-rose-400 hover:to-rose-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

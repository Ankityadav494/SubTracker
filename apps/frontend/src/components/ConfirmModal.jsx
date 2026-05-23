import { btnPrimaryClass, btnSecondaryClass, cardClass, subheadingClass, mutedClass } from "../utils/styles";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className={`w-full max-w-md ${cardClass}`}>
        <h3 className={subheadingClass}>{title}</h3>
        <p className={`mt-2 text-sm ${mutedClass}`}>{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 ${btnSecondaryClass}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 ${btnPrimaryClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

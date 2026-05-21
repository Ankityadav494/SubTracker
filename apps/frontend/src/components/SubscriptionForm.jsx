import { BILLING_CYCLES, CATEGORIES, STATUSES } from "../utils/constants";
import PlatformNameAutocomplete from "./PlatformNameAutocomplete";
import {
  btnPrimaryClass,
  errorClass,
  inputClass,
  labelClass,
  selectClass,
} from "../utils/styles";

const SubscriptionForm = ({
  form,
  setForm,
  onSubmit,
  loading,
  error,
  submitLabel,
  showHousehold,
  platformAutocomplete = false,
  onPlatformSelect,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {error && <p className={errorClass}>{error}</p>}

    {platformAutocomplete && onPlatformSelect ? (
      <PlatformNameAutocomplete
        value={form.name}
        onChange={(name) => setForm({ ...form, name })}
        onSelectPlatform={onPlatformSelect}
      />
    ) : (
      <div>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="Netflix, Spotify..."
        />
      </div>
    )}

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="price" className={labelClass}>Price (₹)</label>
        <input id="price" type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label htmlFor="cycle" className={labelClass}>Billing cycle</label>
        <select id="cycle" value={form.billingCycle} onChange={(e) => setForm({ ...form, billingCycle: e.target.value })} className={selectClass}>
          {BILLING_CYCLES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="category" className={labelClass}>Category</label>
        <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectClass}>
          <option value="">Select</option>
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="status" className={labelClass}>Status</label>
        <select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>

    <div>
      <label htmlFor="date" className={labelClass}>Next billing date</label>
      <input id="date" type="date" value={form.nextBillingDate} onChange={(e) => setForm({ ...form, nextBillingDate: e.target.value })} className={inputClass} />
    </div>

    <div>
      <label htmlFor="notes" className={labelClass}>Notes (optional)</label>
      <input id="notes" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} placeholder="Family plan, annual deal..." />
    </div>

    {showHousehold && (
      <label className="flex items-center gap-2 text-sm text-stone-400">
        <input type="checkbox" checked={!!form.shareWithHousehold} onChange={(e) => setForm({ ...form, shareWithHousehold: e.target.checked })} className="rounded" />
        Share with household members
      </label>
    )}

    <button type="submit" disabled={loading} className={btnPrimaryClass}>
      {loading ? "Saving..." : submitLabel}
    </button>
  </form>
);

export default SubscriptionForm;

import { CATEGORIES, STATUSES } from "../utils/constants";
import { selectClass } from "../utils/styles";

const SubscriptionFilters = ({ filters, onChange }) => (
  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <input
      type="search"
      placeholder="Search subscriptions..."
      value={filters.search}
      onChange={(e) => onChange({ ...filters, search: e.target.value })}
      className={selectClass}
    />
    <select value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value })} className={selectClass}>
      <option value="">All categories</option>
      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
    <select value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })} className={selectClass}>
      <option value="">All statuses</option>
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <select value={filters.sort} onChange={(e) => onChange({ ...filters, sort: e.target.value })} className={selectClass}>
      <option value="date">Renewal date ↑</option>
      <option value="-date">Renewal date ↓</option>
      <option value="price">Price ↑</option>
      <option value="-price">Price ↓</option>
    </select>
  </div>
);

export default SubscriptionFilters;

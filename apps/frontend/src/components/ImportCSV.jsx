import { useRef } from "react";
import toast from "react-hot-toast";
import { importSubscriptions } from "../services/subscriptionService";

const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  const headers = lines[0].toLowerCase().split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i]?.trim();
    });
    return {
      name: row.name,
      price: Number(row.price),
      billingCycle: row.billingcycle || row.billing_cycle || "monthly",
      category: row.category,
      status: row.status || "active",
      nextBillingDate: row.nextbillingdate || row.next_billing_date,
      notes: row.notes || "",
    };
  }).filter((r) => r.name && r.price);
};

const ImportCSV = ({ onImported }) => {
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      const rows = parseCSV(text);
      const result = await importSubscriptions(rows);
      toast.success(`Imported ${result.imported} subscription(s)`);
      onImported?.();
    } catch {
      toast.error("Import failed — check CSV format");
    }
    e.target.value = "";
  };

  return (
    <>
      <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border border-stone-600 px-4 py-2 text-sm text-stone-300 hover:border-orange-500/50 hover:text-orange-200"
      >
        Import CSV
      </button>
    </>
  );
};

export default ImportCSV;

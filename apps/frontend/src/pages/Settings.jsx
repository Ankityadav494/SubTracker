import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import { getSettings, updateSettings, changePassword } from "../services/usersService";
import { exportSubscriptions } from "../services/subscriptionService";
import {
  btnPrimaryClass,
  cardClass,
  headingClass,
  inputClass,
  labelClass,
  pageClass,
} from "../utils/styles";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => toast.error("Failed to load settings"));
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await updateSettings(settings);
      setSettings(updated);
      toast.success("Settings saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordForm);
      toast.success("Password updated");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  const handleExport = async () => {
    const blob = await exportSubscriptions();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtracker-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded");
  };

  if (!settings) return null;

  return (
    <Layout>
      <Navbar />
      <main className={`${pageClass} max-w-2xl`}>
        <h1 className={`mb-8 text-left ${headingClass}`}>Settings</h1>

        <form onSubmit={saveSettings} className={`mb-8 ${cardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">Profile & budget</h2>
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Monthly budget (₹)</label>
            <input
              type="number"
              className={inputClass}
              placeholder="Optional"
              value={settings.monthlyBudget ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  monthlyBudget: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Remind me (days before renewal)</label>
            <input
              type="number"
              min="1"
              max="30"
              className={inputClass}
              value={settings.reminderDaysBefore}
              onChange={(e) =>
                setSettings({ ...settings, reminderDaysBefore: Number(e.target.value) })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={settings.emailRemindersEnabled}
              onChange={(e) =>
                setSettings({ ...settings, emailRemindersEnabled: e.target.checked })
              }
            />
            Email renewal reminders
          </label>
          <button type="submit" disabled={loading} className={btnPrimaryClass}>
            Save settings
          </button>
        </form>

        <form onSubmit={savePassword} className={`mb-8 ${cardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">Change password</h2>
          <input
            type="password"
            placeholder="Current password"
            className={inputClass}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
          <input
            type="password"
            placeholder="New password"
            className={inputClass}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <button type="submit" className={btnPrimaryClass}>
            Update password
          </button>
        </form>

        <div className={cardClass}>
          <h2 className="mb-3 text-lg font-semibold text-white">Data</h2>
          <button type="button" onClick={handleExport} className="rounded-xl border border-stone-600 px-4 py-2 text-sm text-stone-300 hover:border-orange-500/50 hover:text-orange-200">
            Export subscriptions (CSV)
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default Settings;

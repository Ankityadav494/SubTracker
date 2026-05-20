import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import { getHousehold, createHousehold, inviteMember } from "../services/householdService";
import { btnPrimaryClass, cardClass, headingClass, inputClass, labelClass, pageClass } from "../utils/styles";

const Household = () => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => getHousehold().then(setData).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createHousehold(name);
      toast.success("Household created");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await inviteMember(inviteEmail);
      toast.success("Invite sent");
      setInviteEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invite failed");
    }
  };

  const household = data?.household;

  return (
    <Layout>
      <Navbar />
      <main className={`${pageClass} max-w-2xl`}>
        <h1 className={`mb-6 text-left ${headingClass}`}>Household</h1>
        <p className="mb-6 text-left text-slate-400">
          Share subscriptions with family or roommates.{" "}
          <Link to="/settings" className="text-orange-400 hover:text-amber-300">Settings</Link>
        </p>

        {!household ? (
          <form onSubmit={handleCreate} className={`${cardClass} space-y-4`}>
            <p className="text-sm text-slate-400">Create a household to share subscription visibility.</p>
            <div>
              <label className={labelClass}>Household name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="My Family" required />
            </div>
            <button type="submit" disabled={loading} className={btnPrimaryClass}>
              Create household
            </button>
          </form>
        ) : (
          <div className={`${cardClass} space-y-6`}>
            <div>
              <h2 className="text-xl font-semibold text-white">{household.name}</h2>
              <p className="text-sm text-slate-500">Owner: {household.owner?.name}</p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-slate-300">Members</h3>
              <ul className="space-y-1 text-sm text-slate-400">
                {household.members?.map((m) => (
                  <li key={m._id}>{m.name} — {m.email}</li>
                ))}
              </ul>
            </div>
            <form onSubmit={handleInvite} className="space-y-3 border-t border-slate-800 pt-4">
              <label className={labelClass}>Invite by email</label>
              <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className={inputClass} required />
              <button type="submit" className={btnPrimaryClass}>
                Send invite
              </button>
            </form>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Household;

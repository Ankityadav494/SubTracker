import { formatDate } from "../utils/dateUtils";

const SubscriptionCard = ({ sub, onDelete }) => {
  return (
    <div style={styles.card}>
      <h3>{sub.name}</h3>
      <p><strong>Price:</strong> ₹{sub.price}</p>
      <p><strong>Category:</strong> {sub.category}</p>
      <p><strong>Next Billing:</strong> {formatDate(sub.nextBillingDate)}</p>

      <button onClick={() => onDelete(sub._id)} style={styles.deleteBtn}>
        Delete
      </button>
    </div>
  );
};

export default SubscriptionCard;

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    margin: "10px",
    width: "250px",
    background: "#fff",
  },
  deleteBtn: {
    marginTop: "10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },
};
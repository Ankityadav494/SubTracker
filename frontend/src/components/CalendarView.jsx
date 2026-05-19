const CalendarView = ({ subscriptions }) => {
  return (
    <div>
      <h3>Upcoming Renewals</h3>

      <ul>
        {subscriptions.map((sub) => (
          <li key={sub._id}>
            {sub.name} → {new Date(sub.nextBillingDate).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;

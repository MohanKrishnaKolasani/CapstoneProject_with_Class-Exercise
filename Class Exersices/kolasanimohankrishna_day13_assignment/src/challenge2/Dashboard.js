import React, { useState } from "react";
import StatsCard from "./StatsCard";

function Dashboard() {
  const [users, setUsers] = useState(100);
  const [sales] = useState(200);

  const [usersTime, setUsersTime] = useState(
    new Date().toLocaleTimeString()
  );

  const [salesTime] = useState(
    new Date().toLocaleTimeString()
  );

  const handleUpdate = () => {
    setUsers(users + 1);
    setUsersTime(new Date().toLocaleTimeString());
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={handleUpdate}>
        Simulate Update (Users Only)
      </button>

      <StatsCard
        title="Users"
        value={users}
        lastUpdated={usersTime}
      />

      <StatsCard
        title="Sales"
        value={sales}
        lastUpdated={salesTime}
      />
    </div>
  );
}

export default Dashboard;
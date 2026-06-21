import { useEffect, useState } from "react";
import { passwordAPI } from "../services/api";
import type { PasswordItem } from "../types/index"; 

function Dashboard() {
  const [passwords, setpasswords] = useState<PasswordItem[]>([]);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const data = await passwordAPI.getAll();
        console.log("Got the password")
        setpasswords(data.passwords);
      } catch (err) {
        console.error("Error in get password", err);
      }
    }
    fetchPassword();
  }, []);
  return (
    <div>
      {passwords.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded shadow mb-3" >
          <p className="text">
            {p.website}
          </p>
          <p className="text">
            {p.username}
          </p>
        </div >
      )
      )}
    </div>
  );
}

export default Dashboard;
// components/Finance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Finance.css"; // Import Finance component CSS

const Finance = () => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const response = await axios.get("http://localhost:3001/finance");
        setTotalAmount(response.data.total_amount);
      } catch (error) {
        console.error("Error fetching total amount:", error);
      }
    };

    fetchTotalAmount();
  }, []);

  return (
    <div className="finance-container">
      <br />
      <br />
      <br />
      <br />
      <h1 className="finance-title">Total Revenue</h1>
      <p className="finance-amount">₹{totalAmount}</p>
    </div>
  );
};

export default Finance;

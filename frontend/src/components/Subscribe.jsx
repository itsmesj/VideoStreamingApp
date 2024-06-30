import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Subscribe.css";

const Subscribe = ({ email }) => {
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMade, setPaymentMade] = useState(false);
  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    setShowPricing(!showPricing);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    handlePayment();
  };

  const handlePayment = () => {
    // Simulate payment process
    setPaymentMade(true);
  };

  const handleConfirmSubscription = async () => {
    const amount = selectedPlan === 30 ? 399 : 2599;
    try {
      await axios.post("http://localhost:3001/subscribe", {
        email,
        plan: selectedPlan,
        amount,
      });
      alert("Subscription successful! Redirecting you to the login...");
      navigate("/");
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="subscribe-container" style={{ textAlign: "center" }}>
      <h2>Upgrade to Premium</h2>
      <p>Enjoy unlimited access to premium videos</p>
      {!paymentMade ? (
        <>
          <button onClick={handleSubscribeClick} className="btn-toggle-pricing">
            Subscribe to go Premium
          </button>
          {showPricing && (
            <div className="pricing-info">
              <div className="card">
                <h3>Monthly Plan</h3>
                <p>₹399 per month</p>
                <button
                  className="btn btn-primary btn-subscribe"
                  onClick={() => handlePlanSelect(30)}
                >
                  Subscribe Monthly
                </button>
              </div>
              <div className="card">
                <h3>Yearly Plan</h3>
                <p>₹2599 per year</p>
                <button
                  className="btn btn-primary btn-subscribe"
                  onClick={() => handlePlanSelect(365)}
                >
                  Subscribe Yearly
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="payment-confirmation">
          <p>Payment made successfully!</p>
          <button onClick={handleConfirmSubscription} className="btn-primary">
            Confirm Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscribe;

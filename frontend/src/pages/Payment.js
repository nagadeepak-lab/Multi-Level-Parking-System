/**
 * Payment.js
 *
 * Payment Processing Page
 * Handles payment for vehicle exit fees
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import '../styles/Payment.css';
import { AlertCircle, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Get data from navigation state
  const exitData = location.state?.exitData;

  useEffect(() => {
    if (!exitData) {
      // If no exit data, redirect back to exit page
      navigate('/exit');
    }
  }, [exitData, navigate]);

  if (!exitData) {
    return null;
  }

  const parsedParkingFee = Number(String(exitData.parkingFee).replace(/[^0-9.]/g, ''));
  const formattedParkingFee = !Number.isNaN(parsedParkingFee) ? `₹${parsedParkingFee.toFixed(2)}` : exitData.parkingFee;

  const handlePaymentCompleted = () => {
    setPaymentCompleted(true);
    // Could add logic to update payment status in backend
  };

  const handleBackToExit = () => {
    navigate('/exit');
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <button
          className="back-button"
          onClick={handleBackToExit}
          type="button"
        >
          <ArrowLeft size={20} />
          Back to Exit
        </button>
        <h1>💳 Payment Processing</h1>
        <p>Complete your parking payment</p>
      </div>

      <div className="payment-content">
        {!paymentCompleted ? (
          <Card title="📱 PhonePe Payment" icon="💳">
            <div className="payment-section">
              <div className="payment-info">
                <h3>Payment Details</h3>
                <div className="payment-details">
                  <div className="payment-item">
                    <span className="label">Vehicle Number</span>
                    <span className="value">{exitData.vehicleNumber}</span>
                  </div>
                  <div className="payment-item">
                    <span className="label">Vehicle Type</span>
                    <span className="value">{exitData.vehicleType?.toUpperCase()}</span>
                  </div>
                  <div className="payment-item">
                    <span className="label">Parking Duration</span>
                    <span className="value">{exitData.parkingDuration}</span>
                  </div>
                  <div className="payment-item">
                    <span className="label">Amount Due</span>
                    <span className="value amount">{formattedParkingFee}</span>
                  </div>
                  <div className="payment-item">
                    <span className="label">Payee</span>
                    <span className="value">B BHARATH KUMAR</span>
                  </div>
                  <div className="payment-item">
                    <span className="label">Payment Method</span>
                    <span className="value">PhonePe QR</span>
                  </div>
                </div>
              </div>

              <div className="qr-section">
                <h4>Scan & Pay Using PhonePe App</h4>
                <div className="qr-container">
                  <QRCodeCanvas
                    value={`upi://pay?pa=9063780517@ybl&pn=B%20BHARATH%20KUMAR&am=${parsedParkingFee.toFixed(2)}&cu=INR&tn=ParkingFee_${exitData.vehicleNumber}`}
                    size={260}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-instruction">
                  Open PhonePe app, scan the QR code, and complete the payment.
                </p>
                <button
                  className="payment-done-btn"
                  type="button"
                  onClick={handlePaymentCompleted}
                >
                  ✓ I've Completed the Payment
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <Card title="✅ Payment Successful" icon="🎉">
            <div className="payment-success">
              <CheckCircle size={64} className="success-icon" />
              <h3>Thank You for Your Payment!</h3>
              <div className="success-details">
                <div className="success-item">
                  <span className="label">Vehicle Number:</span>
                  <span className="value">{exitData.vehicleNumber}</span>
                </div>
                <div className="success-item">
                  <span className="label">Amount Paid:</span>
                  <span className="value amount">{formattedParkingFee}</span>
                </div>
                <div className="success-item">
                  <span className="label">Transaction ID:</span>
                  <span className="value">PP{Date.now()}</span>
                </div>
              </div>
              <p className="success-message">
                Your vehicle has been successfully exited from the parking system.
                Safe travels!
              </p>
              <button
                className="back-to-dashboard-btn"
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                Return to Dashboard
              </button>
            </div>
          </Card>
        )}

        {/* Pricing Information */}
        <Card title="ℹ️ Parking Rates" icon="💰">
          <div className="pricing-info">
            <h3>Current Pricing Structure</h3>
            <div className="pricing-table">
              <div className="pricing-row">
                <span>🏍️ Bike</span>
                <span>₹100/hour</span>
              </div>
              <div className="pricing-row">
                <span>🚗 Car</span>
                <span>₹150/hour</span>
              </div>
              <div className="pricing-row">
                <span>🚚 Truck</span>
                <span>₹200/hour</span>
              </div>
            </div>
            <p className="pricing-note">
              <AlertCircle size={16} />
              Fees are calculated based on actual parking duration and rounded up to the next hour.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
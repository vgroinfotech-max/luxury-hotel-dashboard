import { useState } from "react";
import "../styles/rules.css";

export default function Rules() {
  const [rules, setRules] = useState({
    gstEnabled: true,
    cgst: 6,
    sgst: 6,

    discountEnabled: true,
    discountType: "percentage",
    discountValue: 10,
    discountMinBooking: 2000,

    couponEnabled: true,
    couponType: "percentage",
    couponValue: 10,
    maxCouponDiscount: 500,
    couponMinBooking: 2500,

    referralEnabled: true,
    referrerReward: 300,
    refereeReward: 200,
    referralMinBooking: 3000,

    checkInTime: "14:00",
    checkOutTime: "11:00",

    advancePaymentPercent: 30,
    payAtHotelAllowed: true,
    freeCancellationHours: 24,
cancellationFeeType: "percentage",
cancellationFeeValue: 10,
refundType: "partial",
cancellationGracePeriod: 0,

  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRules({
      ...rules,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const totalGST = Number(rules.cgst) + Number(rules.sgst);

  return (
    <div className="rules-container">
      <h1>Rules Page</h1>
      

      {/* ================= TAX RULES ================= */}
      <section className="rule-card">
        <h3>Tax & GST Rules</h3>
      

        <div className="grid-3">
          <div className="field">
            <label>CGST (%)</label>
            <input
              type="number"
              name="cgst"
              value={rules.cgst}
              onChange={handleChange}
            />
            
          </div>

          <div className="field">
            <label>SGST (%)</label>
            <input
              type="number"
              name="sgst"
              value={rules.sgst}
              onChange={handleChange}
            />
            
          </div>

          <div className="field">
            <label>Total GST</label>
            <input value={`${totalGST}%`} disabled />
           
          </div>
        </div>

        <label className="toggle">
          <input
            type="checkbox"
            name="gstEnabled"
            checked={rules.gstEnabled}
            onChange={handleChange}
          />
          Enable GST on bookings
        </label>
      </section>

      {/* ================= DISCOUNT RULES ================= */}
      <section className="rule-card">
        <h3>Discount Rules</h3>
       
        <div className="grid-3">
          <div className="field">
            <label>Discount Type</label>
            <select
              name="discountType"
              value={rules.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          <div className="field">
            <label>Discount Value</label>
            <input
              type="number"
              name="discountValue"
              value={rules.discountValue}
              onChange={handleChange}
            />
            <small>Depends on selected type</small>
          </div>

          <div className="field">
            <label>Minimum Booking Amount (₹)</label>
            <input
              type="number"
              name="discountMinBooking"
              value={rules.discountMinBooking}
              onChange={handleChange}
            />
            <small>Discount applies above this amount</small>
          </div>
        </div>
      </section>

      {/* ================= COUPON RULES ================= */}
      <section className="rule-card">
        <h3>Coupon Rules</h3>
       
        <div className="grid-3">
          <div className="field">
            <label>Coupon Type</label>
            <select
              name="couponType"
              value={rules.couponType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          <div className="field">
            <label>Coupon Value</label>
            <input
              type="number"
              name="couponValue"
              value={rules.couponValue}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Max Discount Limit (₹)</label>
            <input
              type="number"
              name="maxCouponDiscount"
              value={rules.maxCouponDiscount}
              onChange={handleChange}
            />
            <small>Maximum discount allowed</small>
          </div>
        </div>

        <div className="grid-3">
          <div className="field">
            <label>Minimum Booking Amount (₹)</label>
            <input
              type="number"
              name="couponMinBooking"
              value={rules.couponMinBooking}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* ================= REFERRAL RULES ================= */}
      <section className="rule-card">
        <h3>Referral Rules</h3>
      

        <div className="grid-3">
          <div className="field">
            <label>Referrer Reward (₹)</label>
            <input
              type="number"
              name="referrerReward"
              value={rules.referrerReward}
              onChange={handleChange}
            />
            <small>Existing user benefit</small>
          </div>

          <div className="field">
            <label>New User Reward (₹)</label>
            <input
              type="number"
              name="refereeReward"
              value={rules.refereeReward}
              onChange={handleChange}
            />
            <small>New guest benefit</small>
          </div>

          <div className="field">
            <label>Minimum Booking Amount (₹)</label>
            <input
              type="number"
              name="referralMinBooking"
              value={rules.referralMinBooking}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* ================= CHECK-IN / CHECK-OUT ================= */}
      <section className="rule-card">
        <h3>Check-In & Check-Out Rules</h3>
     

        <div className="grid-3">
          <div className="field">
            <label>Check-In Time</label>
            <input
              type="time"
              name="checkInTime"
              value={rules.checkInTime}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Check-Out Time</label>
            <input
              type="time"
              name="checkOutTime"
              value={rules.checkOutTime}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* ================= PAYMENT RULES ================= */}
      <section className="rule-card">
        <h3>Payment Rules</h3>
        

        <div className="grid-3">
          <div className="field">
            <label>Advance Payment (%)</label>
            <input
              type="number"
              name="advancePaymentPercent"
              value={rules.advancePaymentPercent}
              onChange={handleChange}
            />
          </div>
        </div>

        <label className="toggle">
          <input
            type="checkbox"
            name="payAtHotelAllowed"
            checked={rules.payAtHotelAllowed}
            onChange={handleChange}
          />
          Allow Pay at Hotel
        </label>
      </section>
       <section className="rule-card">
        <h3>Notification Rules</h3>
       

        <div className="grid-3">
          <label className="toggle">
            <input
              type="checkbox"
              name="emailNotification"
              checked={rules.emailNotification}
              onChange={handleChange}
            />
            Email Notifications
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              name="smsNotification"
              checked={rules.smsNotification}
              onChange={handleChange}
            />
            SMS Notifications
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              name="whatsappNotification"
              checked={rules.whatsappNotification}
              onChange={handleChange}
            />
            WhatsApp Notifications
          </label>
        </div>

        <hr />

        <div className="grid-3">
          <label className="toggle">
            <input
              type="checkbox"
              name="bookingConfirmationNotify"
              checked={rules.bookingConfirmationNotify}
              onChange={handleChange}
            />
            Booking Confirmation
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              name="checkInNotify"
              checked={rules.checkInNotify}
              onChange={handleChange}
            />
            Check-In Reminder
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              name="cancellationNotify"
              checked={rules.cancellationNotify}
              onChange={handleChange}
            />
            Cancellation Alert
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              name="paymentNotify"
              checked={rules.paymentNotify}
              onChange={handleChange}
            />
            Payment Confirmation
          </label>
        </div>
      </section>
{/* ================= CANCELLATION POLICY ================= */}
<section className="rule-card">
  <h3>Cancellation Policy</h3>
  

  <div className="grid-3">
    <div className="field">
      <label>Free Cancellation Period (hours)</label>
      <input
        type="number"
        name="freeCancellationHours"
        value={rules.freeCancellationHours || 24}
        onChange={handleChange}
      />
      <small>Number of hours before check-in for free cancellation</small>
    </div>

    <div className="field">
      <label>Cancellation Fee Type</label>
      <select
        name="cancellationFeeType"
        value={rules.cancellationFeeType || "percentage"}
        onChange={handleChange}
      >
        <option value="percentage">Percentage (%)</option>
        <option value="flat">Flat Amount (₹)</option>
      </select>
      <small>Choose fee calculation method</small>
    </div>

    <div className="field">
      <label>Cancellation Fee Value</label>
      <input
        type="number"
        name="cancellationFeeValue"
        value={rules.cancellationFeeValue || 10}
        onChange={handleChange}
      />
      <small>Percentage or flat amount based on type</small>
    </div>
  </div>

  <div className="grid-2">
    <div className="field">
      <label>Refund Type</label>
      <select
        name="refundType"
        value={rules.refundType || "partial"}
        onChange={handleChange}
      >
        <option value="full">Full Refund</option>
        <option value="partial">Partial Refund</option>
        <option value="non-refundable">Non-Refundable</option>
      </select>
      <small>Refund applied after deduction of cancellation fees</small>
    </div>

    <div className="field">
      <label>Grace Period (hours)</label>
      <input
        type="number"
        name="cancellationGracePeriod"
        value={rules.cancellationGracePeriod || 0}
        onChange={handleChange}
      />
      <small>Optional period after booking to cancel without fee</small>
    </div>
  </div>
</section>

      <button className="save-btn">Save All Rules</button>
    </div>
  );
}

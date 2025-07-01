import React, { useState, useEffect } from "react";
import { rateTable } from "./rateTable";

const styles = {
  card: {
    maxWidth: 700,
    background: "#fff",
    padding: 32,
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    margin: "32px auto",
  },
  section: {
    display: "flex",
    gap: 48,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 600,
    marginRight: 8,
    display: "inline-block",
    minWidth: 80,
    fontSize: 14,
  },
  input: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    width: 160,
    marginRight: 12,
  },
  numberInput: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    width: 80,
    marginRight: 12,
    WebkitAppearance: "none",
    MozAppearance: "textfield",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 16,
  },
  th: {
    background: "#f3f3f3",
    fontWeight: 700,
    padding: 8,
    border: "1px solid #e0e0e0",
  },
  td: {
    padding: 8,
    border: "1px solid #e0e0e0",
    textAlign: "center",
  },
  totals: {
    marginTop: 24,
    fontWeight: 600,
    fontSize: 18,
    textAlign: "right",
  },
  caseBox: {
    margin: "16px 0 8px 0",
    padding: "8px 16px",
    background: "#e8f0fe",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 18,
    display: "inline-block",
  },
};

const dayTypes = ["Workday", "Rest Day"];
const rules = ["applicable_hours", "full_shift"];
const holidays = ["None", "Special", "Regular"];

// Add a rule variable for easy management
const rulesConfig = {
  endDayHolidayFollowsStart: (rule) => rule === 'full_shift',
};

export default function Calculator() {
  // Form state
  const [startDayType, setStartDayType] = useState("Workday");
  const [rule, setRule] = useState("applicable_hours");
  const [startHoliday, setStartHoliday] = useState("None");
  const [endHoliday, setEndHoliday] = useState("None");
  const [hourlyRate, setHourlyRate] = useState(0);
  // Adjustable hours
  const [startHours, setStartHours] = useState({ HOL: 0, NSD: 0, OT: 0 });
  const [endHours, setEndHours] = useState({ HOL: 0, NSD: 0, OT: 0 });

  // End day type automatically follows start day type
  const endDayType = startDayType;

  // Find the matching rate entry
  const rateEntry = rateTable.find(
    (row) =>
      row.startDayType === startDayType &&
      row.rule === rule &&
      row.startHoliday === startHoliday &&
      row.endDayType === endDayType &&
      row.endHoliday === endHoliday
  );

  // Calculate totals using the specified formulas
  let startDayTotal = 0,
    endDayTotal = 0;
  if (rateEntry) {
    const startRateTotal = 
      (rateEntry.startRates.HOL * startHours.HOL) + 
      (rateEntry.startRates.NSD * startHours.NSD) + 
      (rateEntry.startRates.OT * startHours.OT);
    
    const endRateTotal = 
      (rateEntry.endRates.HOL * endHours.HOL) + 
      (rateEntry.endRates.NSD * endHours.NSD) + 
      (rateEntry.endRates.OT * endHours.OT);
    
    startDayTotal = hourlyRate * startRateTotal;
    endDayTotal = hourlyRate * endRateTotal;
  }

  // Helper to render number inputs for hours
  function HoursInput({ label, value, onChange }) {
    return (
      <div style={{ ...styles.formGroup, display: "inline-block" }}>
        <span style={{ ...styles.label, fontSize: 12, color: "#666" }}>{label}:</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ ...styles.numberInput, fontSize: 12, color: "#666" }}
        />
      </div>
    );
  }

  // When the rule is 'full_shift', always set endHoliday to startHoliday
  useEffect(() => {
    if (rulesConfig.endDayHolidayFollowsStart(rule)) {
      setEndHoliday(startHoliday);
    }
  }, [rule, startHoliday]);

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>Rate Calculator</h2>
        <div style={styles.formGroup}>
          <span style={styles.label}>Hourly Rate:</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            style={styles.numberInput}
          />
        </div>
      </div>
      <div style={styles.section}>
        <div>
          <h4 style={{ textDecoration: 'underline' }}>Start Day (sd)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
              <span style={{ ...styles.label, minWidth: 120 }}>Day Type:</span>
              <select
                value={startDayType}
                onChange={(e) => setStartDayType(e.target.value)}
                style={{ ...styles.input, background: "#e8f0fe", border: "1px solid #cce7ff", fontWeight: "bold" }}
              >
                {dayTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
              <span style={{ ...styles.label, minWidth: 120 }}>Toppings Rule:</span>
              <select
                value={rule}
                onChange={(e) => setRule(e.target.value)}
                style={{ ...styles.input, background: "#e8f0fe", border: "1px solid #cce7ff", fontWeight: "bold" }}
              >
                {rules.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <h4 style={{ paddingLeft: 35, textDecoration: 'underline' }}>End Day (ed)</h4>
          <div style={styles.formGroup}>
            <span style={{ ...styles.label, paddingLeft: 35 }}>Day Type:</span>
            <div style={{ 
              ...styles.input, 
              background: "transparent", 
              border: "none",
              color: "#666",
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 6,
              width: 160,
              marginRight: 12,
              fontWeight: "bold",
              fontSize: "13px"
            }}>
              {endDayType}
            </div>
          </div>
        </div>
      </div>
      {/* Holiday Row */}
      <div style={{ display: 'flex', gap: 120, alignItems: 'flex-start', marginBottom: 8 }}>
        {/* Start Day Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, minWidth: 90 }}>Holiday:</span>
            <select
              value={startHoliday}
              onChange={(e) => setStartHoliday(e.target.value)}
              style={styles.input}
            >
              {holidays.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, color: '#666', minWidth: 1 }}>worked hrs:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={startHours.HOL}
              onChange={(e) => setStartHours((h) => ({ ...h, HOL: Number(e.target.value) }))}
              style={{ ...styles.numberInput, fontSize: 12, color: '#666' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, color: '#666', minWidth: 1 }}>NSD hrs:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={startHours.NSD}
              onChange={(e) => setStartHours((h) => ({ ...h, NSD: Number(e.target.value) }))}
              style={{ ...styles.numberInput, fontSize: 12, color: '#666' }}
            />
            <span style={{ marginLeft: 12, fontSize: 11, color: '#888', background: '#f3f3f3', borderRadius: 4, padding: '2px 8px' }}>{startHoliday}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, color: '#d0d0d0', minWidth: 1 }}>OT hrs:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={startHours.OT}
              onChange={(e) => setStartHours((h) => ({ ...h, OT: Number(e.target.value) }))}
              style={{ ...styles.numberInput, fontSize: 12, color: '#d0d0d0', background: '#f5f5f5' }}
            />
            <span style={{ marginLeft: 12, fontSize: 11, color: '#888', background: '#f3f3f3', borderRadius: 4, padding: '2px 8px' }}>{startHoliday}</span>
          </div>
        </div>
        {/* End Day Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, minWidth: 90 }}>Holiday:</span>
            {rulesConfig.endDayHolidayFollowsStart(rule) ? (
              <span style={{ ...styles.input, background: 'transparent', border: 'none', color: '#666', fontWeight: 'bold', fontSize: 14, padding: '6px 10px' }}>{startHoliday}</span>
            ) : (
              <select
                value={endHoliday}
                onChange={(e) => setEndHoliday(e.target.value)}
                style={styles.input}
              >
                {holidays.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, color: '#666', minWidth: 1 }}>worked hrs:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={endHours.HOL}
              onChange={(e) => setEndHours((h) => ({ ...h, HOL: Number(e.target.value) }))}
              style={{ ...styles.numberInput, fontSize: 12, color: '#666' }}
            />
            <span style={{ 
              display: 'inline-block', 
              padding: '6px 10px', 
              borderRadius: 6, 
              background: 'transparent',
              color: '#4da3ff',
              fontWeight: 'bold',
              fontSize: 12,
              minWidth: 60,
              textAlign: 'center',
              marginLeft: 12,
              border: 'none'
            }}>
              {(startHours.HOL + endHours.HOL).toFixed(2)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, color: '#666', minWidth: 1 }}>NSD hrs:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={endHours.NSD}
              onChange={(e) => setEndHours((h) => ({ ...h, NSD: Number(e.target.value) }))}
              style={{ ...styles.numberInput, fontSize: 12, color: '#666' }}
            />
            <span style={{ marginLeft: 12, fontSize: 11, color: '#888', background: '#f3f3f3', borderRadius: 4, padding: '2px 8px' }}>{endHoliday}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...styles.label, color: '#666', minWidth: 1 }}>OT hrs:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={endHours.OT}
              onChange={(e) => setEndHours((h) => ({ ...h, OT: Number(e.target.value) }))}
              style={{ ...styles.numberInput, fontSize: 12, color: '#666' }}
            />
            <span style={{ marginLeft: 12, fontSize: 11, color: '#888', background: '#f3f3f3', borderRadius: 4, padding: '2px 8px' }}>{endHoliday}</span>
          </div>
        </div>
      </div>
      <hr style={{ margin: "24px 0" }} />
      {rateEntry ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={styles.caseBox}>
              New Settings Code: <span>{rateEntry.newSettingsCode}</span>
            </div>
            <div style={{ 
              background: "#f8f9fa", 
              padding: "12px 16px", 
              borderRadius: 8, 
              border: "1px solid #e9ecef",
              fontSize: 14,
              minWidth: 200
            }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>New Settings Code Legend:</div>
              <div>a1 - Workday, applicable_hours</div>
              <div>a2 - Workday, full_shift</div>
              <div>b1 - Rest day, applicable_hours</div>
              <div>b2 - Rest day, full_shift</div>
            </div>
          </div>
          <h4>Rates & Calculated Pay</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}></th>
                <th style={styles.th}>HOL</th>
                <th style={styles.th}>NSD</th>
                <th style={styles.th}>OT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>sd_rate</td>
                <td style={styles.td}>{rateEntry.startRates.HOL}</td>
                <td style={styles.td}>{rateEntry.startRates.NSD}</td>
                <td style={styles.td}>{rateEntry.startRates.OT}</td>
              </tr>
              <tr>
                <td style={styles.td}>sd_wrk_hrs</td>
                <td style={styles.td}>{startHours.HOL} hrs</td>
                <td style={styles.td}>{startHours.NSD} hrs</td>
                <td style={styles.td}>{startHours.OT} hrs</td>
              </tr>
              <tr>
                <td style={styles.td}>sd_prem_pay</td>
                <td style={styles.td}>{`₱${(rateEntry.startRates.HOL * startHours.HOL * hourlyRate).toFixed(2)}`}</td>
                <td style={styles.td}>{`₱${(rateEntry.startRates.NSD * startHours.NSD * hourlyRate).toFixed(2)}`}</td>
                <td style={styles.td}>{`₱${(rateEntry.startRates.OT * startHours.OT * hourlyRate).toFixed(2)}`}</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, background: "#e8f0fe", fontWeight: "bold", textAlign: "right" }}>sd_Total</td>
                <td style={{ ...styles.td, background: "#e8f0fe", fontWeight: "bold", textAlign: "right" }} colSpan="3">
                  {`₱${startDayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </td>
              </tr>
              <tr>
                <td style={styles.td}>ed_rate</td>
                <td style={styles.td}>{rateEntry.endRates.HOL}</td>
                <td style={styles.td}>{rateEntry.endRates.NSD}</td>
                <td style={styles.td}>{rateEntry.endRates.OT}</td>
              </tr>
              <tr>
                <td style={styles.td}>ed_wrk_hrs</td>
                <td style={styles.td}>{endHours.HOL} hrs</td>
                <td style={styles.td}>{endHours.NSD} hrs</td>
                <td style={styles.td}>{endHours.OT} hrs</td>
              </tr>
              <tr>
                <td style={styles.td}>ed_prem_pay</td>
                <td style={styles.td}>{`₱${(rateEntry.endRates.HOL * endHours.HOL * hourlyRate).toFixed(2)}`}</td>
                <td style={styles.td}>{`₱${(rateEntry.endRates.NSD * endHours.NSD * hourlyRate).toFixed(2)}`}</td>
                <td style={styles.td}>{`₱${(rateEntry.endRates.OT * endHours.OT * hourlyRate).toFixed(2)}`}</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, background: "#e8f0fe", fontWeight: "bold", textAlign: "right" }}>ed_Total</td>
                <td style={{ ...styles.td, background: "#e8f0fe", fontWeight: "bold", textAlign: "right" }} colSpan="3">
                  {`₱${endDayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: "red", marginTop: 16 }}>
          No matching rate found for the selected combination.
        </div>
      )}
    </div>
  );
}

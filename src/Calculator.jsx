import React, { useState } from "react";
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
  },
  input: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    width: 70,
    marginRight: 12,
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
};

const dayTypes = ["Workday", "Rest Day"];
const rules = ["applicable_hours", "full_shift"];
const holidays = ["None", "Special", "Regular"];

export default function Calculator() {
  // Form state
  const [startDayType, setStartDayType] = useState("Workday");
  const [rule, setRule] = useState("applicable_hours");
  const [startHoliday, setStartHoliday] = useState("None");
  const [endDayType, setEndDayType] = useState("Workday");
  const [endHoliday, setEndHoliday] = useState("None");
  // Adjustable hours
  const [startHours, setStartHours] = useState({ HOL: 0, NSD: 0, OT: 0 });
  const [endHours, setEndHours] = useState({ HOL: 0, NSD: 0, OT: 0 });

  // Find the matching rate entry
  const rateEntry = rateTable.find(
    (row) =>
      row.startDayType === startDayType &&
      row.rule === rule &&
      row.startHoliday === startHoliday &&
      row.endDayType === endDayType &&
      row.endHoliday === endHoliday
  );

  // Helper to render number inputs for hours
  function HoursInput({ label, value, onChange }) {
    return (
      <span style={styles.formGroup}>
        <span style={styles.label}>{label}:</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={styles.input}
        />
      </span>
    );
  }

  // Calculate totals
  let startDayTotal = 0,
    endDayTotal = 0,
    totalPay = 0;
  if (rateEntry) {
    startDayTotal =
      rateEntry.startRates.HOL * startHours.HOL +
      rateEntry.startRates.NSD * startHours.NSD +
      rateEntry.startRates.OT * startHours.OT;
    endDayTotal =
      rateEntry.endRates.HOL * endHours.HOL +
      rateEntry.endRates.NSD * endHours.NSD +
      rateEntry.endRates.OT * endHours.OT;
    totalPay = startDayTotal + endDayTotal;
  }

  return (
    <div style={styles.card}>
      <h2>Rate Calculator</h2>
      <div style={styles.section}>
        <div>
          <h4>Start Day</h4>
          <div style={styles.formGroup}>
            <span style={styles.label}>Type:</span>
            <select
              value={startDayType}
              onChange={(e) => setStartDayType(e.target.value)}
              style={styles.input}
            >
              {dayTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <span style={styles.label}>Rule:</span>
            <select
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              style={styles.input}
            >
              {rules.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <span style={styles.label}>Holiday:</span>
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
          <div style={styles.formGroup}>
            <HoursInput
              label="HOL hrs"
              value={startHours.HOL}
              onChange={(v) => setStartHours((h) => ({ ...h, HOL: v }))}
            />
            <HoursInput
              label="NSD hrs"
              value={startHours.NSD}
              onChange={(v) => setStartHours((h) => ({ ...h, NSD: v }))}
            />
            <HoursInput
              label="OT hrs"
              value={startHours.OT}
              onChange={(v) => setStartHours((h) => ({ ...h, OT: v }))}
            />
          </div>
        </div>
        <div>
          <h4>End Day</h4>
          <div style={styles.formGroup}>
            <span style={styles.label}>Type:</span>
            <select
              value={endDayType}
              onChange={(e) => setEndDayType(e.target.value)}
              style={styles.input}
            >
              {dayTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <span style={styles.label}>Holiday:</span>
            <select
              value={endHoliday}
              onChange={(e) => setEndHoliday(e.target.value)}
              style={styles.input}
            >
              {holidays.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <HoursInput
              label="HOL hrs"
              value={endHours.HOL}
              onChange={(v) => setEndHours((h) => ({ ...h, HOL: v }))}
            />
            <HoursInput
              label="NSD hrs"
              value={endHours.NSD}
              onChange={(v) => setEndHours((h) => ({ ...h, NSD: v }))}
            />
            <HoursInput
              label="OT hrs"
              value={endHours.OT}
              onChange={(v) => setEndHours((h) => ({ ...h, OT: v }))}
            />
          </div>
        </div>
      </div>
      <hr style={{ margin: "24px 0" }} />
      {rateEntry ? (
        <div>
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
                <td style={styles.td}>Start Day Rate</td>
                <td style={styles.td}>{rateEntry.startRates.HOL}</td>
                <td style={styles.td}>{rateEntry.startRates.NSD}</td>
                <td style={styles.td}>{rateEntry.startRates.OT}</td>
              </tr>
              <tr>
                <td style={styles.td}>Start Day Pay</td>
                <td style={styles.td}>
                  {(rateEntry.startRates.HOL * startHours.HOL).toFixed(2)}
                </td>
                <td style={styles.td}>
                  {(rateEntry.startRates.NSD * startHours.NSD).toFixed(2)}
                </td>
                <td style={styles.td}>
                  {(rateEntry.startRates.OT * startHours.OT).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style={styles.td}>End Day Rate</td>
                <td style={styles.td}>{rateEntry.endRates.HOL}</td>
                <td style={styles.td}>{rateEntry.endRates.NSD}</td>
                <td style={styles.td}>{rateEntry.endRates.OT}</td>
              </tr>
              <tr>
                <td style={styles.td}>End Day Pay</td>
                <td style={styles.td}>
                  {(rateEntry.endRates.HOL * endHours.HOL).toFixed(2)}
                </td>
                <td style={styles.td}>
                  {(rateEntry.endRates.NSD * endHours.NSD).toFixed(2)}
                </td>
                <td style={styles.td}>
                  {(rateEntry.endRates.OT * endHours.OT).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={styles.totals}>
            Start Day Total: {startDayTotal.toFixed(2)}
            <br />
            End Day Total: {endDayTotal.toFixed(2)}
            <br />
            <span style={{ fontWeight: 700, fontSize: 20 }}>
              Grand Total: {totalPay.toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ color: "red", marginTop: 16 }}>
          No matching rate found for the selected combination.
        </div>
      )}
    </div>
  );
}

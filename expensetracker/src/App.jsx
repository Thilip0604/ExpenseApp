import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses");
    setExpenses(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || !description || !date) return;
    await axios.post("http://localhost:5000/api/expenses", {
      amount,
      description,
      date,
    });
    setAmount("");
    setDescription("");
    setDate("");
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2em 0",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          margin: "2em auto",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(44,62,80,0.15)",
          padding: "2em",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#4F46E5",
            marginBottom: "1.5em",
            letterSpacing: 1,
          }}
        >
          💸 Expense Tracker
        </h2>
        <form onSubmit={handleAdd} style={{ marginBottom: "2em" }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 10,
              border: "1px solid rgb(0, 49, 148)",
              borderRadius: 8,
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
            }}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 10,
              border: "1px solid rgb(0, 49, 148)",
              borderRadius: 8,
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
            }}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 10,
              border: "1px solid rgb(0, 41, 122)",
              borderRadius: 8,
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              background: "linear-gradient(90deg, #4F46E5 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Add Expense
          </button>
        </form>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {expenses.length === 0 && (
            <li
              style={{
                textAlign: "center",
                color: "#a0aec0",
                marginTop: 24,
                fontStyle: "italic",
              }}
            >
              No expenses yet.
            </li>
          )}
          {expenses.map((exp) => (
            <li
              key={exp.id}
              style={{
                background: "#f8fafc",
                marginBottom: 14,
                padding: "14px 16px",
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 1px 4px rgba(2, 129, 255, 0.04)",
                borderLeft: "4px solidrgb(255, 255, 255)",
              }}
            >
              <span>
                <strong style={{ color: "#4F46E5" }}>₹{exp.amount}</strong>
                <span style={{ marginLeft: 8, color: "#374151" }}>
                  {exp.description}
                </span>
                <br />
                <small style={{ color: "#6b7280" }}>
                  {new Date(exp.date).toLocaleDateString()}
                </small>
              </span>
              <button
                onClick={() => handleDelete(exp.id)}
                style={{
                  background: "linear-gradient(90deg, #ef4444 0%, #f87171 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 14,
                  boxShadow: "0 1px 4px rgba(44,62,80,0.08)",
                  transition: "background 0.2s",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ textAlign: "center", color: "#e0e7ff", marginTop: 32 }}>
        <small>
          &copy; {new Date().getFullYear()} Expense Tracker &mdash; Made with React & Flask
        </small>
      </div>
    </div>
  );
}

export default App;
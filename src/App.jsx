import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [expenses, setExpenses] = useState([]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState("");

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState("All");
    const [toasts, setToasts] = useState([]);

    const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

    // Helper to show toasts
    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Derived state
    const filteredExpenses = filterCategory === "All"
        ? expenses
        : expenses.filter(e => e.category === filterCategory);

    const totalSpending = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const getCategoryStyle = (cat) => {
        switch (cat) {
            case "Food": return { bg: "rgba(239, 68, 68, 0.2)", text: "#fca5a5", icon: "🍔" };
            case "Transport": return { bg: "rgba(99, 102, 241, 0.2)", text: "#c7d2fe", icon: "🚗" };
            case "Bills": return { bg: "rgba(245, 158, 11, 0.2)", text: "#fcd34d", icon: "📄" };
            case "Entertainment": return { bg: "rgba(34, 197, 94, 0.2)", text: "#86efac", icon: "🎮" };
            default: return { bg: "rgba(148, 163, 184, 0.2)", text: "#cbd5e1", icon: "📦" };
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/expenses");
            setExpenses(res.data);
        } catch (error) {
            showToast("Failed to fetch expenses", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!amount || !description || !date) {
            showToast("Please fill in all fields", "error");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post("http://localhost:5000/api/expenses", {
                amount,
                description,
                category,
                date,
            });
            setAmount("");
            setDescription("");
            setCategory("Food");
            setDate("");
            await fetchExpenses();
            showToast("Expense added successfully!");
        } catch (error) {
            showToast("Error adding expense", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`);
            await fetchExpenses();
            showToast("Expense deleted");
        } catch (error) {
            showToast("Could not delete expense", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="main-card">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                )}
                <h2 className="title">
                    Expense Tracker
                </h2>

                <div className="summary-card">
                    <div className="summary-title">Total Spending</div>
                    <div className="summary-amount">₹{totalSpending.toLocaleString()}</div>
                </div>

                <form onSubmit={handleAdd} className="form-group">
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input-field"
                        style={{ marginBottom: '1rem' }}
                    />
                    <input
                        type="text"
                        placeholder="Where did you Spend?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field"
                        style={{ marginBottom: '1rem' }}
                    />
                    <div className="input-row">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="select-field"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Expense'}
                    </button>
                </form>

                <div className="filter-container">
                    <button
                        className={`filter-pill ${filterCategory === "All" ? "active" : ""}`}
                        onClick={() => setFilterCategory("All")}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-pill ${filterCategory === cat ? "active" : ""}`}
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <ul className="expense-list">
                    {filteredExpenses.length === 0 && (
                        <li className="empty-state">
                            {filterCategory === "All" ? "No expenses yet. Start tracking!" : `No expenses found for ${filterCategory}`}
                        </li>
                    )}
                    {filteredExpenses.map((exp) => (
                        <li key={exp.id} className="expense-item slide-in">
                            <div className="expense-info">
                                <div className="expense-header">
                                    <span
                                        className="category-tag"
                                        style={{
                                            backgroundColor: getCategoryStyle(exp.category).bg,
                                            color: getCategoryStyle(exp.category).text,
                                            border: `1px solid ${getCategoryStyle(exp.category).text}40`
                                        }}
                                    >
                                        {getCategoryStyle(exp.category).icon} {exp.category || "Other"}
                                    </span>
                                    <small className="expense-date">
                                        {new Date(exp.date).toLocaleDateString()}
                                    </small>
                                </div>
                                <div className="expense-details">
                                    <span className="expense-desc">{exp.description}</span>
                                    <span className="expense-amount">₹{exp.amount}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(exp.id)}
                                className="btn-danger"
                                title="Delete"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="footer">
                <small>
                    &copy; {new Date().getFullYear()} Expense Tracker &mdash; Made with React & Flask
                </small>
            </div>

            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast ${toast.type}`}>
                        <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
                        {toast.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
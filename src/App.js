import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  // Initialize expenses from localStorage (if available)
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Persist expenses to localStorage whenever expenses state changes
  useEffect(() => {
    try {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (err) {
      console.error("Failed to save expenses:", err);
      setError("Failed to save expenses. Please try again.");
    }
  }, [expenses]);

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate the description
    if (description.trim() === "") {
      setError("Please enter an expense description.");
      return;
    }
    // Validate the amount
    if (amount === "" || isNaN(amount)) {
      setError("Please enter a valid amount.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (parsedAmount < 0) {
      setError("Amount cannot be negative.");
      return;
    }

    // Create a new expense
    const newExpense = {
      id: Date.now(),
      description,
      amount: parsedAmount,
    };

    // Update state and clear the input fields
    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount("");
  };

  // Delete an expense by its id
  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Calculate total expense amount
  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="container my-4">
      <header className="mb-4 text-center">
        <h1>Expense Tracker</h1>
      </header>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Expense description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                step="0.01"
                min="0"
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body text-center">
          <h2>Total Expense: ${totalExpense.toFixed(2)}</h2>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {expenses.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-end">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td className="text-end">${expense.amount.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No expenses added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import "../App.css";
import { API } from "aws-amplify";
import { listExpenses, listCategorys, listAccounts } from "../graphql/queries";
import {
  createExpense as createExpenseMutation,
  deleteExpense as deleteExpenseMutation,
} from "../graphql/mutations";
import { DatePicker, Space, AutoComplete, InputNumber } from "antd";
import { parseValue, formatValue } from "../util/FunctionUtils.js";
import moment from "moment";

const initialFormState = {
  description: "",
  date: null,
  account: "",
  category: "",
  value: "R$ 0,00",
};

const ExpensesContainer = () => {
  const [expenses, setExpenses] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchExpenses();
    fetchAvailableCategories();
    fetchAvailableAccounts();
  }, []);

  async function fetchExpenses() {
    const apiData = await API.graphql({ query: listExpenses });
    const expensesFromAPI = apiData.data.listExpenses.items;
    setExpenses(expensesFromAPI);
  }

  async function createExpense() {
    if (
      !formData.description ||
      !formData.date ||
      !formData.account | !formData.category ||
      !formData.value
    )
      return;
    var expense = {
      description: formData.description,
      date: formData.date,
      account: formData.account,
      category: [formData.category],
      value: formData.value,
    };
    await API.graphql({
      query: createExpenseMutation,
      variables: { input: expense },
    });
    setExpenses([...expenses, formData]);
    setFormData(initialFormState);
  }

  async function deleteExpense({ id }) {
    const newExpensesArray = expenses.filter((expense) => expense.id !== id);
    setExpenses(newExpensesArray);
    await API.graphql({
      query: deleteExpenseMutation,
      variables: { input: { id } },
    });
  }

  async function fetchAvailableCategories() {
    const apiData = await API.graphql({ query: listCategorys });
    const availableCategories = apiData.data.listCategorys.items;
    setAvailableCategories(availableCategories);
  }

  async function fetchAvailableAccounts() {
    const apiData = await API.graphql({ query: listAccounts });
    const availableAccounts = apiData.data.listAccounts.items;
    setAvailableAccounts(availableAccounts);
  }

  function valueFormatter(value) {
    const formatted = formatValue(value);
    setFormData({ ...formData, value: formatted.decimalValue });
    return formatted.stringValue;
  }

  //TODO add remaining input fields
  return (
    <div className="Expenses">
      <Space direction="vertical">
        <h1>My Expenses</h1>
        <input
          style={{
            width: 200,
          }}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Expense description"
          value={formData.description}
        />
        <DatePicker
          style={{
            width: 200,
          }}
          value={formData.date ? moment(formData.date) : null}
          onChange={(date, dateString) =>
            setFormData({ ...formData, date: Date.parse(dateString) })
          }
        />
        <AutoComplete
          style={{
            width: 200,
          }}
          options={availableCategories.map((category) => {
            return { value: category.name };
          })}
          placeholder="Select category"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={(value) => setFormData({ ...formData, category: value })}
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
        />
        <AutoComplete
          style={{
            width: 200,
          }}
          options={availableAccounts.map((account) => {
            return { value: account.name };
          })}
          placeholder="Select account"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={(value) => setFormData({ ...formData, account: value })}
          value={formData.account}
          onChange={(value) => setFormData({ ...formData, account: value })}
        />

        <InputNumber
          style={{
            width: 200,
          }}
          placeholder="Value"
          inputMode="numeric"
          formatter={(value) =>
            valueFormatter(value.replace("R$ ", "").replace(",", "."))
          }
          defaultValue={formData.value}
          parser={(value) => parseValue(value)}
        />

        <button onClick={createExpense}>Create Expense</button>
        <div style={{ marginBottom: 30 }}>
          {expenses.map((expense) => {
            var date = new Date(expense.date);
            return (
              <div key={expense.description + expense.date}>
                <h2>{expense.description}</h2>
                <h2>{date.toLocaleDateString("en-US")}</h2>
                <h2>{expense.category}</h2>
                <h2>{expense.account}</h2>
                <h2>{expense.value}</h2>
                <button onClick={() => deleteExpense(expense)}>
                  Delete Expense
                </button>
              </div>
            );
          })}
        </div>
      </Space>
    </div>
  );
};

export default ExpensesContainer;

import React, { useState, useEffect } from 'react';
import '../App.css';
import { API } from 'aws-amplify';
import { listExpenses, listCategorys, listAccounts } from '../graphql/queries';
import { createExpense as createExpenseMutation, deleteExpense as deleteExpenseMutation } from '../graphql/mutations';
import { DatePicker, Space, AutoComplete, InputNumber } from 'antd';
import moment from 'moment';



const initialFormState = { description: '', date: null, account: '', category: '', value: null}

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
    //TODO persist data
    // if (!formData.description || !formData.date || !formData.account | !formData.category || !formData.value) return;
    // await API.graphql({ query: createExpenseMutation, variables: { input: formData } });
    console.log(formData);
    setExpenses([ ...expenses, formData ]);
    setFormData(initialFormState);
  }

  async function deleteExpense({ id }) {
    const newExpensesArray = expenses.filter(expense => expense.id !== id);
    setExpenses(newExpensesArray);
    await API.graphql({ query: deleteExpenseMutation, variables: { input: { id } }});
  }

  async function fetchAvailableCategories() {
    const apiData = await API.graphql({ query: listCategorys });
    // TODO add category group -> maybe change to multiple categories instead of group
    const availableCategories = apiData.data.listCategorys.items.map(category =>  { return {value: category.name } });
    setAvailableCategories(availableCategories);
  }

  async function fetchAvailableAccounts() {
    const apiData = await API.graphql({ query: listAccounts });
    const availableAccounts = apiData.data.listAccounts.items.map(account =>  { return {value: account.name } });
    setAvailableAccounts(availableAccounts);
  }

  function formatValue(value) {
    if (value === 0) {
      return "R$ 0,00";
    }

    let decimalValue = (value / 100) * 1.0;
    setFormData({...formData, 'value': decimalValue})
    const formatted = "R$ " + decimalValue.toString().replace('.', ',');
    return formatted;

  }

  function parseValue(value) {
    const parsed = parseFloat(value.slice(3).replace(',', ''));
    return parsed;
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
            onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            placeholder="Expense description"
            value={formData.description}
          />
          <DatePicker style={{
              width: 200,
            }} value={formData.date ? moment(formData.date) : null} onChange={(date, dateString) => setFormData({...formData, 'date': Date.parse(dateString)}) } />
          <AutoComplete
            style={{
              width: 200,
            }}
            options={availableCategories}
            placeholder="Select category"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            onSelect={value => setFormData({ ...formData, 'category': value})}
            value={formData.category}
            onChange={value => setFormData({ ...formData, 'category': value})}
          />
          <AutoComplete
            style={{
              width: 200,
            }}
            options={availableAccounts}
            placeholder="Select account"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            onSelect={value => setFormData({ ...formData, 'account': value})}
            value={formData.account}
            onChange={value => setFormData({ ...formData, 'account': value})}
          />

          <InputNumber style={{
              width: 200,
            }}
            placeholder="Value"
            inputMode="numeric"
            formatter={value => formatValue(value.replace('R$ ', '').replace(',', '.'))}
            defaultValue={"R$ 0,00"}
            parser={value => parseValue(value)}

          />

          <button onClick={createExpense}>Create Expense</button>
          <div style={{marginBottom: 30}}>
            {
              expenses.map(expense => {
                var date = new Date(expense.date);
                return (
                <div key={expense.description + expense.date}>
                  <h2>{expense.description}</h2>
                  <h2>{date.toLocaleDateString("en-US")}</h2>
                  <h2>{expense.category}</h2>
                  <h2>{expense.account}</h2>
                  <h2>{expense.value}</h2>
                  <button onClick={() => deleteExpense(expense)}>Delete Expense</button>
                </div>
              );}
            )
            }
          </div>
        </Space>
      </div>
  );
}

export default ExpensesContainer;
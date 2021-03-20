import React, { useState, useEffect } from "react";
import "../App.css";
import { API } from "aws-amplify";
import { listAccounts } from "../graphql/queries";
import {
  createAccount as createAccountMutation,
  deleteAccount as deleteAccountMutation,
} from "../graphql/mutations";
import {parseValue, formatValue} from "../util/FunctionUtils.js"

import { Input, InputNumber } from 'antd';


const initialFormState = { name: "", totalValue: null };

const AccountsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    const apiData = await API.graphql({ query: listAccounts });
    const accountsFromAPI = apiData.data.listAccounts.items;
    setAccounts(accountsFromAPI);
  }

  async function createAccount() {
    if (!formData.name) return;
    await API.graphql({
      query: createAccountMutation,
      variables: { input: formData },
    });
    setAccounts([...accounts, formData]);
    setFormData(initialFormState);
  }

  async function deleteAccount({ id }) {
    const newAccountsArray = accounts.filter((account) => account.id !== id);
    setAccounts(newAccountsArray);
    await API.graphql({
      query: deleteAccountMutation,
      variables: { input: { id } },
    });
  }

  function valueFormatter(value) {
    const formatted = formatValue(value)
    setFormData({...formData, 'totalValue': formatted.decimalValue})
    return formatted.stringValue;
  }

  return (
    <div className="App">
      <h1>My Accounts</h1>
      <Input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Account name"
        value={formData.name}
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
        defaultValue={"R$ 0,00"}
        parser={(value) => parseValue(value)}
      />

      <button onClick={createAccount}>Create Account</button>
      <div style={{ marginBottom: 30 }}>
        {accounts.map((account) => (
          <div key={account.id || account.name}>
            <h2>{account.name}</h2>
            <h2>{account.totalValue}</h2>
            <button onClick={() => deleteAccount(account)}>
              Delete Account
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsView;

import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listAccounts } from './graphql/queries';
import { createAccount as createAccountMutation, deleteAccount as deleteAccountMutation } from './graphql/mutations';

const initialFormState = { name: ''}

function App() {
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
    await API.graphql({ query: createAccountMutation, variables: { input: formData } });
    setAccounts([ ...accounts, formData ]);
    setFormData(initialFormState);
  }

  async function deleteAccount({ id }) {
    const newAccountsArray = accounts.filter(account => account.id !== id);
    setAccounts(newAccountsArray);
    await API.graphql({ query: deleteAccountMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Accounts</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Account name"
        value={formData.name}
      />
      <button onClick={createAccount}>Create Account</button>
      <div style={{marginBottom: 30}}>
        {
          accounts.map(account => (
            <div key={account.id || account.name}>
              <h2>{account.name}</h2>
              <button onClick={() => deleteAccount(account)}>Delete Account</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);

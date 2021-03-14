import React, { useState, useEffect } from 'react';
import '../App.css';
import { API } from 'aws-amplify';
import { listCategorys } from '../graphql/queries';
import { createCategory as createCategoryMutation, deleteCategory as deleteCategoryMutation } from '../graphql/mutations';

const initialFormState = { name: '', group: ''}

const CategoriesContainer = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const apiData = await API.graphql({ query: listCategorys });
    const categoriesFromAPI = apiData.data.listCategorys.items;
    setCategories(categoriesFromAPI);
  }

  async function createCategory() {
    if (!formData.name) return;
    await API.graphql({ query: createCategoryMutation, variables: { input: formData } });
    setCategories([ ...categories, formData ]);
    setFormData(initialFormState);
  }

  async function deleteCategory({ id }) {
    const newCategoriesArray = categories.filter(category => category.id !== id);
    setCategories(newCategoriesArray);
    await API.graphql({ query: deleteCategoryMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Categories</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Category name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'group': e.target.value})}
        placeholder="Category group"
        value={formData.group}
      />
      <button onClick={createCategory}>Create Category</button>
      <div style={{marginBottom: 30}}>
        {
          categories.map(category => (
            <div key={category.id || category.name}>
              <h2>{category.name} {category.group !== '' ? ('(' + category.group + ')') : ''}</h2>
              <button onClick={() => deleteCategory(category)}>Delete Category</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default CategoriesContainer;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory($owner: String!) {
    onCreateCategory(owner: $owner) {
      id
      name
      group
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory($owner: String!) {
    onUpdateCategory(owner: $owner) {
      id
      name
      group
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory($owner: String!) {
    onDeleteCategory(owner: $owner) {
      id
      name
      group
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount($owner: String!) {
    onCreateAccount(owner: $owner) {
      id
      name
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateAccount = /* GraphQL */ `
  subscription OnUpdateAccount($owner: String!) {
    onUpdateAccount(owner: $owner) {
      id
      name
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteAccount = /* GraphQL */ `
  subscription OnDeleteAccount($owner: String!) {
    onDeleteAccount(owner: $owner) {
      id
      name
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense($owner: String!) {
    onCreateExpense(owner: $owner) {
      id
      description
      date
      category {
        id
        name
        group
        createdAt
        updatedAt
        owner
      }
      account {
        id
        name
        createdAt
        updatedAt
        owner
      }
      value
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense($owner: String!) {
    onUpdateExpense(owner: $owner) {
      id
      description
      date
      category {
        id
        name
        group
        createdAt
        updatedAt
        owner
      }
      account {
        id
        name
        createdAt
        updatedAt
        owner
      }
      value
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense($owner: String!) {
    onDeleteExpense(owner: $owner) {
      id
      description
      date
      category {
        id
        name
        group
        createdAt
        updatedAt
        owner
      }
      account {
        id
        name
        createdAt
        updatedAt
        owner
      }
      value
      createdAt
      updatedAt
      owner
    }
  }
`;

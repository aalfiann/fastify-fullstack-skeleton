'use strict'

const addContact = {
  body: {
    type: 'object',
    properties: {
      user_id: { type: 'number' },
      name: { type: 'string', minLength: 3 },
      address: { type: 'string' }
    },
    required: ['user_id', 'name', 'address']
  }
}

const editContact = {
  body: {
    type: 'object',
    properties: {
      user_id: { type: 'number' },
      name: { type: 'string', minLength: 3 },
      address: { type: 'string' }
    },
    required: ['user_id', 'name', 'address']
  }
}

const getContact = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    }
  }
}

const searchContact = {
  querystring: {
    type: 'object',
    properties: {
      q: { type: 'string', minLength: 3 }
    },
    required: ['q']
  }
}

module.exports = {
  addContact,
  editContact,
  getContact,
  searchContact
}

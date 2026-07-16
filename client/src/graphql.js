import { gql } from '@apollo/client'

export const GET_ORDERS = gql`
  query GetOrders($contractorId: Int) {
    orders(contractorId: $contractorId) {
      id
      orderedAmount
      status
      createdAt
      part { partNumber name price }
      contractor { id name }
    }
  }
`

export const GET_CONTRACTORS = gql`
  query { contractors { id name } }
`

export const GET_PARTS = gql`
  query {
    parts {
      id
      partNumber
      name
      price
      inventory {
        quantity
      }
    }
  }
`


export const CREATE_ORDER = gql`
  mutation CreateOrder($partId: Int!, $orderedAmount: Int!, $contractorId: Int!) {
    createOrder(partId: $partId, orderedAmount: $orderedAmount, contractorId: $contractorId) {
      id orderedAmount status
      part { partNumber name price }
      contractor { id name }
    }
  }
`

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: Int!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id status
    }
  }
`

export const ORDER_CREATED = gql`
  subscription {
    orderCreated {
      id orderedAmount status
      part { partNumber name price }
      contractor { id name }
    }
  }
`

export const ORDER_UPDATED = gql`
  subscription {
    orderUpdated {
      id status
      part { partNumber name price }
      contractor { id name }
    }
  }
`
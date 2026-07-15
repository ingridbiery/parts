import { gql } from '@apollo/client'

export const GET_ORDERS = gql`
  query { orders { id partName quantity status createdAt } }
`

export const CREATE_ORDER = gql`
  mutation CreateOrder($partName: String!, $quantity: Int!) {
    createOrder(partName: $partName, quantity: $quantity) {
      id partName quantity status createdAt
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
  subscription { orderCreated { id partName quantity status createdAt } }
`

export const ORDER_UPDATED = gql`
  subscription { orderUpdated { id status } }
`
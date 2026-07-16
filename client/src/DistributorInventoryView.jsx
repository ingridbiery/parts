import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_PARTS } from './graphql'

export default function DistributorInventoryView() {
  const { data, loading } = useQuery(GET_PARTS)
  const [sortKey, setSortKey] = useState('name')

  if (loading) return <p>Loading...</p>

  const sorted = [...data.parts].sort((a, b) => {
    switch (sortKey) {
      case 'quantity':
        return (b.inventory?.quantity ?? 0) - (a.inventory?.quantity ?? 0)
      case 'partNumber':
        return a.partNumber.localeCompare(b.partNumber)
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return (
    <div>
      <h2>Inventory</h2>

      <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
        <option value="name">Name</option>
        <option value="partNumber">Part Number</option>
        <option value="quantity">Quantity</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Part Number</th>
            <th>Cost</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.partNumber}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.inventory?.quantity ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

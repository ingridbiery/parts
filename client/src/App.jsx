import { useState } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './apolloClient'

import ContractorView from './ContractorView'
import DistributorOrderView from './DistributorOrderView'
import DistributorInventoryView from './DistributorInventoryView'

export default function App() {
  const [view, setView] = useState('contractor')

  return (
    <ApolloProvider client={client}>
      <nav>
        <button onClick={() => setView('contractor')}>
          Contractor
        </button>

        <button onClick={() => setView('distributor-orders')}>
          Distributor Orders
        </button>

        <button onClick={() => setView('distributor-inventory')}>
          Distributor Inventory
        </button>
      </nav>

      {view === 'contractor' && <ContractorView />}
      {view === 'distributor-orders' && <DistributorOrderView />}
      {view === 'distributor-inventory' && <DistributorInventoryView />}
    </ApolloProvider>
  )
}
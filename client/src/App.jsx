import { useState } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './apolloClient'
import ContractorView from './ContractorView'
import DistributorOrderView from './DistributorOrderView'

export default function App() {
  const [view, setView] = useState('contractor')

  return (
    <ApolloProvider client={client}>
      <nav>
        <button onClick={() => setView('contractor')}>Contractor</button>
        <button onClick={() => setView('distributor')}>Distributor Orders</button>
      </nav>
      {view === 'contractor' ? <ContractorView /> : <DistributorOrderView />}
    </ApolloProvider>
  )
}
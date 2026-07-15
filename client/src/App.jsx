import { useState } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './apolloClient'
import ContractorView from './ContractorView'
import DistributorView from './DistributorView'

export default function App() {
  const [view, setView] = useState('contractor')

  return (
    <ApolloProvider client={client}>
      <nav>
        <button onClick={() => setView('contractor')}>Contractor</button>
        <button onClick={() => setView('distributor')}>Distributor</button>
      </nav>
      {view === 'contractor' ? <ContractorView /> : <DistributorView />}
    </ApolloProvider>
  )
}
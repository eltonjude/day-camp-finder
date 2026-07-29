import { useState } from 'react'
import { searchCamps } from './api'
import { ChildForm } from './components/ChildForm'
import { ChildList } from './components/ChildList'
import { ResultsView } from './components/ResultsView'
import { SearchPanel } from './components/SearchPanel'
import { useChildren } from './hooks/useChildren'
import type { SearchCampsResponse } from './types'

function App() {
  const { children, addChild, updateChild, removeChild } = useChildren()
  const [town, setTown] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchCampsResponse | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const res = await searchCamps({ town, children })
      setResults(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🏕️ Day Camp Finder</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add your kids, tell us your town, and we'll search the web for day camps and grade how well each one fits.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Your kids</h2>
        <div className="mb-3">
          <ChildForm onSave={addChild} />
        </div>
        <ChildList kids={children} onUpdate={updateChild} onRemove={removeChild} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Find camps</h2>
        <SearchPanel
          town={town}
          onTownChange={setTown}
          onSearch={handleSearch}
          loading={loading}
          disabled={children.length === 0}
        />
        {error && (
          <p className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}
      </section>

      {results && (
        <section>
          <ResultsView results={results} kids={children} />
        </section>
      )}
    </div>
  )
}

export default App

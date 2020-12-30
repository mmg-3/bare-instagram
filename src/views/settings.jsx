import * as React from 'react'
import { useQuery } from 'react-query'
import Layout from '../components/layout'
import useNames from '../hooks/use-names'
import useDesign from '../hooks/use-design'
import { fetchProfile } from '../utils/fetch-profile'
import Plus from '../icons/plus'
import Delete from '../icons/delete'
import Checkbox from '../components/checkbox'

const Settings = () => {
  const [query, setQuery] = React.useState('')
  const [names, setNames] = useNames()
  const [design, setDesign] = useDesign()

  const { status, error, isLoading, refetch } = useQuery(
    ['profile-information', query],
    async () => {
      const data = await fetchProfile(query)
      const { id, picture, username } = data

      setNames([...names, { id, picture, username }])
      setQuery('')

      return data
    },
    { enabled: false, retry: false }
  )

  const addName = async (e) => {
    e.preventDefault()
    if (!query) return
    await refetch()
  }

  const deleteName = (index) => {
    const newNames = [...names]
    newNames.splice(index, 1)
    setNames(newNames)
  }

  const handleDesignChange = (e) => {
    setDesign({ ...design, [e.target.name]: e.target.checked })
  }

  return (
    <Layout>
      <h2 className="sr-only">Usernames settings</h2>
      <form onSubmit={addName} className="flex flex-col">
        <label
          htmlFor="add-new-username"
          className="mb-2 font-medium text-black text-xl dark:text-white"
        >
          Add user
        </label>
        <div className="flex flex-nowrap flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-100 dark:bg-gray-600 rounded px-2 py-1 flex-1 text-gray-800 dark:text-gray-100"
            type="text"
            name="add-new-username"
            id="add-new-username"
            required
          />
          <button
            aria-label="Add username to list"
            type="submit"
            className="px-2 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded ml-4"
          >
            <Plus />
          </button>
        </div>
      </form>
      {status === 'error' && (
        <div className="text-sm text-black px-2 py-2 mt-4 bg-red-100 rounded">
          {error.message}
        </div>
      )}
      <div className="flex flex-col space-y-3 mt-8">
        {names.map((n, index) => (
          <div
            key={`names-list-${n.id}-${index}`}
            className="flex flex-row justify-between items-center"
          >
            <div className="flex flex-row flex-nowrap">
              {n.picture && (
                <img
                  className="rounded-full w-6 h-6 mr-2"
                  src={n.picture}
                  alt="Username"
                />
              )}{' '}
              {n.username}
            </div>
            <button
              className="text-white px-2 py-2 rounded bg-red-500 dark:bg-red-600"
              onClick={() => deleteName(index)}
              aria-label={`Delete ${n.username}`}
            >
              <Delete />
            </button>
          </div>
        ))}
        {isLoading && (
          <div className="text-center font-medium">Loading information...</div>
        )}
      </div>
      <hr className="mt-12 mb-6 dark:border-gray-700" />
      <h2 className="mb-2 font-medium text-black text-xl dark:text-white">
        Design
      </h2>
      <Checkbox
        desc="Use a minimal design"
        onChange={handleDesignChange}
        checked={design.minimal}
        name="minimal"
      />
    </Layout>
  )
}

export default Settings

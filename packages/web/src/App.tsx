import React, { useEffect, useState } from 'react'
import { trpc } from './trpc'

type Event = { id: string; title: string; date: string }

export default function App() {
  const [events, setEvents] = useState<Event[] | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await trpc.getEvents.query()
        setEvents(res)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Link Ring Calendar (web)</h1>
      <p>This is a minimal client that queries the mock tRPC server.</p>
      <h2>Events</h2>
      {events === null ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id}>
              <strong>{e.title}</strong> — {e.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

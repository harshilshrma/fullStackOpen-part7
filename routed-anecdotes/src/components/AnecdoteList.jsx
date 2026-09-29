import { useAnecdotes } from "../hooks"

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote =>
          <div key={anecdote.id} style={{ display: 'flex', gap: '0.25rem' }}>
            <li>{anecdote.content}</li>
            <button onClick={() => deleteAnecdote(anecdote)}>delete</button>
          </div>
        )}
      </ul>
    </div>
  )
}

export default AnecdoteList

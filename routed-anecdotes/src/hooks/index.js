import { useEffect, useState } from "react"
import annecdoteService from "../services/anecdotes"

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    return {
        input: {
            type,
            value,
            onChange
        },
        reset
    }
}

export const useAnecdotes = () => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        annecdoteService.getAll().then(data => setAnecdotes(data))
    }, [])

    const addAnecdote = async (anec) => {
        const newAnec = await annecdoteService.createNew(anec)
        setAnecdotes(anecdotes.concat(newAnec))
    }

    const deleteAnecdote = async (anec) => {
        await annecdoteService.remove(anec)
        setAnecdotes(anecdotes.filter(a => a.id !== anec.id))
    }

    return {
        anecdotes,
        addAnecdote,
        deleteAnecdote
    }
}
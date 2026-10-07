import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import SingleBlog from './SingleBlog'

const testUserCreator = {
    id: '123test',
    name: 'Test User',
    username: 'testuser'
}

const testUserNonCreator = {
    id: '345test',
    name: 'Test User',
    username: 'testuser'
}

const testBlog = [{
    id: '123test',
    user: {
        id: '123test'
    },
    title: 'test blog',
    author: 'test user',
    url: 'www.test.com',
    likes: 20
}]

const TestSingleBlog = ({ isAuthenticated, isCreator }) => {
    return (
        <MemoryRouter initialEntries={['/blog/123test']}>
            <Routes>
                <Route path='/blog/:id' element={
                    isAuthenticated
                        ? <SingleBlog blogs={testBlog} user={isCreator ? testUserCreator : testUserNonCreator} />
                        : <SingleBlog blogs={testBlog} user={null} />
                } />
            </Routes>
        </MemoryRouter>
    )
}

test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
    render(<TestSingleBlog isAuthenticated={false} />)

    expect(screen.getByText('test blog')).toBeVisible()
    expect(screen.getByText('www.test.com')).toBeVisible()
    expect(screen.getByText('20 likes')).toBeVisible()

    expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
})

test('Authenticated users who are not the blog’s creator are shown only the like button', () => {
    render(<TestSingleBlog isAuthenticated={true} isCreator={false} />)
    expect(screen.queryByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
})

test('Authenticated users who are the blog’s creator are shown both: remove and like button', () => {
    render(<TestSingleBlog isAuthenticated={true} isCreator={true} />)
    expect(screen.queryByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeInTheDocument()
})

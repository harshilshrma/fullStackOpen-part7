import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testBlog = {
  title: 'test blog',
  author: 'test user',
  url: 'www.test.com',
  likes: 20
}

const testUser = {
  name: 'Test User',
  username: 'testuser'
}

const TestBlogComponent = ({ likeMockHandler }) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(prev => !prev)
  }

  return (
    <Blog blog={testBlog} toggleVisibility={toggleVisibility} isVisible={isVisible} handleLike={likeMockHandler} user={testUser}/>
  )
}

test('Blog component renders title and author by default but not URL & likes', () => {
  const { container } = render(<Blog blog={testBlog} />)

  const div = container.querySelector('.blog-container')
  expect(div).toHaveTextContent('test blog – test user')
  expect(div).not.toHaveTextContent('www.test.com')
  expect(div).not.toHaveTextContent('Likes: 20')
})

test('Blog component renders URL & likes when the button controlling the shown details has been clicked', async () => {
  const user = userEvent.setup()
  const mockHandler = vi.fn()
  render(<TestBlogComponent likeMockHandler={mockHandler} />)

  expect(screen.queryByText('www.test.com')).not.toBeInTheDocument()
  expect(screen.queryByText('Likes: 20')).not.toBeInTheDocument()

  const button = screen.getByRole('button', { name: 'View' })
  await user.click(button)

  expect(screen.getByText('www.test.com')).toBeVisible()
  expect(screen.getByText('Likes: 20')).toBeVisible()
})

test('Clicking the like button twice calls the event handler of the component twice', async () => {
  const user = userEvent.setup()
  const mockHandler = vi.fn()
  render(<TestBlogComponent likeMockHandler={mockHandler} />)

  const viewButton = screen.getByRole('button', { name: 'View' })
  await user.click(viewButton)

  const likeButton = screen.getByRole('button', { name: 'like' })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

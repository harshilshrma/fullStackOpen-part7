const _ = require('lodash')

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes;
    }

    return blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    const reducer = (maxLikedBlog, blog) => {
        return blog.likes > maxLikedBlog.likes ? blog : maxLikedBlog;
    }

    return blogs.reduce(reducer, blogs[0]);
}

// without using lodash
const mostBlogs = (blogs) => {
    const authorCounts = {}

    blogs.forEach((blog) => {
        authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
    })

    let maxAuthor = null
    let maxCount = 0;

    for (const author in authorCounts) {
        if (authorCounts[author] > maxCount) {
            maxAuthor = author;
            maxCount = authorCounts[author]
        }
    }

    return { author: maxAuthor, blogs: maxCount }
}

// using lodash
const mostBlogsUsingLodash = (blogs) => {
    const grouped = _.groupBy(blogs, 'author');
    const authorWithMost = _.maxBy(
        Object.keys(grouped), 
        author => grouped[author].length
    )

    return {
        author: authorWithMost,
        blogs: grouped[authorWithMost].length
    }
}

// without using lodash
const mostLikes = (blogs) => {
    const map = {};

    blogs.forEach((blog) => {
        map[blog.author] = (map[blog.author] || 0) + blog.likes
    })

    let maxAuthor = null;
    let mostLikes = 0;

    for (const author in map) {
        if (map[author] > mostLikes) {
            mostLikes = map[author]
            maxAuthor = author
        }
    }

    return {
        author: maxAuthor,
        likes: mostLikes
    }
}

// using lodash
const mostLikesUsingLodash = (blogs) => {
    const grouped = _.groupBy(blogs, 'author')
    const authorWithMostLikes = _.maxBy(
        Object.keys(grouped), 
        (author) => {
            return _.sumBy(grouped[author], 'likes')
        }
    )

    return {
        author: authorWithMostLikes,
        likes: _.sumBy(grouped[authorWithMostLikes], 'likes')
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostBlogsUsingLodash,
    mostLikes,
    mostLikesUsingLodash
}
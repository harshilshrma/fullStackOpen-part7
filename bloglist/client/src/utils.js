const formatUrl = (url) => {
    if (!url) return '#'
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
}

export { formatUrl }
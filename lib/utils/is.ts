const httpUrl = (url: string) => {
  return /^https?:\/\//.test(url)
}

export default {
  httpUrl
}

export const promisify = <T = any>(func: (...args: any[]) => void) => {
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      func(...args, (error: any, data: T) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
}

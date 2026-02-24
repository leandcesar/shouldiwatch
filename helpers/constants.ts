
export const getRandom = <T,>(list: T[]): T => {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const index = array[0] % list.length
  return list[index]
}

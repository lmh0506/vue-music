export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  const Len = arr.length
  const a = arr.slice()
  for (let i = 0; i < Len; i++) {
    let j = getRandom(0, i);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function debounce(func, delay) {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function range(m, n) {
  const array = [];
  for (let i = m; i < n; i++) {
    array.push(i);
  }

  return array;
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function compare(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return arr1.every(item => set2.has(item)) && arr2.every(item => set1.has(item))
}

export function formatDate() {
  // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const date = new Date();
  const month = months[date.getMonth()];

  const formattedDate = `${month} ${date.getDate()}, ${date.getFullYear()}`;
  return formattedDate;
}
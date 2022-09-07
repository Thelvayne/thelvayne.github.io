// Hilfsfunktion um id für document.getElementById(id) dynamisch zu bekommen
// erstellt einen Char von der Position (num) im Alphabet
export function letter(num) {
    let str = String.fromCharCode(97 + (num % 26));
    return str.toLowerCase();
  }
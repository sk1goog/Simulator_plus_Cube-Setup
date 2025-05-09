// assets/scripts/cube-setup_2.js

// Farbdefinition inklusive Grau (X)
const colors = {
  U: '#ffffff',  // Weiß
  L: '#ffa500',  // Orange
  F: '#00ff00',  // Grün
  R: '#ff0000',  // Rot
  B: '#0000ff',  // Blau
  D: '#ffff00',  // Gelb
  X: '#808080'   // Grau
};

// Anfangszustand (alle neun Felder pro Fläche)
const state = {
  U: Array(9).fill('U'),
  L: Array(9).fill('L'),
  F: Array(9).fill('F'),
  R: Array(9).fill('R'),
  B: Array(9).fill('B'),
  D: Array(9).fill('D')
};

// Buchstaben für Ergebnis-String (inkl. Grau als 'X')
const colorLetters = {
  U: 'W',
  L: 'O',
  F: 'G',
  R: 'R',
  B: 'B',
  D: 'Y',
  X: 'X'
};

let selectedColor = 'U';

function setupPalette() {
  const pal = document.querySelector('.palette');
  pal.innerHTML = '';
  Object.entries(colors).forEach(([face, hex]) => {
    const btn = document.createElement('button');
    btn.style.background = hex;
    btn.dataset.face = face;
    btn.title = face;
    btn.addEventListener('click', () => {
      selectedColor = face;
      document.querySelectorAll('.palette button')
              .forEach(b => b.classList.toggle('selected', b === btn));
    });
    if (face === selectedColor) btn.classList.add('selected');
    pal.appendChild(btn);
  });
}

function getCell(r, c) {
  if (r < 3 && c >= 3 && c < 6) return ['U', r * 3 + (c - 3)];
  if (r >= 3 && r < 6) {
    const rr = r - 3;
    if (c < 3)  return ['L', rr * 3 + c];
    if (c < 6)  return ['F', rr * 3 + (c - 3)];
    if (c < 9)  return ['R', rr * 3 + (c - 6)];
    if (c < 12) return ['B', rr * 3 + (c - 9)];
  }
  if (r >= 6 && r < 9 && c >= 3 && c < 6) return ['D', (r - 6) * 3 + (c - 3)];
  return null;
}

function setupGrid() {
  const net = document.querySelector('.cube-net');
  net.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 12; c++) {
      const cell = getCell(r, c);
      const div = document.createElement('div');
      div.className = 'facelet';
      if (cell) {
        const [f, i] = cell;
        div.dataset.face = f;
        div.dataset.idx = i;
        div.tabIndex = 0;
        setColor(div);
        div.addEventListener('click', () => assignColor(div));
        div.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            assignColor(div);
          }
        });
      } else {
        div.style.visibility = 'hidden';
        div.tabIndex = -1;
      }
      net.appendChild(div);
    }
  }
}

function assignColor(div) {
  const f = div.dataset.face;
  const i = +div.dataset.idx;
  state[f][i] = selectedColor;
  setColor(div);
}

function setColor(div) {
  const f = div.dataset.face;
  const i = +div.dataset.idx;
  div.style.background = colors[state[f][i]];
}

document.addEventListener('DOMContentLoaded', () => {
  setupPalette();
  setupGrid();

  // Farbstring erzeugen
  document.getElementById('StringErzeugung').addEventListener('click', () => {
    let s2 = '';
    ['U','R','F','D','L','B'].forEach(f => {
      state[f].forEach(st => { s2 += colorLetters[st]; });
    });
    // Ausgabe und Eingabefeld füllen
    document.getElementById('result-colors').innerText = 'Colors: ' + s2;
    const input = document.getElementById('colorstring');
    input.value = s2;
  });

  // An Simulator übergeben
  document.getElementById('applyColorString').addEventListener('click', () => {
    const str = document.getElementById('colorstring').value.trim().toUpperCase();
    if (str.length !== 54) {
      alert('Der Farbstring muss genau 54 Zeichen enthalten.');
      return;
    }
    if (typeof window.applyColorString === 'function') {
      window.applyColorString(str);
    } else {
      console.error('Simulator-Funktion nicht verfügbar.');
    }
  });
});
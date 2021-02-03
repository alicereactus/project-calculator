const rows = [
  ['C', '&#8592;'],
  ['+', '-', `*`, '/'],
  [7, 8, 9, '('],
  [4, 5, 6, ')'],
  [1, 2, 3, '='],
  [0, '.'],
];

// Создание калькулятора:
const body = document.getElementById('body');
const divContainer = document.createElement('div');
divContainer.setAttribute('class', 'container');

const divInput = document.createElement('div');
divInput.setAttribute('class', 'item input');
divContainer.appendChild(divInput);

const form = document.createElement('form');
form.setAttribute('name', 'form');
divInput.appendChild(form);

const input = document.createElement('input');
input.setAttribute('type', 'text');
input.setAttribute('name', 'textView');
input.setAttribute('readonly', 'readonly');
form.appendChild(input);

const historyContainer = document.createElement('div');
historyContainer.setAttribute('class', 'historyContainer');

// Добавление аттрибутов и EventListeners
for (const row of rows) {
  for (const cell of row) {
    const cellEl = document.createElement('button');
    cellEl.setAttribute('class', 'item');

    if (cell !== '=' && cell !== '&#8592;' && cell !== 'C') {
      cellEl.addEventListener('click', insert);
    }

    if (cell === 0) {
      cellEl.setAttribute('class', 'item zero');
    } else if (cell === '=') {
      cellEl.setAttribute('class', 'item equal');
      cellEl.addEventListener('click', equal);
    } else if (cell === 'C') {
      cellEl.setAttribute('class', 'item clean');
      cellEl.addEventListener('click', clean);
    } else if (cell === '&#8592;') {
      cellEl.setAttribute('class', 'item back');
      cellEl.addEventListener('click', backspace);
    }
    cellEl.innerHTML = cell;
    divContainer.appendChild(cellEl);
  }
}

// Сохранение историй операций:
const history = JSON.parse(localStorage.getItem('operationHistory')) || [];

function displayHistory() {
  historyContainer.innerHTML = '';

  const historyTitle = document.createElement('h1');
  historyTitle.innerText = 'Журнал операций';
  historyContainer.appendChild(historyTitle);

  history.forEach((oper, index) => {
    const operation = document.createElement('p');
    operation.innerHTML = `${index + 1}) ${oper}`;
    historyContainer.appendChild(operation);
  });

  const clearHistoryBtn = document.createElement('button');
  clearHistoryBtn.innerText = 'Очистить журнал операций';
  clearHistoryBtn.addEventListener('click', clearHistory);
  historyContainer.appendChild(clearHistoryBtn);
}

displayHistory();

function addToHistory(str) {
  history.push(str);
  displayHistory();
}

function clearHistory() {
  localStorage.clear();
  history.length = 0;
  displayHistory();
}

// Обработчики событий:
function insert(event) {
  const value = event.target.innerHTML;
  document.form.textView.value += value;
}

function clean() {
  document.form.textView.value = '';
}

function backspace() {
  let value = document.form.textView.value;
  if (value === 'ERROR' || value === 'Infinity') {
    clean();
    return;
  }

  document.form.textView.value = value.substring(0, value.length - 1);
}

function equal() {
  const value = document.form.textView.value;
  if (value) {
    try {
      const result = eval(value);
      document.form.textView.value = result;

      // Сохранение истории:
      addToHistory(`${value} = ${result}`);
      localStorage.setItem('operationHistory', JSON.stringify(history));
    } catch (error) {
      document.form.textView.value = 'ERROR';
    }
  }
}

// Вывод в index.html
body.appendChild(divContainer);
body.appendChild(historyContainer);
const form = document.querySelector('#transfer-form');
const destination = document.querySelector('#destination');
const amount = document.querySelector('#amount');
const receipt = document.querySelector('#receipt');
const heading = document.querySelector('.card-heading');
const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

function validateAmount(value) {
  const text = value.trim();
  if (!text) return 'Ingresá el monto que querés transferir.';
  if (!/^-?\d+(?:[.,]\d{1,2})?$/.test(text)) return 'Ingresá un monto válido, con hasta dos decimales y sin separadores de miles.';
  const number = Number(text.replace(',', '.'));
  if (!Number.isFinite(number)) return 'Ingresá un monto válido.';
  if (number === 0) return 'El monto no puede ser cero.';
  if (number < 0) return 'El monto no puede ser negativo.';
  if (number < 100) return 'El monto mínimo para transferir es de $100,00.';
  if (number > Number.MAX_SAFE_INTEGER / 100) return 'El monto ingresado es demasiado grande.';
  return '';
}

function showError(input, message) {
  document.querySelector(`#${input.id}-error`).textContent = message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
}

for (const input of [destination, amount]) {
  input.addEventListener('input', () => showError(input, ''));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const destinationError = destination.value.trim() ? '' : 'Ingresá un alias o CBU de destino.';
  const amountError = validateAmount(amount.value);
  showError(destination, destinationError);
  showError(amount, amountError);
  if (destinationError || amountError) {
    (destinationError ? destination : amount).focus();
    return;
  }
  document.querySelector('#receipt-amount').textContent = money.format(Number(amount.value.trim().replace(',', '.')));
  document.querySelector('#receipt-destination').textContent = destination.value.trim();
  form.hidden = true;
  heading.hidden = true;
  heading.style.display = 'none';
  receipt.hidden = false;
  document.querySelector('#new-transfer').focus();
});

document.querySelector('#new-transfer').addEventListener('click', () => {
  form.reset();
  receipt.hidden = true;
  form.hidden = false;
  heading.hidden = false;
  heading.style.display = '';
  destination.focus();
});

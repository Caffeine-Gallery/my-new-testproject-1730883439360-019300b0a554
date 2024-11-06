import { backend } from 'declarations/backend';

const result = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');
const equalsBtn = document.getElementById('equals');
const clearBtn = document.getElementById('clear');
const loading = document.getElementById('loading');

let currentInput = '';
let currentOperator = '';
let firstOperand = null;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        if (value) {
            if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput !== '') {
                    if (firstOperand === null) {
                        firstOperand = parseFloat(currentInput);
                        currentInput = '';
                    }
                    currentOperator = value;
                }
            } else {
                currentInput += value;
            }
            updateDisplay();
        }
    });
});

equalsBtn.addEventListener('click', async () => {
    if (firstOperand !== null && currentInput !== '' && currentOperator !== '') {
        const secondOperand = parseFloat(currentInput);
        loading.style.display = 'block';
        try {
            let calculationResult;
            switch (currentOperator) {
                case '+':
                    calculationResult = await backend.add(firstOperand, secondOperand);
                    break;
                case '-':
                    calculationResult = await backend.subtract(firstOperand, secondOperand);
                    break;
                case '*':
                    calculationResult = await backend.multiply(firstOperand, secondOperand);
                    break;
                case '/':
                    calculationResult = await backend.divide(firstOperand, secondOperand);
                    break;
            }
            currentInput = calculationResult.toString();
            firstOperand = null;
            currentOperator = '';
            updateDisplay();
        } catch (error) {
            console.error('Calculation error:', error);
            currentInput = 'Error';
            updateDisplay();
        } finally {
            loading.style.display = 'none';
        }
    }
});

clearBtn.addEventListener('click', () => {
    currentInput = '';
    currentOperator = '';
    firstOperand = null;
    updateDisplay();
});

function updateDisplay() {
    result.value = currentInput;
}

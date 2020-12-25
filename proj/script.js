'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, -1000, 200],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMyMovements = function(movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function(mov, index) {
    const htmlTemplateForRow = `<div class="movements__row">
          <div class="movements__type movements__type--${
            mov < 0 ? 'withdrawal' : 'deposit'
          }">${index + 1} ${mov < 0 ? 'Withdrawal' : 'Deposit'}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', htmlTemplateForRow);
  });
};

const printBalance = function(movements) {
  const balance = movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = `${balance} EUR`;
};

const UserNameGen = function(str) {
  const initials = str.toLowerCase().split(' ');
  let myStr = '';
  const userName = initials.map(name => name[0]);
  return userName.join('');
};

accounts.forEach(function(account, index) {
  account.username = UserNameGen(account.owner);
});

// const displayMovements = function(movements) {
//   movements.forEach(function(mov, index) {
//     const movementRow = document.createElement('div');
//     movementRow.classList.add('movements__row');

//     const movementType = document.createElement('div');
//     movementType.classList.add('movements__type');
//     movementType.classList.add(
//       `${mov < 0 ? 'movements__type--withdrawal' : 'movements__type--deposit'}`
//     );
//     movementType.textContent = `${index + 1} ${
//       mov < 0 ? 'Widthdrawal' : 'Deposit'
//     }`;

//     const movementDate = document.createElement('div');
//     movementDate.classList.add('movements__date');
//     movementDate.textContent = '3 days ago';
//     const movementValue = document.createElement('div');
//     movementValue.classList.add('movements__value');
//     movementValue.textContent = `${mov}$`;
//     movementRow.append(movementType);
//     movementRow.append(movementDate);
//     movementRow.append(movementValue);

//     containerMovements.append(movementRow);
//   });
// };

/**
          <div class="movements__row">
          <div class="movements__type movements__type--deposit">2 deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">4 000€</div>
        </div>

 * 
 */

const calcDisplaySummary = function(account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  const outcome = account.movements
    .filter(mov => mov < 0)
    .map(mov => mov * -1)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${income} 🇪🇺`;
  labelSumOut.textContent = `${outcome} 🇪🇺`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (account.interestRate / 100))
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = `${interest} 🇪🇺`;
};

let currentAccount;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  const pin = inputLoginPin.value;
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Succesful login
    // display welcome message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    displayMyMovements(currentAccount.movements);
    printBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount);
    containerApp.style.opacity = '1';
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  console.log(inputTransferTo.value);
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = Number(inputTransferAmount.value);
  console.log(transferTo);
  if (transferTo && transferTo !== currentAccount) {
    currentAccount.movements.push(-transferAmount);
    displayMyMovements(currentAccount.movements);
    printBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount);
    transferTo.movements.push(transferAmount);
    inputTransferTo.value = inputTransferAmount.value = '';
  } else {
    console.log('user to transfer to not found');
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling']
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// movements.forEach(function(movement, index, array) {
//   movement > 0
//     ? console.log(`Movement ${index + 1}: You deposited ${movement}$`)
//     : console.log(
//         `Movement ${index + 1}: You have withdraw ${Math.abs(movement)}$`
//       );
// });
// console.log('-'.repeat(50));
// for (const [i, movement] of movements.entries()) {
//   movement > 0
//     ? console.log(`Movement ${i + 1}: You deposited ${movement}$`)
//     : console.log(
//         `Movement ${i + 1}: You have withdraw ${Math.abs(movement)}$`
//       );
// }

// currencies.forEach(function(value, key, map) {
//   console.log(`${key} : ${value}, ${map}`);
// });
// console.log(`${currencies.get('USD')}`);

// const currenciesUnique = new Set(['USD', 'EUR', 'USD']);
// currenciesUnique.forEach(function(value, key, map) {
//   console.log(`${key} : ${value}, ${map}`);
// });

// const checkDogs = function(dogsJulia, dogsKate) {
//   const dogsJuliaCopy = dogsJulia.slice(1, -2);
//   const allDogData = dogsJuliaCopy.concat(dogsKate);
//   allDogData.forEach(function(dog, i) {
//     const type = dog < 3 ? 'a Puppy' : `an Adult and is ${dog} years old`;
//     console.log(`Dog ${i + 1} is ${type}`);
//   });
// };

// const testData1J = [3, 5, 2, 12, 7];
// const testData1K = [4, 1, 15, 8, 3];
// checkDogs(testData1J, testData1K);

// const euroToUsd = 1.1;

// const newMovements = movements.map(function(mov) {
//   return mov * euroToUsd;
// });
// const newUsdMovements = movements.map(move => move * euroToUsd);
// console.log('Kiwwe', movements, newUsdMovements);
// // console.log(movements, newMovements);

// const reducer = function(accum, current) {
//   return accum + current;
// };
// const totalBalance = movements.reduce(function(accum, current) {
//   return accum + current;
// });
// console.log(totalBalance);
// const deposits = movements.filter(move => move > 0);
// console.log(deposits);
// const widthdrawals = movements.filter(move => move < 0);
// console.log(widthdrawals);

// // finding max Value
// const maxValue = movements.reduce((acc, curr) => {
//   if (acc > curr) {
//     return acc;
//   } else return curr;
// }, movements[0]);

// const minValue = movements.reduce((acc, curr) => {
//   if (acc < curr) {
//     return acc;
//   } else {
//     return curr;
//   }
// }, movements[0]);

// console.log(maxValue);
// console.log(minValue);
// const calcAverageHumanAge2 = dogsAges => {
//   const avgAges = dogsAges
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
//   return avgAges;
// };
// const calcAverageHumanAge = function(dogsAges) {
//   const humanAges = dogsAges.map((dogAge, i) =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   const correctAges = humanAges.filter((age, i) => age >= 18);
//   const avgAges = correctAges.reduce(
//     (acc, curr, i, arr) => acc + curr / arr.length,
//     0
//   );
//   return avgAges;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log('Second: ', calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));

// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, curr) => acc + curr);

// console.log(totalDepositsUSD);
// const totalWidthdrawals = movements
//   .filter(mov => mov < 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, curr) => acc + curr);
// console.log(totalWidthdrawals);

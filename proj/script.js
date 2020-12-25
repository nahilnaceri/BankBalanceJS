'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-28T09:15:04.904Z',
    '2020-05-28T09:15:04.904Z',
    '2020-12-12T09:15:04.904Z',
    '2020-12-24T18:45:04.904Z',
    '2020-12-23T01:15:04.904Z'
  ],
  currency: 'EUR',
  locale: 'pt-PT'
};
const account5 = {
  owner: 'Chafik Naceri',
  movements: [200, -50],
  interestRate: 1.2, // %
  pin: 5555
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400],
  interestRate: 1.5,
  movementDates: ['2020-07-28T09:15:04.904Z', '2020-07-28T09:15:04.904Z'],
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

const accounts = [account1, account2, account3, account4, account5];

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

const formatDate = function(date) {
  const today = new Date(new Date().toISOString());

  // let difference =
  const diffDays = Math.round((today - date) / (1000 * 60 * 60 * 24));
  const diffHours = Math.round((today - date) / (1000 * 60 * 60));
  const diffMinutes = Math.round((today - date) / (1000 * 60));
  const diffSeconds = Math.round((today - date) / 1000);

  if (diffDays > 7) {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } else if (diffDays <= 7 && diffHours > 24) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} Ago`;
  } else if (diffHours <= 24 && diffHours >= 1) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} Ago`;
  } else if (diffMinutes < 60 && diffMinutes >= 1) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} Ago`;
  } else if (diffSeconds < 60 && diffSeconds >= 1) {
    return `${diffSeconds} second${diffSeconds === 1 ? '' : 's'} Ago`;
  } else {
    return `Now`;
  }
};

const displayMyMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function(mov, index) {
    const myDate = new Date(acc.movementDates[index]);
    const displayDate = formatDate(myDate);
    const htmlTemplateForRow = `<div class="movements__row ${
      index % 2 === 0 ? 'remainder' : ''
    }">
          <div class="movements__type  movements__type--${
            mov < 0 ? 'withdrawal' : 'deposit'
          }">${index + 1} ${mov < 0 ? 'Withdrawal' : 'Deposit'}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', htmlTemplateForRow);
  });
};

const printBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
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

const calcDisplaySummary = function(account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  const outcome = account.movements
    .filter(mov => mov < 0)
    .map(mov => mov * -1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${income.toFixed(2)} €`;
  labelSumOut.textContent = `${outcome.toFixed(2)} €`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (account.interestRate / 100))
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};
let currentAccount;
const updateUI = function(acc) {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
  displayMyMovements(acc);
  printBalance(acc);
  calcDisplaySummary(acc);
};

//Login method

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  const pin = inputLoginPin.value;
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Succesful login
    // display welcome message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    updateUI(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = '1';
  }
});

// Transfer money
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  console.log(inputTransferTo.value);
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = +inputTransferAmount.value;
  if (
    transferTo &&
    transferTo !== currentAccount &&
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount
  ) {
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementDates.push(new Date().toISOString());
    updateUI(currentAccount);
    transferTo.movements.push(transferAmount);
    transferTo.movementDates.push(new Date().toISOString());
    inputTransferTo.value = inputTransferAmount.value = '';
  } else {
    console.log('user to transfer to not found');
  }
});

// Loan ask
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amountAsked = Math.floor(inputLoanAmount.value);
  const eligible = currentAccount.movements.some(
    mov => mov >= 0.1 * amountAsked
  );
  if (eligible && amountAsked > 0) {
    currentAccount.movements.push(amountAsked);
    const dateAdded = new Date();
    currentAccount.movementDates.push(dateAdded.toISOString());
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

let sorted = false;
// Sort data movements
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMyMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Delete Account method
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const deleteAccount = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(deleteAccount, 1);
    containerApp.style.opacity = '0';
    console.log(accounts);
  }

  // console.log(deleteAccount);
  // if (
  //   deleteAccount >= 0 &&
  //   currentAccount === accounts[deleteAccount] &&
  //   accounts[deleteAccount].pin === +(inputClosePin.value)
  // ) {
  //   console.log('Deleted');
  // }
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

const allMovementsBank = accounts.map(acc => acc.movements).flat();
const totalMoneyBalanceBank = allMovementsBank.reduce(
  (acc, curr) => acc + curr,
  0
);
console.log(
  `Your bank is ${totalMoneyBalanceBank > 0 ? 'Positif' : 'Negative'} Flow`
);

// ascending order

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// movements.sort((a, b) => a - b);

// // descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// movements.sort((a, b) => b - a);

// const randomDiceRolls = Array.from(
//   { length: 100 },
//   () => Math.floor(Math.random() * 6) + 1
// );
// console.log(randomDiceRolls);
// lectures

const myNumbers = [100, 3, 18, 45, 9, 95];
console.log(Math.max(...myNumbers));
console.log(Math.min(...myNumbers));
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randomInt(500, 1000));

// creating dates
// const now = new Date();
// console.log(now);
// console.log(new Date('Fri Dec 25 2020 23:11:55'));
// console.log(new Date(account1.movementDates[0]));

const future = new Date(2037, 2, 17, 23, 30, 5);
console.log(future);
console.log(future.getDate());
console.log(future.getMonth());
console.log(future.toISOString());
console.log(new Date(Date.now()));

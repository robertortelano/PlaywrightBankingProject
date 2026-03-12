const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const AccountPage = require('../pages/accountPage');
const testData = require('../Fixtures/testData.json');
const { attachScreenshot } = require('../utils/screenshot');
const { getDateTimeString } = require('../utils/datetime');

// LOGIN
test.beforeEach(async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();

  const username = testData.username.validUser1; // Login as Harry Potter
  console.log('Username is:', username);
  await loginPage.login(username); // Login function
  console.log('Login successful');
  await attachScreenshot(page, testInfo, 'login-success'); // Screenshot successful Login
});

// DEPOSIT TRANSACTION TESTS
test.describe('Deposit Transaction Tests', () => {

  test('Verify if user is able to complete a valid deposit transaction.', async ({ page }, testInfo) => {
    const accountPage = new AccountPage(page);
    const depositAmount = testData.deposit.amount1; // Get deposit amount in test data file
    const dateTimeNow = getDateTimeString(); // Function to verify date and time of deposit

    // Deposit amount
    await accountPage.deposit(depositAmount); // Deposit function
    await expect(accountPage.getTransactionMessage()).toContainText('Deposit Successful'); // Assertion for successful deposit
    console.log('Deposit of', depositAmount, 'is successful');
    await attachScreenshot(page, testInfo, 'valid-deposit'); // Screenshot Successful Deposit

    // Open Transaction history and validate the Deposit transaction
    await accountPage.openTransactions();
    const transactionRow = await accountPage.getTransactionRow();
    const transactionCol = transactionRow.locator('td');

    // Assertions in Transaction history page
    await expect(transactionRow).toHaveCount(1);
    await expect(transactionCol.first()).toContainText(dateTimeNow);
    await expect(transactionCol.nth(1)).toContainText(depositAmount.toString());
    await expect(transactionCol.nth(2)).toContainText(testData.type.credit);
    console.log('Transaction verified');
    await attachScreenshot(page, testInfo, 'transaction-history-deposit'); // Screenshot Transaction History of Deposit
  });

  test('Verify if user is able to complete a invalid deposit transaction.', async ({ page }, testInfo) => {
    const accountPage = new AccountPage(page);

    // Deposit empty amount
    await accountPage.depositInvalid();
    console.log('Clicked Deposit with empty Amount');

    // Get browser validation message from Page Object
    const message = await accountPage.getDepositValidationMessage();
    console.log('Browser validation message:', message);
    const allowedMessages = ['Please fill out this field.', 'Please enter a number.', 'Fill out this field'];
    expect(allowedMessages).toContain(message);
    await attachScreenshot(page, testInfo, 'invalid-deposit'); // Screenshot invalid deposit
  });

});

// WITHDRAW TRANSACTION VALIDATIONS
test('Verify if user is able to complete a withdraw transaction.', async ({ page }, testInfo) => {
  const accountPage = new AccountPage(page);
  const depositAmount = testData.deposit.amount2; // Get amount from test data to deposit
  const withdrawAmount = testData.withdraw.amount1; // Get amount from test data to withdraw

  // Deposit amount first
  await accountPage.deposit(depositAmount); // Deposit function
  console.log('Deposit of', depositAmount, 'is successful');

  // Get the initial balance
  const balanceBefore = await accountPage.getBalance();
  expect(balanceBefore).toBe(depositAmount.toString()); // Check value of initial balance
  await attachScreenshot(page, testInfo, 'before-withdraw-balance'); // Screenshot of initial balance

  // Withdraw amount
  await accountPage.withdraw(withdrawAmount); // Withdraw function
  await expect(accountPage.getTransactionMessage()).toContainText('Transaction successful'); // Assertion for successful withdraw
  console.log('Withdraw of', withdrawAmount, 'is successful');

  // Validate the remaining balance
  const balanceAfter = await accountPage.getBalance();
  const remainingBalance = depositAmount - withdrawAmount; // Compute remaining balance
  expect(balanceAfter).toBe(remainingBalance.toString());
  console.log('Remaining balance is', remainingBalance);
  await attachScreenshot(page, testInfo, 'after-withdraw-balance'); // Screenshot of remaining balance
});
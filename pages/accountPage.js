const { expect } = require('@playwright/test');

class AccountPage {
  constructor(page) {
    this.page = page;

    // Transaction Options
    this.transactionOption = page.locator('button[ng-click="transactions()"]');
    this.depositOption = page.locator('button[ng-click="deposit()"]');
    this.withdrawOption = page.locator('button[ng-click="withdrawl()"]');

    // For Deposit
    this.depositAmountArea = page.locator('form[ng-submit="deposit()"]');
    this.depositAmountInput = this.depositAmountArea.locator('input[placeholder="amount"]');
    this.depositSubmitButton = this.depositAmountArea.locator('button[type="submit"]');

    // For Withdraw
    this.withdrawAmountArea = page.locator('form[ng-submit="withdrawl()"]');
    this.withdrawAmountInput = this.withdrawAmountArea.locator('input[placeholder="amount"]');
    this.withdrawSubmitButton = this.withdrawAmountArea.locator('button[type="submit"]');

    // For Transaction History
    this.transactionRows = page.locator('table tbody tr');
    this.transactionBackBtn = page.locator('button[ng-click="back()"]');

    // Balance section
    this.balanceValue = page.locator('div.center > strong').nth(1);
  }

  // MESSAGING
  getTransactionMessage() {
    return this.page.locator('span[ng-show="message"]');
  }

  // DEPOSIT METHODS
  async deposit(amount) {
    await this.depositOption.click();
    await this.depositAmountInput.fill(amount.toString());
    await this.depositSubmitButton.click();
  }

  async depositInvalid() {
    await this.depositOption.click();
    await this.depositAmountInput.fill('');
    await this.depositSubmitButton.click();
  }

  async getDepositValidationMessage() {
    return await this.depositAmountInput.evaluate(el => el.validationMessage);
  }

  // WITHDRAW METHOD
  async withdraw(amount) {
    await this.withdrawOption.click();
    await expect(this.withdrawAmountArea).toBeVisible(); // expect() has built-in retry logic
    await this.withdrawAmountInput.fill(amount.toString());
    await this.withdrawSubmitButton.click();
  }

  // TRANSACTION HISTORY METHODS
  async openTransactions() {
    await this.transactionOption.click();
  }

  // Transaction history new row validation with retry
  async getLatestTransactionRow(maxRetries = 3) {
    let row;
    for (let i = 0; i < maxRetries; i++) {
      await this.openTransactions();

      const rowsCount = await this.transactionRows.count();

      if (rowsCount > 0) {
        row = this.transactionRows.nth(rowsCount - 1); // get last row
        const firstCell = await row.locator('td').first().textContent();
        if (firstCell && firstCell.trim() !== '') {
          return row; // row is ready
        }
      }

      console.log(`Transaction row not ready, retry ${i + 1}...`);
      await this.transactionBackBtn.click();
      await this.page.waitForTimeout(500);
    }

    throw new Error('Transaction row never appeared after retries');
  }

  // BALANCE METHOD
  async getBalance() {
    const balance = await this.balanceValue.textContent();
    return balance.trim();
  }
}

module.exports = AccountPage;
const {expect} = require('@playwright/test');
class LoginPage {

 constructor(page){
   this.page = page;
   this.customerLogin = page.locator('button[ng-click="customer()"]');
   this.selectUser = page.locator('#userSelect');
   this.loginBtn = page.getByRole('button', { name: 'Login' });
   this.welcomeText = page.locator('strong');
   this.welcomeTextName = this.welcomeText.locator('span[class="fontBig ng-binding"]');
 }

 async navigate(){
   await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
 }

 async login(username){
   await this.customerLogin.click();
   await this.selectUser.selectOption({ label: username });
   await this.loginBtn.click();
   await expect(this.welcomeTextName).toContainText(username);
 }

}

module.exports = LoginPage;
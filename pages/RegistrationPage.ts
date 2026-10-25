
import type { Page, Locator, FrameLocator } from '@playwright/test';


type UserData = {

firstname: string;
lastname: string;
email: string;
password: string;
birthdate?: string;

};



export class RegistrationPage {
  readonly page: Page;
readonly input_firstname: Locator;
readonly input_lastname: Locator;
readonly input_email: Locator;
readonly input_password: Locator;
readonly input_birthdate: Locator;
readonly radio_mr: Locator;
readonly radio_mrs: Locator;
readonly checkbox_terms: Locator;
readonly checkbox_privacy: Locator;
readonly checkbox_partnerOffers: Locator;
readonly checkbox_newsletter: Locator;
readonly button_createAccount: Locator;
readonly shop: FrameLocator;



  constructor(page: Page) {
    this.page = page;
    this.shop = page.frameLocator('#framelive');
    this.input_firstname = this.shop.locator('#field-firstname');
    this.input_lastname = this.shop.locator('#field-lastname');
    this.input_email = this.shop.locator('#field-email');
    this.input_password = this.shop.locator('#field-password');
    this.input_birthdate = this.shop.locator('#field-birthday');
    this.radio_mr = this.shop.locator('#field-id_gender-1');
    this.radio_mrs = this.shop.locator('#field-id_gender_2');
    this.checkbox_terms = this.shop.locator('#field-psgdpr');
    this.checkbox_privacy = this.shop.locator('#field-customer_privacy');
    this.checkbox_partnerOffers = this.shop.locator('#field-optin');
    this.checkbox_newsletter = this.shop.locator('#field-newsletter');
    this.button_createAccount = this.shop.getByRole('button', {name: 'Create account'});




  }

//Successul registration required fields

  async fill_inputFields(userData: UserData){
    await this.input_firstname.fill(userData.firstname);
    await this.input_lastname.fill(userData.lastname);
    await this.input_email.fill(userData.email);
    await this.input_password.fill(userData.password);
    if (userData.birthdate !== undefined) {
  await this.input_birthdate.fill(userData.birthdate);
}
   

  }

  async acceptRequiredConsents() {
  await this.checkbox_terms.check();
  await this.checkbox_privacy.check();
}

async submitRegistration() {
  await this.button_createAccount.click();
}

//Optional fields

async selectMr() {
  await this.radio_mr.check();
}

async selectMrs() {
  await this.radio_mrs.check();
}

async subscribeToNewsletter() {
  await this.checkbox_newsletter.check();
}

async acceptPartnerOffers() {
  await this.checkbox_partnerOffers.check();
}


//Open page Registration form

async open() {
  await this.page.goto('https://demo.prestashop.com/#/en/front');

  const signIn = this.shop.getByRole('link', { name: 'Sign in' });
  await signIn.first().click();

  const createAccount = this.shop.getByRole('link', {
    name: 'Create your account'
  });
  await createAccount.click();
}


//Signout

async signOut() {
  await this.shop.locator('#userMenuButton').click();
    await this.shop
    .locator('[aria-labelledby="userMenuButton"]')
    .getByRole('link', { name: 'Sign out' })
    .click();
}

//Back to Registration

async openRegistrationForm() {
  await this.shop.getByRole('link', {
    name: 'Sign in'
  }).first().click();

  await this.shop.getByRole('link', {
    name: 'Create your account'
  }).click();
}
}





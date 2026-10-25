import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';


test.describe('Registration', () => {
let registrationPage: RegistrationPage;

test.beforeEach(async ({page}) => {

registrationPage = new RegistrationPage(page);
await registrationPage.open();

});

// Successful registration

test ('Registration of a user with valid required data', async ({page}) => {

//Test steps
const userData = {
    firstname: 'Ana',
    lastname: 'Test',
    email: `ana.test.${Date.now()}@example.com`,
    password: 'TestPassword123!'
};

await registrationPage.fill_inputFields(userData);
await registrationPage.acceptRequiredConsents();
await registrationPage.submitRegistration();



await expect(
  registrationPage.shop.locator('#userMenuButton')
).toBeVisible();

await expect(
  registrationPage.shop.locator('#userMenuButton')
).toContainText(`${userData.firstname} ${userData.lastname}`);



});


//Empty fields required

test('Registration with empty required fields', async () => {

await registrationPage.submitRegistration();

 await expect(
    registrationPage.shop.locator('#field-firstname:invalid')
  ).toBeVisible();

  await expect(
    registrationPage.shop.locator('#field-lastname:invalid')
  ).toBeVisible();

  await expect(
    registrationPage.shop.locator('#field-email:invalid')
  ).toBeVisible();

  await expect(
    registrationPage.shop.locator('#field-password:invalid')
  ).toBeVisible();

  await expect(
    registrationPage.shop.locator('#field-psgdpr:invalid')
  ).toBeVisible();

  await expect(
    registrationPage.shop.locator('#field-customer_privacy:invalid')
  ).toBeVisible();

  await expect(
    registrationPage.button_createAccount
  ).toBeVisible();


});

//Registration with an already used mail

test('Registration with an already used mail', async () => {

    const userData = {
firstname: 'Elenor',
lastname: 'Test',
email: `elenor.test.${Date.now()}@example.com`,
password: 'TestPassword123456'

    };

    //Account creation

    await registrationPage.fill_inputFields(userData);
    await registrationPage.acceptRequiredConsents();
    await registrationPage.submitRegistration();

     await expect(
    registrationPage.shop.locator('#userMenuButton')
  ).toContainText(`${userData.firstname} ${userData.lastname}`);


  //Signout and open the registration

  await registrationPage.signOut();
  await registrationPage.openRegistrationForm();

  //Retry to register with same data

    await registrationPage.fill_inputFields(userData);
  await registrationPage.acceptRequiredConsents();
  await registrationPage.submitRegistration();

  await expect(
    registrationPage.shop.getByRole('alert')
  ).toHaveText(
    'The email is already used, please choose another one or sign in'
  );

});

//Weak password registration

test('Registration with a weak password', async () => {

    const userData = {
        firstname: 'Elenor',
        lastname: 'Test',
        email: `elenor.test.${Date.now()}@example.com`,
        password: 'aaaaaaaa'
    };



await registrationPage.fill_inputFields(userData);
await registrationPage.acceptRequiredConsents();


await expect(
  registrationPage.shop.locator('#field-password:invalid')
).toBeVisible({ timeout: 15000 });

await registrationPage.submitRegistration();


await expect(registrationPage.input_password)
  .toHaveValue(userData.password);

await expect(
  registrationPage.shop.locator('#field-password:invalid')
).toBeVisible();




});

//Invalid email format

test('Registration with an invalid email format', async () => {

    const userData = {
        firstname: 'Elenor',
        lastname: 'Test',
        email: 'elenor.test.gmail.com',
        password: 'Testpassword123!'
    };

    await registrationPage.fill_inputFields(userData);
    await registrationPage.acceptRequiredConsents();
    await registrationPage.submitRegistration();

    await expect(
        registrationPage.shop.locator('#field-email:invalid')).toBeVisible();
});


//Registration without required consents

test('Registration without required consents', async () => {

    const userData = {
        firstname: 'Elenor',
        lastname: 'Test',
        email: `elenor.test.${Date.now()}@example.com`,
        password: 'TestPassword123!'
    };

    await registrationPage.fill_inputFields(userData);

    await registrationPage.submitRegistration();

    await expect(
        registrationPage.shop.locator('#field-psgdpr:invalid')).toBeVisible();
    


})


});
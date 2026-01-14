"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smscHeadlessLoginLegacy = smscHeadlessLoginLegacy;
const n8n_workflow_1 = require("n8n-workflow");
const otplib_1 = require("otplib");
const playwright_1 = require("playwright");
async function firstVisibleSelector(page, selectors) {
    for (const selector of selectors) {
        const locator = page.locator(selector).first();
        try {
            if (await locator.isVisible()) {
                return locator;
            }
        }
        catch {
        }
    }
    return null;
}
async function handleClassicTotp(page, totpSecret, node) {
    const authAppButton = await firstVisibleSelector(page, [
        '#twoFaChooser button:has-text("Authenticator")',
        '#twoFaChooser button:has-text("Authentificator")',
        '#twoFaChooser button:has-text("Authenticator app")',
        '#twoFaChooser button:has-text("App")',
        '#twoFaChooser .login-app__button',
    ]);
    if (authAppButton) {
        await authAppButton.click();
    }
    const totpInput = await firstVisibleSelector(page, [
        '#twoFaChooser input',
        'input[placeholder*="six" i]',
        'input[placeholder*="chiffres" i]',
        'input[aria-label*="six" i]',
        'input[aria-label*="chiffres" i]',
        'input[name*="google2fa" i]',
        'input[name*="otp" i]',
        'input[name*="token" i]',
        'input[name*="code" i]',
        'input[id*="google2fa" i]',
        'input[id*="otp" i]',
        'input[id*="token" i]',
        'input[id*="code" i]',
        'input[type="tel"]',
    ]);
    if (!totpInput) {
        return false;
    }
    const normalizedSecret = totpSecret === null || totpSecret === void 0 ? void 0 : totpSecret.replace(/\s+/g, '');
    if (!normalizedSecret) {
        throw new n8n_workflow_1.NodeOperationError(node, 'TOTP is required but no TOTP secret was provided.');
    }
    const code = otplib_1.authenticator.generate(normalizedSecret);
    await totpInput.fill(code);
    const totpSubmit = await firstVisibleSelector(page, [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Connexion")',
        'button:has-text("Continuer")',
    ]);
    if (totpSubmit) {
        await totpSubmit.click();
    }
    else {
        await totpInput.press('Enter');
    }
    return true;
}
async function smscHeadlessLoginLegacy(creds) {
    const { domain, password, birthdate } = creds;
    const normalizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const headless = process.env.SMARTSCHOOL_HEADLESS !== '0';
    const browser = await playwright_1.chromium.launch({ headless });
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        userAgent: 'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.166 Safari/537.36',
    });
    const page = await context.newPage();
    await page.goto(`https://${normalizedDomain}/login`, { waitUntil: 'load' });
    const usernameInput = await firstVisibleSelector(page, [
        'input[name="username"]',
        'input[name="login"]',
        'input[name="user"]',
        'input[id="username"]',
        'input[id="login"]',
        'input[type="email"]',
        'input[type="text"]',
    ]);
    if (!usernameInput) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Could not find a username input on the Smartschool login page.');
    }
    await usernameInput.fill(creds.username);
    const passwordInput = await firstVisibleSelector(page, [
        'input[type="password"]',
        'input[name="password"]',
        'input[id="password"]',
    ]);
    if (!passwordInput) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Could not find a password input on the Smartschool login page.');
    }
    await passwordInput.fill(password);
    const submitButton = await firstVisibleSelector(page, [
        'button[type="submit"]',
        'input[type="submit"]',
        'button[name="login"]',
    ]);
    if (submitButton) {
        await submitButton.click();
    }
    else {
        await passwordInput.press('Enter');
    }
    try {
        await page.waitForSelector('#twoFaChooser, input[type="tel"], input[placeholder*="six" i], input[name*="otp" i]', { timeout: 30000 });
        await handleClassicTotp(page, creds.totpSecret, this.getNode());
    }
    catch {
    }
    const accountVerificationUrl = `https://${normalizedDomain}/account-verification`;
    const landingUrlPattern = new RegExp(`^https://${normalizedDomain}/`);
    const postLoginResult = await Promise.race([
        page.waitForURL(accountVerificationUrl, { timeout: 60000 }).then(() => 'account'),
        page.waitForURL(landingUrlPattern, { timeout: 60000 }).then(() => 'landing'),
    ]);
    if (postLoginResult === 'account') {
        await page.waitForSelector('input[type="date"]', { timeout: 15000 });
        await page.fill('input[type="date"]', birthdate.split('T')[0]);
        await page.click('button[type="submit"]');
        await page.waitForURL(landingUrlPattern, { timeout: 60000 });
    }
    const cookies = await context.cookies();
    let phpSess = null;
    const cookieParts = [];
    for (const cookie of cookies) {
        if (cookie.name === 'PHPSESSID' && cookie.domain === normalizedDomain) {
            phpSess = cookie;
        }
        if (cookie.domain === normalizedDomain || cookie.domain === `.${normalizedDomain}`) {
            cookieParts.push(`${cookie.name}=${cookie.value}`);
        }
    }
    const url = await page.locator('#datePickerMenu').first().getAttribute('plannerurl');
    const userId = url === null || url === void 0 ? void 0 : url.split('/')[4];
    await browser.close();
    if (!phpSess) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Login succeeded, but PHPSESSID cookie was not found.');
    }
    return {
        phpSessId: phpSess.value,
        userId,
        cookieHeader: cookieParts.join('; '),
    };
}
//# sourceMappingURL=smscHeadlessLogin.js.map
/* eslint-disable @n8n/community-nodes/no-restricted-imports, @n8n/community-nodes/no-restricted-globals, @typescript-eslint/no-explicit-any */
import type { IExecuteFunctions, INode } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { authenticator } from 'otplib';
import { chromium } from 'playwright';

type SmartSchoolPortalCredentials = {
	domain: string;
	username: string;
	password: string;
	birthdate: string;
	totpSecret?: string;
};

type SmartSchoolPortalSession = {
	phpSessId: string;
	userId?: string;
	cookieHeader: string;
};

async function firstVisibleSelector(page: any, selectors: string[]) {
	for (const selector of selectors) {
		const locator = page.locator(selector).first();
		try {
			if (await locator.isVisible()) {
				return locator;
			}
		} catch {
			// ignore selector errors
		}
	}
	return null;
}

async function handleClassicTotp(page: any, totpSecret: string | undefined, node: INode) {
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

	const normalizedSecret = totpSecret?.replace(/\s+/g, '');
	if (!normalizedSecret) {
		throw new NodeOperationError(node, 'TOTP is required but no TOTP secret was provided.');
	}

	const code = authenticator.generate(normalizedSecret);
	await totpInput.fill(code);

	const totpSubmit = await firstVisibleSelector(page, [
		'button[type="submit"]',
		'input[type="submit"]',
		'button:has-text("Connexion")',
		'button:has-text("Continuer")',
	]);
	if (totpSubmit) {
		await totpSubmit.click();
	} else {
		await totpInput.press('Enter');
	}

	return true;
}

export async function smscHeadlessLoginLegacy(
	this: IExecuteFunctions,
	creds: SmartSchoolPortalCredentials,
): Promise<SmartSchoolPortalSession> {
	const { domain, password, birthdate } = creds;
	const normalizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');

	const headless = process.env.SMARTSCHOOL_HEADLESS !== '0';
	const browser = await chromium.launch({ headless });
	const context = await browser.newContext({
		ignoreHTTPSErrors: true,
		userAgent:
			'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.166 Safari/537.36',
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
		throw new NodeOperationError(
			this.getNode(),
			'Could not find a username input on the Smartschool login page.',
		);
	}

	await usernameInput.fill(creds.username);

	const passwordInput = await firstVisibleSelector(page, [
		'input[type="password"]',
		'input[name="password"]',
		'input[id="password"]',
	]);

	if (!passwordInput) {
		throw new NodeOperationError(
			this.getNode(),
			'Could not find a password input on the Smartschool login page.',
		);
	}

	await passwordInput.fill(password);

	const submitButton = await firstVisibleSelector(page, [
		'button[type="submit"]',
		'input[type="submit"]',
		'button[name="login"]',
	]);

	if (submitButton) {
		await submitButton.click();
	} else {
		await passwordInput.press('Enter');
	}

	try {
		await page.waitForSelector(
			'#twoFaChooser, input[type="tel"], input[placeholder*="six" i], input[name*="otp" i]',
			{ timeout: 30000 },
		);
		await handleClassicTotp(page, creds.totpSecret, this.getNode());
	} catch {
		// no MFA step
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
	let phpSess: any = null;
	const cookieParts: string[] = [];

	for (const cookie of cookies) {
		if (cookie.name === 'PHPSESSID' && cookie.domain === normalizedDomain) {
			phpSess = cookie;
		}
		if (cookie.domain === normalizedDomain || cookie.domain === `.${normalizedDomain}`) {
			cookieParts.push(`${cookie.name}=${cookie.value}`);
		}
	}

	const url = await page.locator('#datePickerMenu').first().getAttribute('plannerurl');
	const userId = url?.split('/')[4];

	await browser.close();

	if (!phpSess) {
		throw new NodeOperationError(this.getNode(), 'Login succeeded, but PHPSESSID cookie was not found.');
	}

	return {
		phpSessId: phpSess.value,
		userId,
		cookieHeader: cookieParts.join('; '),
	};
}

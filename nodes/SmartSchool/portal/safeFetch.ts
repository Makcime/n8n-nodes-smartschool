import { NodeOperationError, type IExecuteFunctions } from 'n8n-workflow';

export async function safeFetch(
	this: IExecuteFunctions,
	url: string,
	options: RequestInit,
): Promise<Response> {
	try {
		const response = await fetch(url, options);

		if (response.status === 403) {
			throw new NodeOperationError(
				this.getNode(),
				`HTTP error! You are probably using an invalid User ID. Status: ${response.status}`,
			);
		}

		if (response.status >= 500) {
			throw new NodeOperationError(
				this.getNode(),
				`HTTP error! Smartschool server seems to be down or unreachable. Status: ${response.status}`,
			);
		}

		if (response.redirected) {
			throw new NodeOperationError(
				this.getNode(),
				`Session seems invalid; redirected to ${response.url}. Are you using a valid PHPSESSID?`,
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}

		throw new NodeOperationError(
			this.getNode(),
			`Failed to fetch Smartschool data: ${(error as Error).message} (are you connected to the internet?)`,
		);
	}
}

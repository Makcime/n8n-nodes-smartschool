import type { INodePropertyOptions } from 'n8n-workflow';

export const ACCOUNT_STATUS_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Active (Actief)', value: 'actief' },
	{ name: 'Active (Active)', value: 'active' },
	{ name: 'Active (Enabled)', value: 'enabled' },
	{ name: 'Inactive (Inactief)', value: 'inactief' },
	{ name: 'Inactive (Inactive)', value: 'inactive' },
	{ name: 'Inactive (Disabled)', value: 'disabled' },
	{ name: 'Administrative (Administrative)', value: 'administrative' },
	{ name: 'Administrative (Administratief)', value: 'administratief' },
];

export const VISIBILITY_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Visible', value: 1 },
	{ name: 'Hidden', value: 0 },
];

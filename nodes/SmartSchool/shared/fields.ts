import type { INodePropertyOptions } from 'n8n-workflow';

export const ACCOUNT_STATUS_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Active (actief)', value: 'actief' },
	{ name: 'Active (active)', value: 'active' },
	{ name: 'Active (enabled)', value: 'enabled' },
	{ name: 'Inactive (inactief)', value: 'inactief' },
	{ name: 'Inactive (inactive)', value: 'inactive' },
	{ name: 'Inactive (disabled)', value: 'disabled' },
	{ name: 'Administrative (administrative)', value: 'administrative' },
	{ name: 'Administrative (administratief)', value: 'administratief' },
];

export const VISIBILITY_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Visible', value: 1 },
	{ name: 'Hidden', value: 0 },
];

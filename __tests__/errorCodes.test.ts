import { describe, expect, it } from 'vitest';

import { SMARTSCHOOL_ERROR_CODES } from '../nodes/SmartSchool/shared/errorCodes';

describe('SMARTSCHOOL_ERROR_CODES', () => {
	it('maps known codes to messages', () => {
		expect(SMARTSCHOOL_ERROR_CODES[1]).toBe('The surname must be at least 2 characters long.');
		expect(SMARTSCHOOL_ERROR_CODES[57]).toContain('Timetable code');
	});
});

import { allocatePatientId, isFormattedPatientId, patientInitials } from './patient-id';

describe('patient ID format', () => {
  it('uses first and last name initials', () => {
    expect(patientInitials('Suhana Yadav')).toBe('SY');
    expect(patientInitials('Neha Kumari Yadav')).toBe('NY');
  });

  it('creates initials + unique 3 digits + registration year suffix', async () => {
    const executor = { execute: jest.fn(async () => [[{ id: 'SY10026' }]]) };
    const id = await allocatePatientId(executor, 'Suhana Yadav', new Date('2026-07-22'));
    expect(id).toMatch(/^SY\d{3}26$/);
    expect(id).not.toBe('SY10026');
    expect(isFormattedPatientId(id)).toBe(true);
  });
});

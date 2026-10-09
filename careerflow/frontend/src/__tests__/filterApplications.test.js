import { describe, it, expect } from 'vitest';
import { filterApplications } from '../utils/filterApplications';

describe('filterApplications', () => {
  const sampleApps = [
    { _id: '1', company: 'Google', position: 'Frontend Engineer', status: 'Applied' },
    { _id: '2', company: 'Meta', position: 'Full Stack Engineer', status: 'Interview' },
    { _id: '3', company: 'Amazon', position: 'Backend Engineer', status: 'Selected' },
    { _id: '4', company: 'Netflix', position: 'DevOps Engineer', status: 'Rejected' },
    { _id: '5', company: 'Apple', position: 'Software Engineer', status: 'Applied' },
  ];

  it('returns all applications when status is "All" and search is empty', () => {
    const result = filterApplications(sampleApps, '', 'All');
    expect(result).toHaveLength(5);
  });

  it('filters applications by status correctly', () => {
    const applied = filterApplications(sampleApps, '', 'Applied');
    expect(applied).toHaveLength(2);
    expect(applied.map((a) => a._id)).toEqual(['1', '5']);

    const interview = filterApplications(sampleApps, '', 'Interview');
    expect(interview).toHaveLength(1);
    expect(interview[0].company).toBe('Meta');
  });

  it('filters applications by search query in company (case-insensitive)', () => {
    const result = filterApplications(sampleApps, 'meta', 'All');
    expect(result).toHaveLength(1);
    expect(result[0].company).toBe('Meta');
  });

  it('filters applications by search query in position (case-insensitive)', () => {
    const result = filterApplications(sampleApps, 'FRONTEND', 'All');
    expect(result).toHaveLength(1);
    expect(result[0].company).toBe('Google');
  });

  it('filters by both status and search query simultaneously', () => {
    const result = filterApplications(sampleApps, 'Engineer', 'Applied');
    expect(result).toHaveLength(2);
    expect(result.map((a) => a._id)).toEqual(['1', '5']);

    const noMatch = filterApplications(sampleApps, 'DevOps', 'Applied');
    expect(noMatch).toHaveLength(0);
  });

  it('returns empty array when applications array is empty', () => {
    expect(filterApplications([], 'query', 'All')).toHaveLength(0);
  });
});

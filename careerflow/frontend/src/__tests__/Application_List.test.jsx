import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Application_List from '../components/Application_List';

describe('Application_List', () => {
  it('renders empty-state message when applications array is empty', () => {
    render(<Application_List applications={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('No applications found')).toBeInTheDocument();
  });

  it('renders a card for each application in the array', () => {
    const apps = [
      { _id: '1', company: 'Google', position: 'SWE 1', status: 'Applied', applicationDate: '2025-01-01' },
      { _id: '2', company: 'Amazon', position: 'SDE 2', status: 'Interview', applicationDate: '2025-01-02' },
    ];
    render(<Application_List applications={apps} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('SWE 1')).toBeInTheDocument();
    expect(screen.getByText('SDE 2')).toBeInTheDocument();
  });
});

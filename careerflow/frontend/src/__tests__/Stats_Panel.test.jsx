import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Stats_Panel from '../components/Stats_Panel';

describe('Stats_Panel', () => {
  it('displays loading message when loading is true', () => {
    render(<Stats_Panel loading={true} stats={null} error={null} />);
    expect(screen.getByText('Loading statistics…')).toBeInTheDocument();
  });

  it('displays error message when error is provided', () => {
    render(<Stats_Panel loading={false} stats={null} error="Failed to load statistics" />);
    expect(screen.getByText('Failed to load statistics')).toBeInTheDocument();
  });

  it('renders all 5 stat cards with counts when stats is provided', () => {
    const stats = { total: 10, applied: 4, interview: 3, selected: 2, rejected: 1 };
    render(<Stats_Panel loading={false} stats={stats} error={null} />);

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();

    expect(screen.getByText('Interview')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

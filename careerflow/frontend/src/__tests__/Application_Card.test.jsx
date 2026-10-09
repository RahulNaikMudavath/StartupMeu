import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Application_Card from '../components/Application_Card';

describe('Application_Card', () => {
  const application = {
    _id: 'app-123',
    company: 'Acme Corp',
    position: 'Staff Engineer',
    status: 'Interview',
    applicationDate: '2025-03-01T00:00:00.000Z',
  };

  it('renders company, position, status, and formatted date', () => {
    render(<Application_Card application={application} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('Staff Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
  });

  it('calls onEdit with the application object when Edit is clicked', () => {
    const handleEdit = vi.fn();
    render(<Application_Card application={application} onEdit={handleEdit} onDelete={() => {}} />);

    const editBtn = screen.getByRole('button', { name: /edit application/i });
    fireEvent.click(editBtn);

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(application);
  });

  it('calls onDelete with the application id when Delete is clicked', () => {
    const handleDelete = vi.fn();
    render(<Application_Card application={application} onEdit={() => {}} onDelete={handleDelete} />);

    const deleteBtn = screen.getByRole('button', { name: /delete application/i });
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('app-123');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Application_Form from '../components/Application_Form';

describe('Application_Form', () => {
  it('renders all form inputs', () => {
    render(<Application_Form onSubmit={() => {}} editTarget={null} />);

    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/application date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('displays validation errors and prevents submit when required fields are blank', () => {
    const handleSubmit = vi.fn();
    render(<Application_Form onSubmit={handleSubmit} editTarget={null} />);

    fireEvent.click(screen.getByRole('button', { name: /add application/i }));

    expect(screen.getByText('Company name is required.')).toBeInTheDocument();
    expect(screen.getByText('Position is required.')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error when jobUrl is invalid', () => {
    const handleSubmit = vi.fn();
    render(<Application_Form onSubmit={handleSubmit} editTarget={null} />);

    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/position/i), { target: { value: 'Engineer' } });
    fireEvent.change(screen.getByLabelText(/job url/i), { target: { value: 'not-a-valid-url' } });

    fireEvent.click(screen.getByRole('button', { name: /add application/i }));

    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when validation passes', () => {
    const handleSubmit = vi.fn();
    render(<Application_Form onSubmit={handleSubmit} editTarget={null} />);

    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/position/i), { target: { value: 'Backend Dev' } });
    fireEvent.change(screen.getByLabelText(/application date/i), { target: { value: '2025-05-10' } });
    fireEvent.change(screen.getByLabelText(/job url/i), { target: { value: 'https://acme.com/jobs/1' } });
    fireEvent.change(screen.getByLabelText(/notes/i), { target: { value: 'Looking forward' } });

    fireEvent.click(screen.getByRole('button', { name: /add application/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      company: 'Acme Corp',
      position: 'Backend Dev',
      status: 'Applied',
      applicationDate: '2025-05-10',
      jobUrl: 'https://acme.com/jobs/1',
      notes: 'Looking forward',
    });
  });

  it('pre-populates form fields when editTarget is provided', () => {
    const editTarget = {
      _id: 'edit-1',
      company: 'Existing Corp',
      position: 'Senior Dev',
      status: 'Interview',
      applicationDate: '2025-02-15T00:00:00.000Z',
      jobUrl: 'https://existing.com',
      notes: 'Had initial call',
    };

    render(<Application_Form onSubmit={() => {}} editTarget={editTarget} />);

    expect(screen.getByLabelText(/company/i)).toHaveValue('Existing Corp');
    expect(screen.getByLabelText(/position/i)).toHaveValue('Senior Dev');
    expect(screen.getByLabelText(/status/i)).toHaveValue('Interview');
    expect(screen.getByLabelText(/application date/i)).toHaveValue('2025-02-15');
    expect(screen.getByLabelText(/job url/i)).toHaveValue('https://existing.com');
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Had initial call');
  });
});

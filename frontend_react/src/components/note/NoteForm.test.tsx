import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteForm from './NoteFrom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('./AudioRecorder', () => ({
  __esModule: true,
  default: ({ onAudioChange }: { onAudioChange: (blob: Blob | null) => void }) => (
    <div data-testid="audio-recorder">
      <button onClick={() => onAudioChange(new Blob())}>Record Audio</button>
    </div>
  )
}));

describe('NoteForm', () => {
  const mockOnSubmit = jest.fn();
  const initialValues = {
    title: 'Test Title',
    description: 'Test Description',
    audio: 'test-audio-url',
    created_at: '2024-01-01'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create form correctly', () => {
    render(
      <BrowserRouter>
        <NoteForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    expect(screen.getByText('🎙️ Create Your Note')).toBeInTheDocument();
    expect(screen.getByLabelText(/Give your note a title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add some details/i)).toBeInTheDocument();
    expect(screen.getByTestId('audio-recorder')).toBeInTheDocument();
  });

  test('renders edit form with initial values', () => {
    render(
      <BrowserRouter>
        <NoteForm initialValues={initialValues} onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    expect(screen.getByText('🎙️ Edit Your Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    render(
      <BrowserRouter>
        <NoteForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Give your note a title/i), {
      target: { value: 'New Title' }
    });
    fireEvent.change(screen.getByLabelText(/Add some details/i), {
      target: { value: 'New Description' }
    });

    fireEvent.click(screen.getByText('Record Audio'));

    const form = screen.getByTestId('note-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Title',
        description: 'New Description',
        audio: expect.any(Blob),
        created_at: ''
      });
    });
  });


  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <NoteForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Save Note'));

    const titleInput = screen.getByLabelText(/Give your note a title/i);
    const descriptionInput = screen.getByLabelText(/Add some details/i);

    expect(titleInput).toBeRequired();
    expect(descriptionInput).toBeRequired();
  });
}); 
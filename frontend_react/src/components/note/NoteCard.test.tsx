import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteCard from './NoteCard';
import { QueryClient, QueryClientProvider } from 'react-query';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockNote = {
  id: 1,
  title: 'Test Note',
  description: 'Test Description',
  audio: 'test-audio-url',
  created_at: '2024-01-01',
};

const mockHandleDelete = jest.fn();

let queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

jest.mock("src/services/api/notes/getMedia", () => ({
  useGetMedia: () => ({
    mutate: (url: string, { onSuccess }: any) => {
      onSuccess({ data: { base64_audio: 'aGVsbG8=' } });
    }
  })
}));

describe('NoteCard', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    jest.clearAllMocks();
    window.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  test('renders note details correctly', () => {
    render(
      <NoteCard note={mockNote} handleDelete={mockHandleDelete} />,
      //@ts-ignore
      { wrapper: Wrapper }
    );

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Play audio')).toBeInTheDocument();
  });

  test('handles note deletion', () => {
    render(
      <NoteCard note={mockNote} handleDelete={mockHandleDelete} />,
      //@ts-ignore
      { wrapper: Wrapper }
    );

    const deleteButton = screen.getByLabelText('Delete Note');
    fireEvent.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalledWith(1);
  });

  test('navigates to edit page on card click', () => {
    render(
      <NoteCard note={mockNote} handleDelete={mockHandleDelete} />,
      //@ts-ignore
      { wrapper: Wrapper }
    );
    //@ts-ignore
    const card = screen.getByText('Test Note').closest('div');
    fireEvent.click(card!);

    expect(mockNavigate).toHaveBeenCalledWith('/notes/1');
  });

  test('renders no audio state when audio is not provided', () => {
    const noteWithoutAudio = { ...mockNote, audio: undefined };
    render(
      <NoteCard note={noteWithoutAudio} handleDelete={mockHandleDelete} />,
      //@ts-ignore
      { wrapper: Wrapper }
    );

    expect(screen.getByText('No audio')).toBeInTheDocument();
    expect(screen.getByLabelText('No audio')).toBeInTheDocument();
  });

  test('handles audio play/pause', () => {
    const mockPlay = jest.fn();
    const mockPause = jest.fn();
    window.HTMLMediaElement.prototype.play = mockPlay;
    window.HTMLMediaElement.prototype.pause = mockPause;

    render(
      <NoteCard note={mockNote} handleDelete={mockHandleDelete} />,
      //@ts-ignore
      { wrapper: Wrapper }
    );

    const playButton = screen.getByLabelText('Play audio');
    fireEvent.click(playButton);
    expect(mockPlay).toHaveBeenCalled();
    expect(screen.getByText('Playing...')).toBeInTheDocument();

    const pauseButton = screen.getByLabelText('Pause audio');
    fireEvent.click(pauseButton);
    expect(mockPause).toHaveBeenCalled();
    expect(screen.getByText('Play audio')).toBeInTheDocument();
  });

  test('handles audio end event', () => {
    render(
      <NoteCard note={mockNote} handleDelete={mockHandleDelete} />,
      //@ts-ignore
      { wrapper: Wrapper }
    );

    const playButton = screen.getByLabelText('Play audio');
    fireEvent.click(playButton);
    expect(screen.getByText('Playing...')).toBeInTheDocument();

    const audio = screen.getByTestId('audio-element');
    fireEvent.ended(audio);
    expect(screen.getByText('Play audio')).toBeInTheDocument();
  });
}); 
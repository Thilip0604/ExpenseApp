import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Expense Tracker heading', () => {
  render(<App />);
  const heading = screen.getByText(/expense tracker/i);
  expect(heading).toBeInTheDocument();
});
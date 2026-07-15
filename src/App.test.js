import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Paradise Spa login', () => {
  render(<App />);
  const loginButton = screen.getByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});

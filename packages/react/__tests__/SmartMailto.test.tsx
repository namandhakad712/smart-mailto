import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockParseMailto = vi.fn();
const mockIsValidMailtoParams = vi.fn();
const mockResolveProviders = vi.fn();
const mockSpawnModal = vi.fn();
const mockInitSmartMailto = vi.fn(() => vi.fn());

vi.mock('@smart-mailto/core', () => ({
  parseMailto: (...args: unknown[]) => mockParseMailto(...args),
  isValidMailtoParams: (...args: unknown[]) => mockIsValidMailtoParams(...args),
  resolveProviders: (...args: unknown[]) => mockResolveProviders(...args),
  spawnModal: (...args: unknown[]) => mockSpawnModal(...args),
  initSmartMailto: (...args: unknown[]) => mockInitSmartMailto(...args),
  destroySmartMailto: vi.fn(),
  updateConfig: vi.fn(),
}));

import { SmartMailto } from '../src/SmartMailto';
import { SmartMailtoProvider, useSmartMailto } from '../src/SmartMailtoProvider';

beforeEach(() => {
  vi.clearAllMocks();
  mockParseMailto.mockReturnValue({ to: ['test@example.com'] });
  mockIsValidMailtoParams.mockReturnValue(true);
  mockResolveProviders.mockReturnValue({
    providers: [{ id: 'gmail', name: 'Gmail', buildUrl: () => 'https://mail.google.com' }],
    detectedRegion: 'global',
    signals: {
      timeZone: 'UTC',
      locale: 'en-US',
      locales: [],
      isMobile: false,
      isIOS: false,
      isAndroid: false,
    },
    detectedFromEmail: null,
  });
});

describe('SmartMailto', () => {
  it('renders an anchor with the given href', () => {
    render(<SmartMailto href="mailto:test@example.com">Email me</SmartMailto>);
    const link = screen.getByText('Email me');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    expect(link).toHaveAttribute('data-smart-mailto', 'true');
  });

  it('renders children', () => {
    render(
      <SmartMailto href="mailto:a@b.com">
        <span data-testid="child">content</span>
      </SmartMailto>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('content');
  });

  it('forwards extra anchor props', () => {
    render(
      <SmartMailto href="mailto:x@y.com" className="btn" id="contact-link">
        Contact
      </SmartMailto>,
    );
    const link = screen.getByText('Contact');
    expect(link).toHaveClass('btn');
    expect(link).toHaveAttribute('id', 'contact-link');
  });

  it('calls parseMailto and spawnModal on click for valid mailto:', async () => {
    const user = userEvent.setup();
    render(<SmartMailto href="mailto:test@example.com">Send</SmartMailto>);

    await user.click(screen.getByText('Send'));

    expect(mockParseMailto).toHaveBeenCalledWith('mailto:test@example.com');
    expect(mockIsValidMailtoParams).toHaveBeenCalled();
    expect(mockResolveProviders).toHaveBeenCalled();
    expect(mockSpawnModal).toHaveBeenCalled();
  });

  it('does not call spawnModal for invalid mailto params', async () => {
    mockIsValidMailtoParams.mockReturnValue(false);
    const user = userEvent.setup();

    render(<SmartMailto href="mailto:">Broken</SmartMailto>);

    await user.click(screen.getByText('Broken'));

    expect(mockSpawnModal).not.toHaveBeenCalled();
  });

  it('calls onClick prop when provided', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <SmartMailto href="mailto:a@b.com" onClick={onClick}>
        Click
      </SmartMailto>,
    );

    await user.click(screen.getByText('Click'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onShow lifecycle hook when modal is shown', async () => {
    const onShow = vi.fn();
    const user = userEvent.setup();

    render(
      <SmartMailto href="mailto:a@b.com" onShow={onShow}>
        Show
      </SmartMailto>,
    );

    await user.click(screen.getByText('Show'));

    expect(onShow).toHaveBeenCalledTimes(1);
  });

  it('passes config props through to resolveProviders', async () => {
    const user = userEvent.setup();

    render(
      <SmartMailto
        href="mailto:a@b.com"
        theme="dark"
        preferredProvider="protonmail"
        maxProviders={4}
      >
        Config
      </SmartMailto>,
    );

    await user.click(screen.getByText('Config'));

    expect(mockResolveProviders).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        theme: 'dark',
        preferredProvider: 'protonmail',
        maxProviders: 4,
      }),
    );
  });
});

describe('SmartMailtoProvider', () => {
  it('renders children', () => {
    render(
      <SmartMailtoProvider>
        <div data-testid="child">hello</div>
      </SmartMailtoProvider>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  it('calls initSmartMailto on mount', () => {
    render(
      <SmartMailtoProvider theme="dark">
        <div>content</div>
      </SmartMailtoProvider>,
    );
    expect(mockInitSmartMailto).toHaveBeenCalledTimes(1);
    expect(mockInitSmartMailto).toHaveBeenCalledWith({ theme: 'dark' });
  });
});

describe('useSmartMailto', () => {
  it('throws when used outside SmartMailtoProvider', () => {
    function TestComponent() {
      useSmartMailto();
      return null;
    }

    expect(() => render(<TestComponent />)).toThrow(
      '[smart-mailto] useSmartMailto must be used within a <SmartMailtoProvider>.',
    );
  });

  it('returns context when inside SmartMailtoProvider', () => {
    let contextValue: unknown;
    function TestComponent() {
      contextValue = useSmartMailto();
      return null;
    }

    render(
      <SmartMailtoProvider theme="auto">
        <TestComponent />
      </SmartMailtoProvider>,
    );

    expect(contextValue).toBeDefined();
    expect(contextValue).toHaveProperty('config');
    expect(contextValue).toHaveProperty('open');
    expect(typeof (contextValue as Record<string, unknown>).open).toBe('function');
  });
});

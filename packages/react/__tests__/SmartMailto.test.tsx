import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockParseMailto = vi.fn();
const mockIsValidMailtoParams = vi.fn();
const mockResolveProviders = vi.fn();
const mockSpawnModal = vi.fn();
const mockBuildMailtoHref = vi.fn();
const mockDestroySmartMailto = vi.fn();
const mockInitSmartMailto = vi.fn(() => mockDestroySmartMailto);
const mockUpdateConfig = vi.fn();

vi.mock('@smart-mailto/core', () => ({
  parseMailto: (...args: unknown[]) => mockParseMailto(...args),
  buildMailtoHref: (...args: unknown[]) => mockBuildMailtoHref(...args),
  isValidMailtoParams: (...args: unknown[]) => mockIsValidMailtoParams(...args),
  resolveProviders: (...args: unknown[]) => mockResolveProviders(...args),
  spawnModal: (...args: unknown[]) => mockSpawnModal(...args),
  initSmartMailto: (...args: unknown[]) => mockInitSmartMailto(...args),
  destroySmartMailto: vi.fn(),
  updateConfig: (...args: unknown[]) => mockUpdateConfig(...args),
}));

import { SmartMailto } from '../src/SmartMailto';
import { SmartMailtoProvider, useSmartMailto } from '../src/SmartMailtoProvider';

beforeEach(() => {
  vi.clearAllMocks();
  mockParseMailto.mockReturnValue({ to: ['test@example.com'] });
  mockBuildMailtoHref.mockReturnValue('mailto:test@example.com');
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

  it('syncs primitive config changes without reinitializing', () => {
    const { rerender } = render(
      <SmartMailtoProvider includeCopy>
        <div>content</div>
      </SmartMailtoProvider>,
    );
    mockUpdateConfig.mockClear();

    rerender(
      <SmartMailtoProvider includeCopy={false}>
        <div>content</div>
      </SmartMailtoProvider>,
    );

    expect(mockUpdateConfig).toHaveBeenCalledTimes(1);
    expect(mockUpdateConfig).toHaveBeenCalledWith({ includeCopy: false });
    expect(mockInitSmartMailto).toHaveBeenCalledTimes(1);
  });

  it('clears config values when their props are removed', () => {
    const { rerender } = render(
      <SmartMailtoProvider preferredProvider="gmail">
        <div>content</div>
      </SmartMailtoProvider>,
    );
    mockUpdateConfig.mockClear();

    rerender(
      <SmartMailtoProvider>
        <div>content</div>
      </SmartMailtoProvider>,
    );

    expect(mockUpdateConfig).toHaveBeenCalledTimes(1);
    expect(mockUpdateConfig).toHaveBeenCalledWith({ preferredProvider: undefined });
    expect(mockInitSmartMailto).toHaveBeenCalledTimes(1);
  });

  it('syncs object config changes without reinitializing', () => {
    const { rerender } = render(
      <SmartMailtoProvider i18n={{ title: 'Choose a provider' }}>
        <div>content</div>
      </SmartMailtoProvider>,
    );
    mockUpdateConfig.mockClear();

    rerender(
      <SmartMailtoProvider i18n={{ title: 'Choisissez un fournisseur' }}>
        <div>content</div>
      </SmartMailtoProvider>,
    );

    expect(mockUpdateConfig).toHaveBeenCalledTimes(1);
    expect(mockUpdateConfig).toHaveBeenCalledWith({
      i18n: { title: 'Choisissez un fournisseur' },
    });
    expect(mockInitSmartMailto).toHaveBeenCalledTimes(1);
  });

  it('syncs lifecycle callback changes and cleans up once', () => {
    const firstOnOpen = vi.fn();
    const nextOnOpen = vi.fn();
    const { rerender, unmount } = render(
      <SmartMailtoProvider onOpen={firstOnOpen}>
        <div>content</div>
      </SmartMailtoProvider>,
    );
    mockUpdateConfig.mockClear();

    rerender(
      <SmartMailtoProvider onOpen={nextOnOpen}>
        <div>content</div>
      </SmartMailtoProvider>,
    );

    expect(mockUpdateConfig).toHaveBeenCalledTimes(1);
    expect(mockUpdateConfig).toHaveBeenCalledWith({ onOpen: nextOnOpen });
    expect(mockInitSmartMailto).toHaveBeenCalledTimes(1);

    unmount();
    expect(mockDestroySmartMailto).toHaveBeenCalledTimes(1);
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

  it('opens with an address only', async () => {
    function TestComponent() {
      const { open } = useSmartMailto();
      return <button onClick={() => open('hello@example.com')}>Open</button>;
    }

    const user = userEvent.setup();
    render(
      <SmartMailtoProvider>
        <TestComponent />
      </SmartMailtoProvider>,
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(mockParseMailto).toHaveBeenNthCalledWith(1, 'mailto:hello@example.com');
      expect(mockBuildMailtoHref).toHaveBeenCalledWith({ to: ['test@example.com'] });
      expect(mockSpawnModal).toHaveBeenCalled();
    });
  });

  it('passes subject and body through the encoded mailto parameters', async () => {
    const { buildMailtoHref, parseMailto } =
      await vi.importActual<typeof import('@smart-mailto/core')>('@smart-mailto/core');
    const messageParams = {
      to: ['hello@example.com'],
      subject: 'Hi & welcome?',
      body: 'Line one\nLine two + details',
    };
    const encodedHref =
      'mailto:hello@example.com?subject=Hi%20%26%20welcome%3F&body=Line%20one%0ALine%20two%20%2B%20details';
    mockParseMailto.mockImplementation(parseMailto);
    mockBuildMailtoHref.mockImplementation(buildMailtoHref);

    function TestComponent() {
      const { open } = useSmartMailto();
      return (
        <button
          onClick={() =>
            open('hello@example.com', {
              subject: messageParams.subject,
              body: messageParams.body,
            })
          }
        >
          Open
        </button>
      );
    }

    const user = userEvent.setup();
    render(
      <SmartMailtoProvider>
        <TestComponent />
      </SmartMailtoProvider>,
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(mockBuildMailtoHref).toHaveBeenCalledWith(messageParams);
      expect(mockParseMailto).toHaveBeenNthCalledWith(2, encodedHref);
      expect(mockResolveProviders).toHaveBeenCalledWith(messageParams, {});
      expect(mockSpawnModal).toHaveBeenCalledWith(messageParams, expect.anything(), {});
    });
  });

  it('keeps picker overrides out of the mailto parameters', async () => {
    mockParseMailto.mockReturnValueOnce({ to: ['hello@example.com'] }).mockReturnValueOnce({
      to: ['hello@example.com'],
      subject: 'Hi',
      body: 'Details',
    });

    function TestComponent() {
      const { open } = useSmartMailto();
      return (
        <button
          onClick={() =>
            open('hello@example.com', {
              subject: 'Hi',
              body: 'Details',
              theme: 'dark',
              preferredProvider: 'protonmail',
            })
          }
        >
          Open
        </button>
      );
    }

    const user = userEvent.setup();
    render(
      <SmartMailtoProvider maxProviders={4}>
        <TestComponent />
      </SmartMailtoProvider>,
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(mockBuildMailtoHref).toHaveBeenCalledWith({
        to: ['hello@example.com'],
        subject: 'Hi',
        body: 'Details',
      });
      expect(mockResolveProviders).toHaveBeenCalledWith(expect.anything(), {
        maxProviders: 4,
        theme: 'dark',
        preferredProvider: 'protonmail',
      });
      expect(mockSpawnModal).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
        maxProviders: 4,
        theme: 'dark',
        preferredProvider: 'protonmail',
      });
    });
  });
});

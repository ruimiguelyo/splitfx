import { fireEvent, render, screen } from '@testing-library/react';
import { CommandMenu } from './CommandMenu';

function renderMenu(isOpen = true) {
  const props = {
    isOpen,
    onClose: jest.fn(),
    onOpenLab: jest.fn(),
  };

  return { ...render(<CommandMenu {...props} />), props };
}

describe('CommandMenu', () => {
  it('renders nothing while closed', () => {
    renderMenu(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focuses its close control, handles Escape, and restores focus on cleanup', () => {
    const previous = document.createElement('button');
    document.body.append(previous);
    previous.focus();

    const { props, unmount } = renderMenu();
    expect(screen.getByRole('button', { name: /close quick navigation/i })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(props.onClose).toHaveBeenCalledTimes(1);
    unmount();
    expect(previous).toHaveFocus();
    previous.remove();
  });

  it('closes from the backdrop and explicit close button, but not from the dialog surface', () => {
    const { props } = renderMenu();
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement;

    expect(backdrop).not.toBeNull();
    fireEvent.mouseDown(dialog);
    expect(props.onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(backdrop!);
    fireEvent.click(screen.getByRole('button', { name: /close quick navigation/i }));
    expect(props.onClose).toHaveBeenCalledTimes(2);
  });

  it('opens the product and external GitHub profile from their actions', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { props } = renderMenu();

    fireEvent.click(screen.getByRole('button', { name: /explore splitfx/i }));
    expect(props.onOpenLab).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /^github/i }));
    expect(open).toHaveBeenCalledWith(
      'https://github.com/ruimiguelyo',
      '_blank',
      'noopener,noreferrer',
    );
    open.mockRestore();
  });

  it('scrolls to the requested portfolio sections after closing', () => {
    jest.useFakeTimers();
    const scrollIntoView = jest.fn();
    const work = document.createElement('section');
    const about = document.createElement('section');
    work.id = 'work';
    about.id = 'about';
    Object.defineProperty(work, 'scrollIntoView', { value: scrollIntoView });
    Object.defineProperty(about, 'scrollIntoView', { value: scrollIntoView });
    document.body.append(work, about);

    const { props } = renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /featured case study/i }));
    fireEvent.click(screen.getByRole('button', { name: /experience & education/i }));
    jest.runOnlyPendingTimers();

    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(props.onClose).toHaveBeenCalled();

    work.remove();
    about.remove();
    jest.useRealTimers();
  });
});

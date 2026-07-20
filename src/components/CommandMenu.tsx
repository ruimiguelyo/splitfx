import { useEffect, useRef } from 'react';
import { profile } from '../content/profile';
import { trapTabKey } from './dialogFocus';
import { Icon, type IconName } from './Icon';

interface CommandMenuProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpenLab: () => void;
}

export function CommandMenu({ isOpen, onClose, onOpenLab }: CommandMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (dialogRef.current) {
        trapTabKey(event, dialogRef.current);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const jump = (hash: string) => {
    window.setTimeout(
      () => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }),
      0,
    );
  };

  const actions: Array<{ label: string; detail: string; icon: IconName; action: () => void }> = [
    {
      label: 'Explore SplitFX',
      detail: 'Interactive product demo',
      icon: 'spark',
      action: onOpenLab,
    },
    {
      label: 'Featured case study',
      detail: 'Problem, decisions, proof',
      icon: 'code',
      action: () => jump('#work'),
    },
    {
      label: 'Experience & education',
      detail: 'Deloitte and IPS',
      icon: 'users',
      action: () => jump('#about'),
    },
    {
      label: 'GitHub',
      detail: '@ruimiguelyo',
      icon: 'github',
      action: () => window.open(profile.links.github, '_blank', 'noopener,noreferrer'),
    },
    {
      label: 'LinkedIn',
      detail: 'Connect with Rui',
      icon: 'linkedin',
      action: () => window.open(profile.links.linkedin, '_blank', 'noopener,noreferrer'),
    },
  ];

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="command-title"
        aria-modal="true"
        className="command-menu"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="command-menu__header">
          <div>
            <span className="eyebrow">Navigate the portfolio</span>
            <h2 id="command-title">Where do you want to go?</h2>
          </div>
          <button
            aria-label="Close quick navigation"
            className="icon-button"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="command-list">
          {actions.map(({ action, detail, icon, label }) => (
            <button
              className="command-item"
              key={label}
              onClick={() => {
                onClose();
                action();
              }}
              type="button"
            >
              <span className="command-item__icon">
                <Icon name={icon} />
              </span>
              <span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
              <Icon name="arrow" size={18} />
            </button>
          ))}
        </div>
        <p className="command-menu__hint">
          <kbd>Esc</kbd> to close · keyboard-first by design
        </p>
      </section>
    </div>
  );
}

import { profile } from '../content/profile';
import { Icon } from './Icon';

interface SiteHeaderProps {
  readonly onOpenCommand: () => void;
  readonly onOpenLab: () => void;
}

export function SiteHeader({ onOpenCommand, onOpenLab }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a aria-label="Rui Sá — back to top" className="brand" href="#top">
        <span className="brand__mark">RS</span>
        <span className="brand__name">Rui Sá</span>
      </a>
      <nav aria-label="Primary navigation" className="site-nav">
        <a href="#work">Work</a>
        <a href="#approach">Approach</a>
        <a href="#about">About</a>
      </nav>
      <div className="header-actions">
        <button
          aria-label="Open quick navigation"
          className="command-trigger"
          onClick={onOpenCommand}
          type="button"
        >
          <span>Quick jump</span>
          <kbd>Ctrl K</kbd>
        </button>
        <button className="header-lab-button" onClick={onOpenLab} type="button">
          Open SplitFX <Icon name="arrow" size={16} />
        </button>
      </div>
      <a className="header-contact" href={profile.links.linkedin} rel="noreferrer" target="_blank">
        <Icon name="linkedin" size={18} />
        <span className="sr-only">Contact Rui on LinkedIn</span>
      </a>
    </header>
  );
}

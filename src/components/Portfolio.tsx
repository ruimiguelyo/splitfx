import { profile } from '../content/profile';
import { Button } from './Button';
import { HeroPreview } from './HeroPreview';
import { Icon } from './Icon';
import { SiteHeader } from './SiteHeader';

interface PortfolioProps {
  readonly onOpenCommand: () => void;
  readonly onOpenLab: () => void;
}

const stack = [
  'React 19',
  'TypeScript 6',
  'Redux Toolkit',
  'Webpack 5',
  'Jest',
  'Cypress',
  'Testing Library',
];

export function Portfolio({ onOpenCommand, onOpenLab }: PortfolioProps) {
  return (
    <div className="portfolio" data-testid="portfolio" id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader onOpenCommand={onOpenCommand} onOpenLab={onOpenLab} />

      <main id="main-content">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero__copy">
            <div className="availability-pill">
              <span aria-hidden="true" />
              {profile.availability}
            </div>
            <h1 id="hero-title">
              Complex logic.
              <br />
              <em>Clear interface.</em>
            </h1>
            <p className="hero__lead">
              I’m {profile.displayName}, a product-minded frontend engineer in Portugal. I turn
              demanding workflows into clear, tested interfaces with accessibility in mind.
            </p>
            <div className="hero__actions">
              <Button icon="arrow" onClick={onOpenLab}>
                Explore the live product
              </Button>
              <a className="text-link" href="#work">
                Read the case study <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero__social-proof" aria-label="Profile highlights">
              <div>
                <strong>4+ years</strong>
                <span>professional delivery</span>
              </div>
              <div>
                <strong>2027</strong>
                <span>Computer Engineering student · expected 2027</span>
              </div>
              <div>
                <strong>Product × code</strong>
                <span>from problem to tested UI</span>
              </div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
            <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
            <HeroPreview />
            <aside className="hero-note hero-note--top" aria-label="Design annotation">
              <span>01</span>
              <p>One decision per screen. The numbers explain themselves.</p>
            </aside>
            <aside className="hero-note hero-note--bottom" aria-label="Engineering annotation">
              <span>02</span>
              <p>Integer money maths. Tested states. No hand-waving.</p>
            </aside>
          </div>
        </section>

        <section aria-label="Technology used" className="stack-rail">
          <div className="stack-rail__label">
            <Icon name="code" size={18} /> Built with the target stack
          </div>
          <div className="stack-rail__track">
            {[...stack, ...stack].map((item, index) => (
              <span aria-hidden={index >= stack.length} key={`${item}-${index}`}>
                {item} <i>✦</i>
              </span>
            ))}
          </div>
        </section>

        <section className="case-study section-shell" id="work" aria-labelledby="work-title">
          <header className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">01 · Featured product</p>
              <h2 id="work-title">SplitFX</h2>
            </div>
            <p>
              A cross-currency group expense prototype that turns messy conversions into a compact,
              transparent settlement plan.
            </p>
          </header>

          <div className="case-hero">
            <div className="case-hero__copy">
              <span className="case-kicker">High-trust money UX</span>
              <h3>Fairness should never feel like a black box.</h3>
              <p>
                Group expenses are easy until currencies, rounding, expired quotes, and uneven
                shares collide. SplitFX shows every conversion, keeps money in minor units, and
                explains why each person pays what they do.
              </p>
              <Button icon="spark" onClick={onOpenLab} variant="dark">
                Launch interactive demo
              </Button>
            </div>
            <div className="case-hero__visual" aria-hidden="true">
              <div className="settle-flow">
                <span className="settle-person settle-person--one">MK</span>
                <span className="settle-person settle-person--two">AN</span>
                <span className="settle-person settle-person--three">SO</span>
                <span className="settle-person settle-person--centre">RS</span>
                <span className="settle-line settle-line--one">
                  <i>€38.44</i>
                </span>
                <span className="settle-line settle-line--two">
                  <i>€89.44</i>
                </span>
                <span className="settle-line settle-line--three">
                  <i>€211.21</i>
                </span>
              </div>
              <div className="case-floating-card">
                <span>
                  <Icon name="shield" size={16} /> Transparent by default
                </span>
                <strong>1 GBP = 1.1628 EUR</strong>
                <small>Demo quote · expires in 04:58</small>
              </div>
            </div>
          </div>

          <div className="case-grid">
            <article className="case-card case-card--problem">
              <span className="case-card__number">01</span>
              <Icon name="users" />
              <h3>Define the real problem</h3>
              <p>
                The hard part is not arithmetic. It is helping four people trust a result they did
                not calculate themselves.
              </p>
              <ul>
                <li>Mixed-currency expenses</li>
                <li>Fair remainder distribution</li>
                <li>Explainable settlements</li>
              </ul>
            </article>
            <article className="case-card case-card--system">
              <span className="case-card__number">02</span>
              <Icon name="receipt" />
              <h3>Design every state</h3>
              <p>
                The demo treats stale rates and network loss as product states, not technical
                footnotes.
              </p>
              <div className="state-pills" aria-label="Supported interface states">
                <span className="state-pill state-pill--live">Live</span>
                <span className="state-pill state-pill--loading">Refreshing</span>
                <span className="state-pill state-pill--expired">Expired</span>
                <span className="state-pill state-pill--offline">Offline</span>
              </div>
            </article>
            <article className="case-card case-card--proof">
              <span className="case-card__number">03</span>
              <Icon name="check" />
              <h3>Make quality inspectable</h3>
              <p>
                Domain invariants, reducer tests, user-level integration tests, and full browser
                flows run as CI gates.
              </p>
              <div className="proof-list">
                <span>
                  <b>Strict</b> TypeScript
                </span>
                <span>
                  <b>Unit</b> Jest
                </span>
                <span>
                  <b>E2E</b> Cypress
                </span>
              </div>
            </article>
          </div>
        </section>

        <section className="approach section-shell" id="approach" aria-labelledby="approach-title">
          <header className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">02 · How I build</p>
              <h2 id="approach-title">From ambiguity to evidence.</h2>
            </div>
            <p>
              A small product loop that keeps customer clarity, delivery speed, and engineering
              quality in the same conversation.
            </p>
          </header>

          <ol className="process-list">
            <li>
              <span>01</span>
              <div>
                <strong>Frame</strong>
                <p>Define the decision the interface must make easier.</p>
              </div>
              <small>Problem brief</small>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Prototype</strong>
                <p>Turn edge cases into visible, testable states early.</p>
              </div>
              <small>Interaction model</small>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Build</strong>
                <p>Keep domain rules independent from presentation details.</p>
              </div>
              <small>Typed architecture</small>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>Prove</strong>
                <p>Test the invariants and the journeys a customer actually sees.</p>
              </div>
              <small>Quality gates</small>
            </li>
          </ol>

          <div className="architecture-panel">
            <div className="architecture-panel__intro">
              <p className="eyebrow eyebrow--dark">Architecture at a glance</p>
              <h3>Simple boundaries. Honest complexity.</h3>
              <p>
                The UI can change without rewriting financial rules. The quote boundary can fail
                without erasing the last known calculation.
              </p>
            </div>
            <div
              className="architecture-flow"
              aria-label="Architecture: interface to Redux state to domain model to FX boundary"
            >
              <div>
                <span>01</span>
                <strong>Interface</strong>
                <small>React · accessible primitives</small>
              </div>
              <i>
                <Icon name="arrow" />
              </i>
              <div>
                <span>02</span>
                <strong>State</strong>
                <small>Redux Toolkit · explicit transitions</small>
              </div>
              <i>
                <Icon name="arrow" />
              </i>
              <div>
                <span>03</span>
                <strong>Domain</strong>
                <small>Minor units · pure functions</small>
              </div>
              <i>
                <Icon name="arrow" />
              </i>
              <div>
                <span>04</span>
                <strong>Boundary</strong>
                <small>FX quote · resilient failure</small>
              </div>
            </div>
          </div>
        </section>

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <header className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">03 · Background</p>
              <h2 id="about-title">Professional discipline. Fresh momentum.</h2>
            </div>
            <p>{profile.shortBio}</p>
          </header>

          <div className="about-grid">
            <article className="timeline-card">
              <header>
                <span>Experience</span>
                <small>4 years · 6 months</small>
              </header>
              {profile.experience.map((item) => (
                <div className="timeline-entry" key={item.company}>
                  <div className="timeline-entry__mark">
                    D<span>.</span>
                  </div>
                  <div>
                    <span className="timeline-entry__date">
                      {item.start} — {item.end}
                    </span>
                    <h3>{item.role}</h3>
                    <strong>
                      {item.company} · {item.location}
                    </strong>
                    <p>{item.summary}</p>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </article>
            <article className="timeline-card">
              <header>
                <span>Education</span>
                <small>IPS · Setúbal</small>
              </header>
              {profile.education.map((item, index) => (
                <div className="timeline-entry" key={item.qualification}>
                  <div className="timeline-entry__mark timeline-entry__mark--school">
                    {index === 0 ? 'BSc' : 'T5'}
                  </div>
                  <div>
                    <span className="timeline-entry__date">
                      {item.start ? `${item.start} — ` : ''}
                      {item.end}
                    </span>
                    <h3>{item.qualification}</h3>
                    <strong>{item.institution}</strong>
                  </div>
                </div>
              ))}
            </article>
          </div>
        </section>

        <section className="contact-section section-shell" aria-labelledby="contact-title">
          <div className="contact-card">
            <div>
              <p className="eyebrow eyebrow--dark">Let’s make the next thing unmistakably clear.</p>
              <h2 id="contact-title">
                Built to contribute.
                <br />
                Ready to grow.
              </h2>
            </div>
            <div className="contact-card__actions">
              <a
                className="button button--primary"
                href={profile.links.linkedin}
                rel="noreferrer"
                target="_blank"
              >
                <span>Contact Rui</span>
                <Icon name="linkedin" size={18} />
              </a>
              <a
                className="social-link"
                href={profile.links.github}
                rel="noreferrer"
                target="_blank"
              >
                <Icon name="github" /> GitHub <Icon name="arrow" size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div>
          <span className="brand__mark">RS</span>
          <strong>{profile.displayName}</strong>
        </div>
        <p>Designed and engineered in Portugal. Demo data only.</p>
        <span>© {new Date().getFullYear()} · Independent portfolio</span>
      </footer>
    </div>
  );
}

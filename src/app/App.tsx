import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { CommandMenu } from '../components/CommandMenu';
import { Portfolio } from '../components/Portfolio';
import { Icon } from '../components/Icon';

const SplitFxLab = lazy(async () => {
  const module = await import('../components/SplitFxLab');
  return { default: module.SplitFxLab };
});

type Route = 'portfolio' | 'splitfx';

function routeFromHash(): Route {
  return window.location.hash.startsWith('#/splitfx') ? 'splitfx' : 'portfolio';
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const syncRoute = () => {
      setRoute(routeFromHash());
      if (routeFromHash() === 'splitfx') window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    const openCommandMenu = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', openCommandMenu);
    return () => window.removeEventListener('keydown', openCommandMenu);
  }, []);

  const openLab = useCallback(() => {
    setIsCommandOpen(false);
    window.location.hash = '/splitfx';
  }, []);

  const openPortfolio = useCallback(() => {
    window.location.hash = 'top';
    setRoute('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {route === 'portfolio' ? (
        <Portfolio onOpenCommand={() => setIsCommandOpen(true)} onOpenLab={openLab} />
      ) : (
        <Suspense
          fallback={
            <div className="route-loader" role="status">
              <span>
                <Icon name="spark" />
              </span>
              <strong>Opening SplitFX</strong>
              <small>Loading the interactive product…</small>
            </div>
          }
        >
          <SplitFxLab onBack={openPortfolio} />
        </Suspense>
      )}
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenLab={openLab}
      />
    </>
  );
}

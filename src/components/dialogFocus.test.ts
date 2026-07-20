import { trapTabKey } from './dialogFocus';

function keydown(key: string, shiftKey = false) {
  return new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
}

describe('trapTabKey', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('ignores keys other than Tab', () => {
    const container = document.createElement('section');
    document.body.append(container);
    const event = keydown('Enter');

    trapTabKey(event, container);

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(document.body);
  });

  it('focuses the container when no visible focusable controls exist', () => {
    const container = document.createElement('section');
    container.tabIndex = -1;
    const hidden = document.createElement('button');
    hidden.hidden = true;
    const ariaHidden = document.createElement('button');
    ariaHidden.setAttribute('aria-hidden', 'true');
    container.append(hidden, ariaHidden);
    document.body.append(container);
    const event = keydown('Tab');

    trapTabKey(event, container);

    expect(event.defaultPrevented).toBe(true);
    expect(container).toHaveFocus();
  });

  it('wraps both edges and leaves focus alone between them', () => {
    const outside = document.createElement('button');
    const container = document.createElement('section');
    const first = document.createElement('button');
    const middle = document.createElement('input');
    const last = document.createElement('button');
    container.append(first, middle, last);
    document.body.append(outside, container);

    last.focus();
    const forwards = keydown('Tab');
    trapTabKey(forwards, container);
    expect(forwards.defaultPrevented).toBe(true);
    expect(first).toHaveFocus();

    first.focus();
    const backwards = keydown('Tab', true);
    trapTabKey(backwards, container);
    expect(backwards.defaultPrevented).toBe(true);
    expect(last).toHaveFocus();

    middle.focus();
    const inside = keydown('Tab');
    trapTabKey(inside, container);
    expect(inside.defaultPrevented).toBe(false);
    expect(middle).toHaveFocus();

    outside.focus();
    trapTabKey(keydown('Tab'), container);
    expect(first).toHaveFocus();

    outside.focus();
    trapTabKey(keydown('Tab', true), container);
    expect(last).toHaveFocus();
  });
});

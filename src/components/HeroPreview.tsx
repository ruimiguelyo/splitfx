import { formatMoney } from '../domain/money';
import { useAppSelector } from '../app/hooks';
import {
  selectParticipantMap,
  selectSettlementPlan,
  selectTripTotal,
} from '../features/splitfx/selectors';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export function HeroPreview() {
  const total = useAppSelector(selectTripTotal);
  const plan = useAppSelector(selectSettlementPlan);
  const participantMap = useAppSelector(selectParticipantMap);
  const firstTransfer = plan[0];
  const firstPayer = firstTransfer ? participantMap[firstTransfer.from] : undefined;
  const firstReceiver = firstTransfer ? participantMap[firstTransfer.to] : undefined;

  return (
    <div aria-label="SplitFX product preview" className="hero-preview">
      <div className="hero-preview__chrome">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="hero-preview__title">SplitFX · live prototype</span>
        <span className="live-pill">
          <span /> Current demo rate
        </span>
      </div>
      <div className="hero-preview__body">
        <div className="preview-heading">
          <div>
            <p className="eyebrow eyebrow--dark">Lisbon design weekend</p>
            <h2>Everyone leaves even.</h2>
          </div>
          <span className="preview-icon">
            <Icon name="spark" size={22} />
          </span>
        </div>
        <div className="preview-total-row">
          <div>
            <span>Group spend</span>
            <strong>{formatMoney(total)}</strong>
          </div>
          <div>
            <span>Settled in</span>
            <strong>{plan.length} transfers</strong>
          </div>
        </div>
        {firstTransfer ? (
          <div className="preview-transfer">
            <span className="preview-transfer__avatars">
              {firstPayer ? <Avatar participant={firstPayer} /> : null}
              <span className="preview-transfer__line">
                <Icon name="arrow" size={15} />
              </span>
              {firstReceiver ? <Avatar participant={firstReceiver} /> : null}
            </span>
            <span className="preview-transfer__copy">
              <small>Suggested next</small>
              <strong>
                {firstPayer?.name} pays {firstReceiver?.name}
              </strong>
            </span>
            <b>{formatMoney(firstTransfer.amount)}</b>
          </div>
        ) : null}
        <div className="preview-proof">
          <span>
            <Icon name="shield" size={16} /> Minor-unit maths
          </span>
          <span>
            <Icon name="check" size={16} /> Explainable split
          </span>
        </div>
      </div>
    </div>
  );
}

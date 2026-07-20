import type { Participant } from '../domain/settlements';

interface AvatarProps {
  readonly participant: Participant;
  readonly size?: 'small' | 'medium' | 'large';
}

export function Avatar({ participant, size = 'medium' }: AvatarProps) {
  return (
    <span
      aria-label={participant.name}
      className={`avatar avatar--${size}`}
      style={{ '--avatar-colour': participant.colour } as React.CSSProperties}
      title={participant.name}
    >
      {participant.initials}
    </span>
  );
}

export function AvatarStack({ participants }: { readonly participants: readonly Participant[] }) {
  return (
    <span aria-label={`${participants.length} people`} className="avatar-stack">
      {participants.map((participant) => (
        <Avatar key={participant.id} participant={participant} size="small" />
      ))}
    </span>
  );
}

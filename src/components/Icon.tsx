import type { SVGProps } from 'react';

export type IconName =
  | 'arrow'
  | 'back'
  | 'check'
  | 'close'
  | 'code'
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'minus'
  | 'plus'
  | 'receipt'
  | 'refresh'
  | 'shield'
  | 'spark'
  | 'users'
  | 'wifiOff';

interface IconProps extends SVGProps<SVGSVGElement> {
  readonly name: IconName;
  readonly size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="m8 4 8 8-8 8m7-8H3" />,
    back: <path d="m16 4-8 8 8 8M9 12h12" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    code: <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12" />,
    github: (
      <path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.5v-1.8c-2.7.6-3.3-1.1-3.3-1.1-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.6 0-1 .4-1.9 1-2.5-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.6 1 1.5 1 2.5 0 3.5-2.3 4.3-4.5 4.6.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z" />
    ),
    linkedin: (
      <>
        <path d="M5.2 8.1V19M5.2 5.1v.1M10.1 19v-6.2c0-2.6 4.7-2.8 4.7.2v6" />
        <path d="M10.1 8.1v2.1M19 19v-6.7c0-5.6-6.4-5.4-8.9-2.1" />
      </>
    ),
    mail: <path d="M3 6.5 12 13l9-6.5M4 5h16a1 1 0 0 1 1 1v12H3V6a1 1 0 0 1 1-1Z" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    receipt: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6" />,
    refresh: <path d="M20 7v5h-5M4 17v-5h5m10-1a7 7 0 0 0-12-4L4 10m1 3a7 7 0 0 0 12 4l3-3" />,
    shield: (
      <path d="M12 3 4.5 6v5.2c0 4.6 3.2 8.6 7.5 9.8 4.3-1.2 7.5-5.2 7.5-9.8V6L12 3Zm-3 9 2 2 4-5" />
    ),
    spark: (
      <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 14 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    ),
    users: (
      <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8" />
    ),
    wifiOff: (
      <path d="m3 3 18 18M8.5 8.5A9.8 9.8 0 0 1 21 10m-18 0a14 14 0 0 1 2.2-1.7M6 14a8.5 8.5 0 0 1 7-2m5 2a8.2 8.2 0 0 0-1.2-.9M9.5 17.5a3.6 3.6 0 0 1 5 0M12 21h.01" />
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

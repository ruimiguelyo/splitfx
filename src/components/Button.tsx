import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly icon?: IconName;
  readonly iconPosition?: 'start' | 'end';
  readonly variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
}

export function Button({
  children,
  className = '',
  icon,
  iconPosition = 'end',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button className={`button button--${variant} ${className}`.trim()} type={type} {...props}>
      {icon && iconPosition === 'start' ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
      {icon && iconPosition === 'end' ? <Icon name={icon} size={18} /> : null}
    </button>
  );
}

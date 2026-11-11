const variants = {
  primary:
    'bg-accent text-[#08090a] shadow-[0_0_0_1px_rgba(217,255,67,0.4),0_10px_40px_-12px_rgba(217,255,67,0.55)] hover:bg-white hover:shadow-[0_10px_44px_-10px_rgba(217,255,67,0.35)]',
  outline:
    'border border-white/15 bg-white/[0.02] text-ink hover:border-accent/50 hover:text-accent hover:bg-accent/[0.04]',
  ghost: 'text-muted hover:text-ink',
}

const sizes = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px]',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

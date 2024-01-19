import { cn } from '~/utils/css/css';

const bars = Array(12).fill(0);

export const Loader = ({ size = 20, className }: { size?: number, className?: string }) => {
  return (
    <div style={{ height: `${size}px`, width: `${size}px` }}>
      <div
        className={'relative left-1/2 top-1/2'}
        style={{ height: `${size}px`, width: `${size}px` }}>
        {bars.map((_, i) => (
          <div
            key={i}
            className={cn(
              'absolute -left-[10%] -top-[3.9%] h-[8%] w-[24%] animate-spinner-loading-bar bg-primary-foreground', className
            )}
            style={{
              transform: `rotate(${(i + 1) * 30}deg) translate(146%)`,
              animationDelay: `-${(bars.length - 1) * i * 0.1}s`,
            }}></div>
        ))}
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";

/** 24 spokes at 15° (Ashoka Chakra) */
const SPOKE_COUNT = 24;

const sizeMap = {
  sm: "h-[30px] w-[30px]",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

type AshokaChakraProps = {
  className?: string;
  size?: keyof typeof sizeMap;
  animate?: boolean;
};

export function AshokaChakra({ className, size = "md", animate = true }: AshokaChakraProps) {
  return (
    <svg
      className={cn(sizeMap[size], animate && "animate-ap-chakra", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="50" cy="50" r="8" stroke="#FF9933" strokeWidth="2" fill="none" />
      <g stroke="#FF9933" strokeWidth="2" strokeLinecap="round">
        {Array.from({ length: SPOKE_COUNT }, (_, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="30"
            transform={`rotate(${i * (360 / SPOKE_COUNT)} 50 50)`}
          />
        ))}
      </g>
    </svg>
  );
}

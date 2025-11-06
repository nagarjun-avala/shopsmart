import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // allow string aliases to avoid strict keyof mismatch with runtime exports
  name: IconName | string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}: IconProps) {
  // attempt multiple candidate keys to handle pluralization / alias differences
  const aliasMap: Record<string, string> = {
    MoonStars: "MoonStar",
    MoonStarsIcon: "MoonStar",
    Sunrize: "Sunrise",
    // add more known aliases here as needed
  };

  const toPascal = (s: string) =>
    s
      .replace(/[-_ ]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase());

  const candidates = [
    name,
    aliasMap[name],
    name.replace(/s$/, ""), // naive singular
    toPascal(name),
    toPascal(name).replace(/s$/, ""),
  ].filter(Boolean) as string[];

  let IconCandidate: React.ElementType | undefined;

  for (const cand of candidates) {
    const found = (LucideIcons as Record<string, unknown>)[cand];
    if (found) {
      IconCandidate = found as React.ElementType;
      break;
    }
  }


  if (!IconCandidate) {
    return (
      <HelpCircle
        size={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  const IconComponent = IconCandidate;

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
export default Icon;

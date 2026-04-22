import logoPng from '@/assets/RedHawkRobotics-logo-2026-red.png';
import logoSvg from '@/assets/RedHawkRobotics-logo.svg';

export function Logo() {
  return (
    <picture className="block h-full w-full">
      <source srcSet={logoSvg} type="image/svg+xml" />
      <img
        src={logoPng}
        alt="Red Hawk Robotics"
        className="h-full w-full object-contain"
      />
    </picture>
  );
}

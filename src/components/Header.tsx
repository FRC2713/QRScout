import { useQRScoutState } from '../store/store';

export function Header() {
  const title = useQRScoutState(state => state.formData.title);
  return (
    <head>
      <title>QRScout|{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </head>
  );
}

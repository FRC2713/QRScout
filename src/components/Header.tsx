import { Helmet } from 'react-helmet';
import { useQRScoutState } from '../store/store';

export function Header() {
  const page_title = useQRScoutState(state => state.formData.page_title);
  return (
    <Helmet>
      <title>QRScout | {page_title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Helmet>
  );
}

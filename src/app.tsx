import { useEffect } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Sections } from './components/Sections';
import { CommitAndResetSection } from './components/Sections/CommitAndResetSection/CommitAndResetSection';
import { ConfigSection } from './components/Sections/ConfigSection';
import { ThemeProvider } from './components/ThemeProvider';
import { useQRScoutState } from './store/store';

import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';
import { runStatsigAutoCapture } from '@statsig/web-analytics';
import { FloatingFormValue } from './components/FloatingFormValue';

export function App() {
  const { teamNumber, pageTitle } = useQRScoutState(state => ({
    teamNumber: state.formData.teamNumber,
    pageTitle: state.formData.page_title,
  }));
  const { client } = useClientAsyncInit(
    import.meta.env.VITE_STATSIG_CLIENT_KEY,
    {
      userID: `${teamNumber}`,
    },
  );

  useEffect(() => {
    runStatsigAutoCapture(client);
  }, [client]);

  return (
    <StatsigProvider client={client} loadingComponent={<div>Loading...</div>}>
      <ThemeProvider>
        <div className="min-h-screen py-2">
          <Header />
          <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <h1 className="font-sans text-6xl font-bold">
              <div className={`font-rhr text-primary`}>{pageTitle}</div>
            </h1>
            <FloatingFormValue />
            <form className="w-full px-4" onSubmit={e => e.preventDefault()}>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <Sections />
                <CommitAndResetSection />
                <ConfigSection />
              </div>
            </form>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </StatsigProvider>
  );
}

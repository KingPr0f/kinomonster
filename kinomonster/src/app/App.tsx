import { MainProvider } from './providers/MainProvider';
import { AppRouter } from './providers/AppRouter';

function App() {
  return (
    <MainProvider>
      <AppRouter />
    </MainProvider>
  );
}

export default App;
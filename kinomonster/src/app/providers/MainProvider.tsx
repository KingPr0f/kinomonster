import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store/store';

interface MainProviderProps {
  children: React.ReactNode;
}

export const MainProvider = ({ children }: MainProviderProps) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};
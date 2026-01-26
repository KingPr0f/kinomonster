import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
// import { Footer } from '@/widgets/footer/ui/Footer'; // Сделаешь позже

export const BaseLayout = () => {
  return (
    <div className="layout">
      <Header />
      <main>
        {/* Сюда будут подставляться страницы (Home, MovieDetails) */}
        <Outlet /> 
      </main>
      {/* <Footer /> */}
    </div>
  );
};
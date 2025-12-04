import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './pages/Home/Home';
import { About } from './pages/About/About';
import { NotFound } from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

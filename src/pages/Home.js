import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        <p className="home-desc">
          Unggah foto pepaya California untuk memperoleh hasil klasifikasi tingkat kematangan berbasis deep learning
        </p>
        <div className="home-btn-group">
          <button className="home-btn home-btn-primary" onClick={() => navigate('/klasifikasi')}>
            Mulai Klasifikasi
          </button>
          <button className="home-btn home-btn-secondary" onClick={() => navigate('/galeri')}>
            Galeri Pepaya California
          </button>
          <button className="home-btn home-btn-secondary" onClick={() => navigate('/riwayat')}>
            Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
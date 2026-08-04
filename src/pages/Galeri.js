import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import imgMatang from '../assets/matang.jpg';
import imgSetengahMatang from '../assets/setengah_matang.jpg';
import imgMentah from '../assets/mentah.jpg';
import './Galeri.css';

const GALERI_DATA = [
  { label: 'Matang', img: imgMatang },
  { label: 'Setengah Matang', img: imgSetengahMatang },
  { label: 'Mentah', img: imgMentah },
];

function Galeri() {
  const navigate = useNavigate();

  return (
    <div className="galeri-page">
      <Navbar />

      <main className="galeri-main">
        <div className="galeri-header">
          <h2 className="galeri-title">Galeri Pepaya California</h2>
          <button className="btn-kembali" onClick={() => navigate('/')}>← Beranda</button>
        </div>
        <p className="galeri-desc">Contoh tampilan pepaya California berdasarkan tingkat kematangan</p>

        <div className="galeri-grid">
          {GALERI_DATA.map((item) => (
            <div key={item.label} className="galeri-card">
              <img src={item.img} alt={item.label} className="galeri-img" />
              <p className="galeri-label">{item.label}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>PapayaCheck © 2026 — Skripsi Klasifikasi Tingkat Kematangan Pepaya California</p>
      </footer>
    </div>
  );
}

export default Galeri;
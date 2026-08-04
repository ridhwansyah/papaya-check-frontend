import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from './Navbar';
import './DetailRiwayat.css';

const CLASS_LABELS = {
  matang: 'Matang',
  mentah: 'Mentah',
  setengah_matang: 'Setengah Matang',
  bukan_pepaya: 'Bukan Pepaya',
};

function DetailRiwayat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const docRef = doc(db, 'riwayat', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Gagal ambil detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatTanggal = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return date.toLocaleString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="detail-page">
      <Navbar />

      <main className="detail-main">
        <button className="btn-kembali" onClick={() => navigate('/riwayat')}>
          ← Kembali ke Riwayat
        </button>

        {loading ? (
          <p className="detail-loading">Memuat detail...</p>
        ) : !item ? (
          <p className="detail-loading">Data tidak ditemukan.</p>
        ) : (
          <div className={`detail-card detail-${item.kelas}`}>
            {item.foto && (
              <img src={item.foto} alt="Foto pepaya" className="detail-foto" />
            )}
            <div className="detail-info">
              <h2 className="detail-kelas">{CLASS_LABELS[item.kelas] || item.kelas}</h2>

              <div className="confidence-bar-wrap">
                <div className="confidence-label">
                  <span>Confidence</span>
                  <span>{item.confidence}%</span>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
              </div>

              <div className="detail-meta">
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Tanggal</span>
                  <span className="detail-meta-value">{formatTanggal(item.createdAt)}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Nama File</span>
                  <span className="detail-meta-value">{item.namaFile}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>PapayaCheck © 2026 — Skripsi Klasifikasi Tingkat Kematangan Pepaya California</p>
      </footer>
    </div>
  );
}

export default DetailRiwayat;
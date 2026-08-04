import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import Navbar from './Navbar';
import './Riwayat.css';

const CLASS_LABELS = {
  matang: 'Matang',
  mentah: 'Mentah',
  setengah_matang: 'Setengah Matang',
  bukan_pepaya: 'Bukan Pepaya',
};

const ITEMS_PER_PAGE = 5;

function Riwayat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'riwayat'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRiwayatList(data);
    } catch (err) {
      console.error('Gagal ambil riwayat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'riwayat', deleteId));
      setRiwayatList((prev) => {
        const updated = prev.filter((item) => item.id !== deleteId);
        // Kalau halaman sekarang jadi kosong setelah hapus, mundur 1 halaman
        const totalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        return updated;
      });
      setDeleteId(null);
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const formatTanggal = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return date.toLocaleString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(riwayatList.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = riwayatList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="riwayat-page">
      <Navbar />

      <main className="riwayat-main">
        <div className="riwayat-header">
          <h2 className="riwayat-title">Riwayat Klasifikasi</h2>
          <button className="btn-kembali" onClick={() => navigate('/')}>← Beranda</button>
        </div>

        {loading ? (
          <p className="riwayat-empty">Memuat riwayat...</p>
        ) : riwayatList.length === 0 ? (
          <p className="riwayat-empty">Belum ada riwayat klasifikasi.</p>
        ) : (
          <>
            <div className="riwayat-list">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className={`riwayat-item riwayat-${item.kelas}`}
                  onClick={() => navigate(`/riwayat/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.foto && (
                    <img src={item.foto} alt="Foto" className="riwayat-foto" />
                  )}
                  <div className="riwayat-info">
                    <p className="riwayat-kelas">{CLASS_LABELS[item.kelas] || item.kelas}</p>
                    <p className="riwayat-confidence">Confidence: {item.confidence}%</p>
                    <p className="riwayat-tanggal">{formatTanggal(item.createdAt)}</p>
                    <p className="riwayat-namafile">{item.namaFile}</p>
                  </div>
                  <button
                    className="riwayat-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(item.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Hapus riwayat ini?</h2>
            <p className="modal-desc">Data yang dihapus tidak bisa dikembalikan</p>
            <div className="modal-btn-group">
              <button className="modal-btn modal-btn-cancel" onClick={() => setDeleteId(null)}>
                Batal
              </button>
              <button className="modal-btn modal-btn-hapus" onClick={handleDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>PapayaCheck © 2026 — Skripsi Klasifikasi Tingkat Kematangan Pepaya California</p>
      </footer>
    </div>
  );
}

export default Riwayat;
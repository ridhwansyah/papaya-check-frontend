import Navbar from './Navbar';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CLASS_LABELS = {
  matang: {
    label: 'Matang',
    desc: 'Pepaya pada gambar termasuk dalam kelas matang, yang ditandai dengan dominasi warna kuning (lebih dari 75%) pada permukaan kulit buah.',
  },
  mentah: {
    label: 'Mentah',
    desc: 'Pepaya pada gambar termasuk dalam kelas mentah, yang ditandai dengan dominasi warna hijau (lebih dari 75%) pada permukaan kulit buah.',
  },
  setengah_matang: {
    label: 'Setengah Matang',
    desc: 'Pepaya pada gambar termasuk dalam kelas setengah matang, dengan warna kuning pada permukaan kulit buah sekitar 25–74%.',
  },
  bukan_pepaya: {
    label: 'Bukan Pepaya',
    desc: null,
  },
};

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const compressImage = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX_SIZE = 800;
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = url;
  });
};

function Klasifikasi() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Ukuran file maksimal 3MB.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const simpanRiwayat = async (hasilPrediksi, base64Foto) => {
    try {
      await addDoc(collection(db, 'riwayat'), {
        uid: user.uid,
        kelas: hasilPrediksi.kelas,
        confidence: hasilPrediksi.confidence,
        namaFile: selectedFile.name,
        foto: base64Foto,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Gagal simpan riwayat:', err);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const [response, base64Foto] = await Promise.all([
        fetch('https://papayacheck.my.id/predict', { method: 'POST', body: formData }),
        compressImage(selectedFile),
      ]);
      const data = await response.json();
      setResult(data);
      await simpanRiwayat(data, base64Foto);
    } catch {
      setError('Gagal terhubung ke server. Pastikan Flask berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleKlasifikasiLagi = () => {
    fileInputRef.current.click();
  };

  const info = result ? CLASS_LABELS[result.kelas] : null;

  return (
    <div className="app">
      <Navbar />

      <main className="main">
        <div className="card">
          {/* Header row — hanya tampil saat belum ada preview */}
          {!preview && !result && (
            <div className="card-header-row">
              <div>
                <h2 className="card-title">Unggah Gambar</h2>
                <p className="card-desc">Unggah atau ambil foto pepaya untuk diklasifikasi</p>
              </div>
              <button className="btn-kembali-inline" onClick={() => navigate('/')}>
                ← Beranda
              </button>
            </div>
          )}

          {/* Judul saja saat preview tampil */}
          {preview && !result && (
            <div style={{ marginBottom: '14px' }}>
              <h2 className="card-title">Unggah Gambar</h2>
              <p className="card-desc">Unggah atau ambil foto pepaya untuk diklasifikasi</p>
            </div>
          )}

            {!result && (
            <div className="warning-box">
                ⚠️ Pastikan gambar adalah pepaya dan terlihat jelas
            </div>
            )}

          <div
            className={`dropzone ${preview ? 'has-preview' : ''}`}
            onClick={!preview ? () => fileInputRef.current.click() : undefined}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="preview-img" />
            ) : (
              <div className="dropzone-placeholder">
                <span className="dropzone-icon">📁</span>
                <p>Unggah atau seret foto pepaya ke sini</p>
                <p className="dropzone-hint">JPG, JPEG, PNG, WEBP — Maks. 3MB</p>
              </div>
            )}
          </div>

          {/* Sebelum preview: tombol kamera saja */}
          {!preview && (
            <div className="input-options">
              <button className="input-option-btn" onClick={() => cameraInputRef.current.click()}>
                📷 Ambil dari Kamera
              </button>
            </div>
          )}

          {/* Setelah preview & belum ada hasil: 2 tombol ganti */}
          {preview && !result && (
            <div className="input-options">
              <button className="input-option-btn" onClick={() => fileInputRef.current.click()}>
                📁 Ganti dari Galeri
              </button>
              <button className="input-option-btn" onClick={() => cameraInputRef.current.click()}>
                📷 Ganti dari Kamera
              </button>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div className="btn-group">
            {result ? (
              <button className="btn btn-primary" onClick={handleKlasifikasiLagi}>
                Klasifikasi Lagi
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handlePredict}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="spinner" /> Memproses...
                  </span>
                ) : (
                  'Klasifikasi'
                )}
              </button>
            )}
          </div>
        </div>

        {result && info && (
          <div className={`result-card result-${result.kelas}`}>
            <h2 className="result-label">{info.label}</h2>
{(info.desc || result.kelas !== 'bukan_pepaya') && (
  <div className="result-desc-box">
    {info.desc && (
      <p className="result-desc-text">{info.desc}</p>
    )}
    {result.kelas !== 'bukan_pepaya' && (
      <div className="result-referensi">
        <span className="result-referensi-label">Referensi:</span>
        <a href="https://repositori.uma.ac.id/jspui/bitstream/123456789/20291/1/178220009-%20Ahmad%20Daman%20Huri%20Rangkuti%20Fulltext.pdf" target="_blank" rel="noreferrer" className="result-referensi-link">[1]</a>
        <a href="https://journal.ipb.ac.id/jurnalagronomi/article/view/1678" target="_blank" rel="noreferrer" className="result-referensi-link">[2]</a>
      </div>
    )}
  </div>
)}
            {result.kelas === 'bukan_pepaya' && (
              <p className="bukan-pepaya-warning">
                Gambar tidak dikenali sebagai pepaya. Pastikan gambar Anda adalah buah pepaya dan terlihat jelas.
              </p>
            )}
            <div className="confidence-bar-wrap">
              <div className="confidence-label">
                <span>Confidence</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
            <div className="result-action-group">
              <button
                className="btn-lihat-riwayat"
                onClick={() => navigate('/riwayat')}
              >
                Lihat Riwayat
              </button>
              <button
                className="btn-beranda"
                onClick={() => navigate('/')}
              >
                Beranda
              </button>
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

export default Klasifikasi;
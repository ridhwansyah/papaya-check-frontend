import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../logo_pepaya.png';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="navbar-logo" />
            <div>
              <h1 className="navbar-title">PapayaCheck</h1>
              <p className="navbar-sub">Klasifikasi tingkat kematangan pepaya California</p>
            </div>
          </div>
          <button className="navbar-logout" onClick={() => setShowModal(true)}>
            Keluar
          </button>
        </div>
      </header>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Keluar dari akun?</h2>
            <p className="modal-desc">Kamu akan keluar dari PapayaCheck</p>
            <div className="modal-btn-group">
              <button className="modal-btn modal-btn-cancel" onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
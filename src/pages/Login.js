import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../logo_pepaya.png';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      alert('Login gagal. Coba lagi.');
    }
  };

  return (
    <div className="login">
      <div className="login-content">
        <img src={logo} alt="Logo PapayaCheck" className="login-logo" />
        <h1 className="login-title">PapayaCheck</h1>
        <p className="login-sub">Klasifikasi tingkat kematangan pepaya California</p>
        <p className="login-desc">Masuk untuk mulai menggunakan website dan menyimpan riwayat klasifikasi kamu</p>
        <button className="login-btn" onClick={handleLogin}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="login-google-icon"
          />
          Masuk dengan Google
        </button>
      </div>
    </div>
  );
}

export default Login;
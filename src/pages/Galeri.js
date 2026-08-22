import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import imgMatang from '../assets/matang.jpg';
import imgSetengahMatang from '../assets/setengah_matang.jpg';
import imgMentah from '../assets/mentah.jpg';
import './Galeri.css';

const GALERI_DATA = [
  {
    label: 'Matang',
    img: imgMatang,
    desc: 'Pepaya pada gambar termasuk dalam kelas matang, yang ditandai dengan dominasi warna kuning (lebih dari 75%) pada permukaan kulit buah.',
  },
  {
    label: 'Setengah Matang',
    img: imgSetengahMatang,
    desc: 'Pepaya pada gambar termasuk dalam kelas setengah matang, dengan warna kuning pada permukaan kulit buah berkisar antara 25-74%. Apabila persentase warna kuning kurang dari 25%, pepaya akan tergolong ke dalam kelas mentah, sedangkan apabila lebih dari 74%, pepaya akan tergolong ke dalam kelas matang.',
  },
  {
    label: 'Mentah',
    img: imgMentah,
    desc: 'Pepaya pada gambar termasuk dalam kelas mentah, yang ditandai dengan dominasi warna hijau (lebih dari 75%) pada permukaan kulit buah.',
  },
];

const INFO_CARDS = [
  {
    id: 'info1',
    content: 'Pepaya California merupakan varietas pepaya yang memiliki nama varietas Callina (IPB 9) dan merupakan hasil pemuliaan dari Institut Pertanian Bogor (IPB). Nama "California" bukan menunjukkan asal buah dari California, Amerika Serikat, tetapi merupakan nama yang lebih populer digunakan di pasaran. IPB menjelaskan bahwa Pepaya Callina IPB 9 yang masuk ke swalayan kemudian "diplesetkan menjadi Pepaya California", sehingga masyarakat menganggapnya berasal dari Amerika, padahal varietas tersebut merupakan hasil pemuliaan lokal dari IPB.',
    refs: [
      { label: '[1]', url: 'https://www.ipb.ac.id/news/index/2011/03/hatta-radjasa-cicipi-callina-02b9b55102f4d64a5b2eaa6a710390db/' },
      { label: '[2]', url: 'https://www.ipb.ac.id/news/index/2010/10/peluncuran-varietas-baru-ipb-sekaligus-curhat-petani-e37601af38eea630845dcdd1276a47d8/' },
    ],
  },
  {
    id: 'info2',
    content: 'Pepaya California memiliki kandungan gizi yang bermanfaat bagi kesehatan. Menurut Kurniawan (2022), pepaya memiliki kandungan vitamin C, kalium, dan asam folat yang menjadikannya buah yang bermanfaat bagi kesehatan. Melalui pengujian kuantitatif menggunakan metode spektrofotometri UV-Vis, penelitian tersebut menunjukkan bahwa buah Pepaya California memiliki kadar vitamin C sebesar 10,05%.',
    refs: [
      { label: '[1]', url: 'https://repository.umkla.ac.id/2838/' },
    ],
  },
  {
    id: 'info3',
    content: 'Menurut Kaukab, Mishra, dan Sunita (2025), CNN dapat digunakan untuk mengklasifikasikan tingkat kematangan buah dengan menganalisis fitur visual seperti warna, tekstur, dan bentuk. Dalam prosesnya, CNN secara otomatis mengekstraksi fitur secara bertingkat dari citra, seperti perubahan warna, variasi tekstur, dan karakteristik permukaan buah yang menjadi indikator tingkat kematangan. Konsep tersebut diterapkan pada model yang digunakan dalam website ini untuk mengenali tingkat kematangan pepaya, yaitu mentah, setengah matang, dan matang.',
    refs: [
      { label: '[1]', url: 'https://www.researchgate.net/publication/403803029_Application_of_Convolutional_Neural_Networks_for_Ripeness_Classification_of_Fruits' },
    ],
  },
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

        {/* INFO CARDS */}
        <div className="galeri-info-list">
          {INFO_CARDS.map((info) => (
            <div key={info.id} className="galeri-info-card">
              <p className="galeri-info-text">{info.content}</p>
              <div className="galeri-info-refs">
                <span className="galeri-info-ref-label">Referensi:</span>
                {info.refs.map((ref) => (
                  <a key={ref.url} href={ref.url} target="_blank" rel="noreferrer" className="galeri-info-ref-link">
                    {ref.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* GALERI GRID */}
        <div className="galeri-grid">
          {GALERI_DATA.map((item) => (
            <div key={item.label} className="galeri-card">
              <img src={item.img} alt={item.label} className="galeri-img" />
              <div className="galeri-card-info">
                <p className="galeri-label">{item.label}</p>
                <p className="galeri-card-desc">{item.desc}</p>
                <div className="galeri-info-refs">
                  <span className="galeri-info-ref-label">Referensi:</span>
                  <a href="https://repositori.uma.ac.id/jspui/bitstream/123456789/20291/1/178220009-%20Ahmad%20Daman%20Huri%20Rangkuti%20Fulltext.pdf" target="_blank" rel="noreferrer" className="galeri-info-ref-link">[1]</a>
                  <a href="https://journal.ipb.ac.id/jurnalagronomi/article/view/1678" target="_blank" rel="noreferrer" className="galeri-info-ref-link">[2]</a>
                </div>
              </div>
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
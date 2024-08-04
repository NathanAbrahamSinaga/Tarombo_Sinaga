// src/pages/SejarahPage.js
import React from 'react';
import logoTarombo from '../assets/logo-tarombo.png'; // Pastikan path ini benar

const SejarahPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E5] relative overflow-hidden">
      {/* Background logo dengan opacity rendah */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10 z-0"
        style={{ backgroundImage: `url(${logoTarombo})` }}
      ></div>

      {/* Konten */}
      <div className="relative z-10 p-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#8F6E0B] mb-6">Sejarah Tarombo</h1>
        <div className="space-y-4 text-[#4D3C0A]">
          <p>
            Tarombo, atau silsilah keluarga, memiliki sejarah panjang dan penting dalam budaya kita.
            Tradisi mencatat dan melestarikan garis keturunan telah berlangsung selama berabad-abad,
            menjadi penghubung antara masa lalu, masa kini, dan masa depan.
          </p>
          <p>
            Pada zaman dahulu, sejarah keluarga diceritakan secara lisan dari satu generasi ke generasi
            berikutnya. Seiring waktu, metode pencatatan berkembang menjadi tulisan di atas kulit kayu,
            kemudian di atas kertas, hingga akhirnya dalam bentuk digital seperti yang kita lihat sekarang.
          </p>
          <p>
            Tarombo bukan hanya sekedar daftar nama dan tanggal, tetapi juga menyimpan cerita, nilai-nilai,
            dan warisan budaya yang diturunkan melalui generasi. Setiap cabang dalam pohon keluarga
            mewakili kisah perjuangan, pencapaian, dan kebijaksanaan dari para leluhur kita.
          </p>
          <p>
            Dengan memahami dan menghargai sejarah tarombo kita, kita dapat lebih menghargai
            perjalanan yang telah ditempuh oleh keluarga kita dan mempersiapkan diri untuk menulis
            bab berikutnya dalam sejarah keluarga kita.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SejarahPage;
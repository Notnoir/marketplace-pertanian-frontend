export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col justify-center items-center px-6 py-12">
      <div className="max-w-5xl flex flex-col md:flex-row items-center gap-10">
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-5xl font-extrabold text-green-900 mb-6 leading-tight">
            Marketplace Produk <br /> Pertanian Lokal
          </h1>
          <p className="text-lg text-green-800 mb-8">
            Temukan produk segar dan berkualitas langsung dari petani lokal.
            Dukung pertanian berkelanjutan dan nikmati hasil bumi terbaik di
            rumah Anda.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="/produk"
              className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold shadow-md transition"
            >
              Lihat Produk
            </a>
            <a
              href="/register"
              className="px-6 py-3 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white rounded-lg font-semibold transition"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
        <div className="max-w-md w-full">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Produk Pertanian"
            className="rounded-lg shadow-lg object-cover w-full h-72 md:h-96"
          />
        </div>
      </div>
    </div>
  );
}

const page = () => {
  return (
    <div className="mt-5 ml-5">
      <h1 className="text-4xl font-bold">Berita</h1>

      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold">Tambah Berita</h1>

        <form className="mt-6 flex flex-col gap-5">
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="judul" className="mb-1">
                Judul Berita
              </label>
              <input
                type="text"
                name="judul"
                id="judul"
                placeholder="Masukkan judul berita"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="kategori" className="mb-1">
                Kategori Berita <span className="opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                name="kategori"
                id="kategori"
                placeholder="Masukkan kategori berita"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="pj" className="mb-1">
                Penanggung Jawab <span className="opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                name="pj"
                id="pj"
                placeholder="Masukkan pj berita"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="tanggal" className="mb-1">
                Tanggal Berita
              </label>
              <input
                type="date"
                name="tanggal"
                id="tanggal"
                placeholder="Masukkan tanggal berita"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 hover:cursor-pointer"
          >
            Simpan
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold">Tabel Berita</h1>
      </div>
    </div>
  );
};

export default page;

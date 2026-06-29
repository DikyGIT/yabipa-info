const page = () => {
  return (
    <div className="mt-5 ml-5">
      <h1 className="text-4xl font-bold">Dokumen</h1>

      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold">Tambah Dokumen</h1>

        <form className="mt-6 flex flex-col gap-5">
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="nama" className="mb-1">
                Nama Dokumen
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                placeholder="Masukkan nama dokumen"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="link" className="mb-1">
                Link Dokumen
              </label>
              <input
                type="text"
                name="link"
                id="link"
                placeholder="Masukkan link dokumen"
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
        <h1 className="text-xl font-bold">Tabel Dokumen</h1>
      </div>
    </div>
  );
};

export default page;

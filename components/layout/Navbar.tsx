import Image from "next/image";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="container px-4 mx-auto">
        <div className="navbar-box flex justify-between items-center py-7">
          <div className="logo">
            <a href="#beranda">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={50}
                height={50}
                className="w-auto h-auto"
              />
            </a>
          </div>
          <ul className="menu flex sm:space-x-8 space-x-3">
            <li>
              <a
                href="#tentang"
                className="hover:underline text-base sm:text-lg"
              >
                Tentang
              </a>
            </li>
            <li>
              <a
                href="#berita"
                className="hover:underline text-base sm:text-lg"
              >
                Berita
              </a>
            </li>
            <li className="sm:block hidden">
              <a
                href="#program"
                className="hover:underline text-base sm:text-lg"
              >
                Program
              </a>
            </li>
            <li>
              <a href="#data" className="hover:underline text-base sm:text-lg">
                Data
              </a>
            </li>
          </ul>
          <div>
            <p className="underline text-xl">Guru</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

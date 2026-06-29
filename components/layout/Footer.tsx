import Image from "next/image";

import { FaSquarePhone } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaLocationPin } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="sm:py-20 py-10 bg-sky-900 text-white">
      <div className="container lg:max-w-300 px-4 mx-auto">
        <div className="flex flex-wrap gap-10 justify-between">
          <div className="box">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={50}
                height={50}
                className="w-auto h-auto"
              />

              <h1 className="text-lg sm:text-xl font-bold">
                PONPES QUR`AN YABIPA <br /> SMP IT - SMA IT
              </h1>
            </div>
            <p className="text-base/loose mt-4 sm:w-120 w-full">
              Mengantarkan para santri menuju sosok muslim yang paripurna
              (kaffah), bangga menjadi anak sholeh, yang siap bejuang dengan
              memiliki kemauan dan kemampuan bersaing.
            </p>
          </div>
          <div className="box flex flex-col gap-2">
            <h1 className="font-bold">Menu</h1>
            <a href="#tentang" className="hover:underline">
              Tentang
            </a>
            <a href="#berita" className="hover:underline">
              Berita
            </a>
            <a href="#program" className="hover:underline">
              Program
            </a>
            <a href="#data" className="hover:underline">
              Data
            </a>
          </div>
          <div className="box flex flex-col gap-2">
            <h1 className="font-bold">Kontak</h1>
            <div className="flex items-center gap-2">
              <FaSquarePhone />
              <span>+62 812 3456 7890</span>
            </div>
            <div className="flex items-center gap-2">
              <FaSquareInstagram />
              <span>@ponpesquranyabipa</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLocationPin />
              <span className="w-80 text-base/loose">
                Jl. Pasir Melati Ds. Cikadut Kec. Cimenyan Kab. Bandung Prov.
                Jawa Barat 40191
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

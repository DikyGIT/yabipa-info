import Image from "next/image";

const page = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1">
      <div className="lg:block hidden">
        <Image
          src="/images/login-img.webp"
          alt="login"
          width={600}
          height={500}
          loading="eager"
          className="w-auto h-auto"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/logo.webp"
          alt="logo"
          width={50}
          height={50}
          className="w-auto h-auto"
        />
        <h1 className="text-4xl font-bold mb-10 mt-5">Masuk</h1>

        <form className="flex flex-col gap-4 lg:w-auto w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Masukkan Username"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Masukkan Password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 hover:cursor-pointer"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;

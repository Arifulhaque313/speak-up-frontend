import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto  text-gray-800">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-5xl font-bold leading-16 sm:text-6xl">
            Complain app{" "}
            <span className="text-blue-600">Speak Up</span> Raise Your Voice
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12 text-gray-600">
            Speak Up is a user-friendly complaint management app that empowers citizens
            <br className="hidden md:inline lg:hidden" /> 
            to report issues quickly and track their resolution in real-time.
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link 
              rel="noopener noreferrer" 
              href="/complains" 
              className="px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
            >
              Complains
            </Link>
            <Link 
              rel="noopener noreferrer" 
              href="/auth/login" 
              className="px-8 py-3 text-lg font-semibold border rounded border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center  p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <img 
            src="https://img.freepik.com/free-vector/young-woman-being-bullied-because-his-skin-color_23-2148583021.jpg?t=st=1748537703~exp=1748541303~hmac=8ed9600f516dbcec7d53ea53b078b4eeb4562087a2f674b6734470a33f2feaa8&w=2000" 
            alt="Business illustration" 
            className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 rounded-4xl"
          />
        </div>
      </div>
    </section>
  );
}

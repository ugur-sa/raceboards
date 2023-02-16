import Link from 'next/link';
import Image from 'next/image';

export default function Error() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#B8D9F4] text-center text-gray-900">
      <div className="mx-auto -mt-40">
        <div className="flex flex-col justify-center text-center">
          <div className="mx-auto">
            <Image
              src="/safetycar_illustration.653bf6ddc0a7.gif"
              className="h-80"
              alt="sc-car"
              height={80}
              width={400}
            />
          </div>
        </div>
        <div className="relative z-10 -mt-20 text-xs text-gray-500">
          <a href="https://dribbble.com/shots/4363000-Safety-Car">
            Illustration by João Augusto
          </a>
        </div>
        <div className="mt-10 px-3 lg:max-w-xl">
          <h1 className="text-2xl font-bold lg:text-4xl">
            You have exceeded track limits here
          </h1>
          <p className="mt-8">
            <Link
              href="/"
              className="items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-2 text-base font-medium text-white hover:bg-blue-700 md:py-3 md:px-6 md:text-lg"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import Navbar from '@/components/Navbar';
import { useSession } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UploadRacesPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(selectedFile);
    const response = await fetch('/api/races/postRace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: selectedFile,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  //page where user can upload a json file
  return (
    <>
      <Head>
        <title>Upload</title>
      </Head>
      <div className="flex h-screen flex-col bg-gray-800">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 text-white">
          <h1 className="text-6xl font-bold">Upload</h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-xl">Upload a JSON file</span>
              <input type="file" accept=".json" onChange={handleFileUpload} />
            </label>
            <button
              type="submit"
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-400"
              disabled={!selectedFile}
            >
              Upload
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default UploadRacesPage;

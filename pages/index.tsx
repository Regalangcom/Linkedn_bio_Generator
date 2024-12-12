import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { LangType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [lang, setLang] = useState<LangType>("Indonesia" as LangType);
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 3 professional Linkedin biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 Linkedin bios, nothing else. Make sure each generated biography is less than 300 characters, has short sentences that are found in Linkedin bios, and feel free to use this context as well: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }
  and use language ${lang}.`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    try {
      if (bio === "") {
        toast.error("Silahkan masukkan pekerjaanmu", {
          style: {
            background: "#ff5d5d",
            color: "#fff",
          },
          icon: "❌",
        });
        setLoading(false);
        return;
      }
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      const data = await res.json();
      setGeneratedBios(data.bios);
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Gagal membuat bio", {
        style: {
          background: "#ff5d5d",
          color: "#fff",
        },
        icon: "❌",
      });
    } finally {
      scrollToBios();
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto flex-col items-center justify-center py-8 min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <Head>
        <title>LinkedIn Bio Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-16">
        {/* Hero Section */}
        <div className="relative w-full h-[200px] sm:h-[300px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-xl flex justify-center items-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-shadow-lg">
            Bikin Bio Media Sosial Kamu Lebih Mudah <br /> dengan Bantuan AI ✨
          </h1>
        </div>

        {/* Form Section */}
        <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg mt-8">
          <div className="space-y-6">
            {/* Step 1: Masukkan pekerjaan */}
            <div className="flex items-center space-x-3">
              <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
              <p className="text-left font-medium text-slate-700">
                Masukkan pekerjaanmu{" "}
                <span className="text-slate-500">
                  (atau skill, minat, hobi)
                </span>
                .
              </p>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 my-4 p-4 text-sm"
              placeholder="Misal: CEO Gojek"
            />

            {/* Step 2: Pilih bahasa */}
            <div className="flex items-center space-x-3">
              <Image src="/2-black.png" width={30} height={30} alt="2 icon" />
              <p className="text-left font-medium text-slate-700">
                Pilih bahasa.
              </p>
            </div>
            <DropDown lang={lang} setLang={(newLang) => setLang(newLang)} />

            {/* Generate Button */}
            <div className="mt-8">
              {!loading ? (
                <button
                  className="bg-blue-500 rounded-xl text-white font-medium px-6 py-3 w-full hover:bg-blue-600 transition duration-200"
                  onClick={(e) => generateBio(e)}
                >
                  Bikin Biomu &rarr;
                </button>
              ) : (
                <button
                  className="bg-blue-500 rounded-xl text-white font-medium px-6 py-3 w-full opacity-70 cursor-not-allowed"
                  disabled
                >
                  <LoadingDots color="white" style="large" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Toaster */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />

        <hr className="my-8 w-full bg-gray-200" />

        {/* Bio Results Section */}
        <div className="space-y-10 my-10 w-full">
          {generatedBios && (
            <>
              <div
                className="text-3xl font-semibold text-slate-900 text-center"
                ref={bioRef}
              >
                Bio yang Dihasilkan
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf("1") + 3)
                  .split(/2\.|3\./)
                  .map((generatedBio, index) => (
                    <div
                      className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-100 transition-all cursor-copy border border-gray-300"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBio);
                        toast.success("Bio berhasil disalin", {
                          style: {
                            background: "#78ffa0",
                            color: "#333",
                          },
                          icon: "📋",
                        });
                      }}
                      key={index}
                    >
                      <p className="text-sm text-gray-800">{generatedBio}</p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

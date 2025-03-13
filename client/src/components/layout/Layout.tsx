import Header from "./Header";
import Footer from "./Footer";
import { ReactNode, useEffect, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("Layout komponan monte...");
    try {
      // Pou teste si aplikasyon ap chaje kòrèkteman
      setIsLoaded(true);
    } catch (err) {
      console.error("Erè nan Layout:", err);
      setError(err instanceof Error ? err : new Error('Yon erè enkoni te fèt'));
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Yon erè te fèt!</h1>
        <p className="text-red-500">{error.message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Eseye ankò
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {isLoaded ? (
          children
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

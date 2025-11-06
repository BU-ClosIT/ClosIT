import Footer from "./footer";
import Nav from "./nav/nav";

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center w-full">
      <header className="w-full sticky top-0 z-40 backdrop-blur-sm ">
        <Nav />
      </header>

      <main className="w-full max-w-4xl mx-auto overflow-hidden flex-1">
        {children}
      </main>

      <footer className="w-full sticky border-t py-3">
        <Footer />
      </footer>
    </div>
  );
};

export default PageLayout;

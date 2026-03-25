 import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
function Layout({ children }) {
  return (
     <div className="min-h-screen flex flex-col">

    <Nav />
        <main className="flex-1">
            {children}
        </main>
        <Footer/>
        </div>
  );
}

export default Layout;
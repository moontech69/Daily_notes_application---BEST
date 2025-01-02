import { Footer } from "./Footer"
import { Header } from "./Header";

const MainLayout = ({children}: any) => (
  <div className="h-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white">
    <Header />
    {children}
    <Footer />
  </div>
)

export default MainLayout;
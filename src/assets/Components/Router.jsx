import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Home from '../Pages/Home';
function Router() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;
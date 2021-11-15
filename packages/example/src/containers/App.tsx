import React from "react";
import { BrowserRouter } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

const App: React.FC = () => (
  <BrowserRouter>
    <Header isSignedIn={false} isAdmin={false} />
    <Footer />
  </BrowserRouter>
);

export default App;

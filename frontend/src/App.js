import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Products from './components/Products';
import Taxonomy from './components/Taxonomy';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/taxonomy">Taxonomy</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/taxonomy" element={<Taxonomy />} />
          <Route path="/" element={<h1>Welcome to E-commerce Dashboard</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
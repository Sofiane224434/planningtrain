// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import Home from './pages/Home.jsx';

function App() {
  const { loading } = useAuth();
  if (loading) return <div><p>Chargement...</p></div>;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
export default App;
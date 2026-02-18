// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Planning from '../components/planning.jsx';

function Home() {
    return (
        <Planning />
    );
}

export default Home;
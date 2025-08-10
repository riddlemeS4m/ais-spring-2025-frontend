import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <h2 className="text-white text-xl font-bold">{import.meta.env.VITE_APP_NAME}</h2>
      <ul className="flex space-x-4 mt-2">
        <li>
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
        </li>
        <li>
          <Link to="/about" className="text-white hover:text-gray-200">About</Link>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}

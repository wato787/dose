import { Link } from '@tanstack/react-router'

export const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex gap-4">
        <Link to="/" className="[&.active]:font-bold hover:underline">
          Home
        </Link>
      </nav>
    </header>
  )
}

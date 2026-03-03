import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Scale className="h-7 w-7 text-[#1a56db]" />
              <span className="text-xl font-bold">
                <span className="text-white">MonAvocat</span>
                <span className="text-[#c8a951]">Direct</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              La plateforme de mise en relation avec des avocats qualifies.
              Trouvez le professionnel du droit adapte a vos besoins en quelques clics.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Rechercher un avocat
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/mentions-legales"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link
                  to="/confidentialite"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Politique de confidentialite
                </Link>
              </li>
              <li>
                <Link
                  to="/cgv"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Conditions generales
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2024 MonAvocatDirect. Tous droits reserves.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              to="/mentions-legales"
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Mentions legales
            </Link>
            <Link
              to="/confidentialite"
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Confidentialite
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

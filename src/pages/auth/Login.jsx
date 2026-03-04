import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const TABS = [
  { key: 'client', label: 'Client' },
  { key: 'avocat', label: 'Avocat' },
]

const TAB_CONTENT = {
  client: {
    title: 'Connexion Client',
    imageTitle: 'Votre cabinet juridique numerique',
    imageDesc:
      'Accedez a votre espace personnel pour suivre vos dossiers, echanger avec votre avocat et gerer vos documents juridiques en toute securite.',
  },
  avocat: {
    title: 'Connexion Avocat',
    imageTitle: 'Justice digitale',
    imageDesc:
      'Accedez a votre espace professionnel pour gerer vos clients, vos dossiers et developper votre activite.',
  },
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signOut, fetchProfile } = useAuth()

  const [activeTab, setActiveTab] = useState('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const content = TAB_CONTENT[activeTab]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await signIn(email, password)
      const profile = await fetchProfile(data.user.id)

      // Vérifier correspondance rôle ↔ onglet
      // L'admin peut utiliser n'importe quel onglet (pas d'onglet "Admin")
      const roleMatchesTab =
        profile?.role === 'admin' ||
        profile?.role === activeTab

      if (!roleMatchesTab) {
        await signOut()
        const portalLabel = activeTab === 'client' ? 'clients' : 'avocats'
        toast.error(`Ce portail est réservé aux ${portalLabel}.`)
        return
      }

      toast.success('Connexion reussie')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ================================================================
          NAVBAR (variante login — logo a gauche, hamburger a droite)
          ================================================================ */}
      <header className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/Logo.png" alt="Mon Avocat Direct" className="h-8 w-auto" />
          </Link>
          {/* Hamburger */}
          <button
            className="p-1.5 text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* ================================================================
          CONTENU PRINCIPAL
          ================================================================ */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* ————————————————————————————————————————————————————————————————
            COLONNE GAUCHE — Formulaire
            ———————————————————————————————————————————————————————————— */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 lg:py-0">
          <div className="w-full max-w-[400px]">
            {/* Onglets Client / Avocat */}
            <div className="flex items-center bg-gray-100 rounded-full p-1 mb-8">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 text-center text-sm font-semibold py-2 rounded-full transition-colors ${
                    activeTab === tab.key
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Titre */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {content.title}
            </h1>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Se souvenir de moi + Mot de passe oublie */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-600">
                    Se souvenir de moi
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Mot de passe oublie ?
                </Link>
              </div>

              {/* Bouton Se connecter */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Chargement...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Separateur "Ou continuer avec" */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-sm text-gray-400 bg-white">
                  Ou continuer avec
                </span>
              </div>
            </div>

            {/* Bouton Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Google icon SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuer avec Google
            </button>

            {/* Lien inscription */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Vous n'avez pas de compte ?{' '}
              <Link
                to="/register"
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* ————————————————————————————————————————————————————————————————
            COLONNE DROITE — Image + texte (visible uniquement sur desktop)
            ———————————————————————————————————————————————————————————— */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative overflow-hidden">
          {/* Image client */}
          {/* REMPLACER IMAGE_PLACEHOLDER_7 PAR L'IMAGE FINALE (balance de la justice + marteau, tons dores — page client) */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              activeTab === 'client' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium select-none">
                IMAGE_PLACEHOLDER_7
              </span>
            </div>
            {/* Overlay gradient + texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 xl:p-10">
              <h2
                className="text-2xl xl:text-3xl font-bold text-white mb-2 leading-tight"
              >
                Votre cabinet juridique numerique
              </h2>
              <p className="text-gray-200 text-sm leading-relaxed max-w-md">
                Accedez a votre espace personnel pour suivre vos dossiers,
                echanger avec votre avocat et gerer vos documents juridiques en
                toute securite.
              </p>
            </div>
          </div>

          {/* Image avocat */}
          {/* REMPLACER IMAGE_PLACEHOLDER_8 PAR L'IMAGE FINALE (avocat ecrivant avec balance, tons chauds — page avocat) */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              activeTab === 'avocat' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium select-none">
                IMAGE_PLACEHOLDER_8
              </span>
            </div>
            {/* Overlay gradient + texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 xl:p-10">
              <h2
                className="text-2xl xl:text-3xl font-bold text-white mb-2 leading-tight"
              >
                Justice digitale
              </h2>
              <p className="text-gray-200 text-sm leading-relaxed max-w-md">
                Accedez a votre espace professionnel pour gerer vos clients, vos
                dossiers et developper votre activite.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>&copy; 2025 Mon Avocat Direct. Tous droits reserves.</span>
          <div className="flex items-center gap-4">
            <Link
              to="/mentions-legales"
              className="hover:text-gray-600 transition-colors"
            >
              Mentions legales
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/confidentialite"
              className="hover:text-gray-600 transition-colors"
            >
              Politique de confidentialite
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/cgv"
              className="hover:text-gray-600 transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

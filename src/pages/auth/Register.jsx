import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Scale, Mail, Lock, User, Eye, EyeOff, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { ROLES } from '../../lib/constants'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.CLIENT,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.role, {
        nom: formData.nom,
        prenom: formData.prenom,
      })
      toast.success('Inscription réussie ! Vérifiez votre email.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ================================================================
          NAVBAR
          ================================================================ */}
      <header className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center">
            <img src="/Logo.png" alt="Mon Avocat Direct" className="h-8 w-auto" />
          </Link>
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
            {/* Titre */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Créez votre compte
            </h1>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom & Prénom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Dupont"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                    <input
                      id="prenom"
                      name="prenom"
                      type="text"
                      required
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Jean"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              {/* Sélecteur de rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Je suis un(e)
                </label>
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-full cursor-pointer transition-colors ${
                      formData.role === ROLES.CLIENT
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={ROLES.CLIENT}
                      checked={formData.role === ROLES.CLIENT}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <User className="h-4 w-4" />
                    Client
                  </label>
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-full cursor-pointer transition-colors ${
                      formData.role === ROLES.AVOCAT
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={ROLES.AVOCAT}
                      checked={formData.role === ROLES.AVOCAT}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Scale className="h-4 w-4" />
                    Avocat
                  </label>
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Minimum 6 caractères"
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

              {/* Confirmer mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Retapez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton S'inscrire */}
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
                  "S'inscrire"
                )}
              </button>
            </form>

            {/* Lien connexion */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* ————————————————————————————————————————————————————————————————
            COLONNE DROITE — Image (visible uniquement sur desktop)
            ———————————————————————————————————————————————————————————— */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative overflow-hidden">
          {/* REMPLACER IMAGE_PLACEHOLDER_9 PAR L'IMAGE FINALE */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium select-none">
              IMAGE_PLACEHOLDER_9
            </span>
          </div>
          {/* Overlay gradient + texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 xl:p-10">
            <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2 leading-tight">
              Rejoignez la communauté juridique
            </h2>
            <p className="text-gray-200 text-sm leading-relaxed max-w-md">
              Trouvez l'avocat qu'il vous faut ou développez votre clientèle en
              rejoignant la première plateforme juridique digitale.
            </p>
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

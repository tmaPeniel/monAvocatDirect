import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CASE_STATUS, CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '../../lib/constants'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  ArrowLeft,
  User,
  Mail,
  FileText,
  Upload,
  Download,
  Trash2,
  Save,
  File,
} from 'lucide-react'

export default function LawyerCaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user && id) {
      fetchCase()
      fetchDocuments()
    }
  }, [user, id])

  const fetchCase = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*, client:profiles!cases_client_id_fkey(nom, prenom, email)')
        .eq('id', id)
        .eq('avocat_id', user.id)
        .single()

      if (error) throw error

      if (!data) {
        toast.error('Dossier introuvable')
        navigate('/avocat/cases')
        return
      }

      setCaseData(data)
      setStatus(data.statut)
    } catch (error) {
      console.error('Erreur lors du chargement du dossier:', error)
      toast.error('Erreur lors du chargement du dossier')
      navigate('/avocat/cases')
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error)
    }
  }

  const handleStatusUpdate = async () => {
    if (status === caseData.statut) return

    setSavingStatus(true)
    try {
      const { error } = await supabase
        .from('cases')
        .update({ statut: status })
        .eq('id', id)
        .eq('avocat_id', user.id)

      if (error) throw error

      setCaseData((prev) => ({ ...prev, statut: status }))
      toast.success('Statut mis a jour')
    } catch (error) {
      console.error('Erreur lors de la mise a jour du statut:', error)
      toast.error('Erreur lors de la mise a jour')
    } finally {
      setSavingStatus(false)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)
      try {
        for (const file of acceptedFiles) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file)

          if (uploadError) throw uploadError

          const { error: dbError } = await supabase.from('documents').insert({
            case_id: id,
            uploaded_by: user.id,
            name: file.name,
            file_path: fileName,
            file_size: file.size,
          })

          if (dbError) throw dbError
        }

        toast.success(
          acceptedFiles.length === 1
            ? 'Document televerse avec succes'
            : `${acceptedFiles.length} documents televerses avec succes`
        )
        fetchDocuments()
      } catch (error) {
        console.error('Erreur lors du telechargement:', error)
        toast.error('Erreur lors du telechargement du document')
      } finally {
        setUploading(false)
      }
    },
    [id, user]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleDownload = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors du telechargement:', error)
      toast.error('Erreur lors du telechargement')
    }
  }

  const handleDeleteDocument = async (doc) => {
    if (!confirm('Supprimer ce document ?')) return

    try {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path])

      if (storageError) throw storageError

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id)

      if (dbError) throw dbError

      toast.success('Document supprime')
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!caseData) return null

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/avocat/cases"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux dossiers
      </Link>

      {/* Case header */}
      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{caseData.titre}</h1>
            {caseData.created_at && (
              <p className="text-sm text-gray-500 mt-1">
                Cree le {format(new Date(caseData.created_at), 'dd MMMM yyyy', { locale: fr })}
              </p>
            )}
          </div>
          <span className={CASE_STATUS_COLORS[caseData.statut]}>
            {CASE_STATUS_LABELS[caseData.statut]}
          </span>
        </div>

        {caseData.description && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{caseData.description}</p>
          </div>
        )}
      </div>

      {/* Client info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">
              {caseData.client?.prenom} {caseData.client?.nom}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <a
              href={`mailto:${caseData.client?.email}`}
              className="text-primary-500 hover:text-primary-600"
            >
              {caseData.client?.email}
            </a>
          </div>
        </div>
      </div>

      {/* Status management */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion du statut</h2>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value={CASE_STATUS.EN_ATTENTE}>{CASE_STATUS_LABELS.en_attente}</option>
            <option value={CASE_STATUS.EN_COURS}>{CASE_STATUS_LABELS.en_cours}</option>
            <option value={CASE_STATUS.TERMINE}>{CASE_STATUS_LABELS.termine}</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={savingStatus || status === caseData.statut}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {savingStatus ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* Documents */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>

        {/* Upload zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-6 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          {uploading ? (
            <p className="text-sm text-gray-500">Telechargement en cours...</p>
          ) : isDragActive ? (
            <p className="text-sm text-primary-600">Deposez les fichiers ici...</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Glissez-deposez vos fichiers ici, ou cliquez pour selectionner
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, images, Word — 10 Mo max par fichier
              </p>
            </>
          )}
        </div>

        {/* Documents list */}
        {documents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun document</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(doc.file_size)}
                      {doc.created_at && (
                        <span className="ml-2">
                          — {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1"
                    title="Telecharger"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc)}
                    className="btn-danger px-3 py-1.5 text-sm flex items-center gap-1"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

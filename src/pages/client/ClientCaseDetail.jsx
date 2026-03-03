import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  Trash2,
  User,
  Calendar,
  Briefcase,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '../../lib/constants'

export default function ClientCaseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user && id) {
      fetchCaseData()
    }
  }, [user, id])

  const fetchCaseData = async () => {
    try {
      setLoading(true)

      // Fetch case with avocat profile
      const { data: caseResult, error: caseError } = await supabase
        .from('cases')
        .select('*, avocat:avocat_id(id, nom, prenom, specialite, email)')
        .eq('id', id)
        .single()

      if (caseError) throw caseError

      // Verify case belongs to current user
      if (caseResult.client_id !== user.id) {
        toast.error("Vous n'avez pas acces a ce dossier.")
        navigate('/client/cases')
        return
      }

      setCaseData(caseResult)

      // Fetch documents for this case
      await fetchDocuments()
    } catch (error) {
      console.error('Error fetching case:', error)
      toast.error('Erreur lors du chargement du dossier.')
      navigate('/client/cases')
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
      console.error('Error fetching documents:', error)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles.length) return

      setUploading(true)

      try {
        for (const file of acceptedFiles) {
          const filePath = `${id}/${Date.now()}_${file.name}`

          // Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file)

          if (uploadError) throw uploadError

          // Save document record in database
          const { error: dbError } = await supabase.from('documents').insert({
            case_id: id,
            name: file.name,
            file_path: filePath,
            file_size: file.size,
            uploaded_by: user.id,
          })

          if (dbError) throw dbError
        }

        toast.success('Document uploade')
        await fetchDocuments()
      } catch (error) {
        console.error('Upload error:', error)
        toast.error("Erreur lors de l'upload du document.")
      } finally {
        setUploading(false)
      }
    },
    [id, user]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  const handleDownload = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path)

      if (error) throw error

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du telechargement.')
    }
  }

  const handleDelete = async (doc) => {
    if (!window.confirm('Etes-vous sur de vouloir supprimer ce document ?')) {
      return
    }

    try {
      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path])

      if (storageError) throw storageError

      // Remove from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id)

      if (dbError) throw dbError

      toast.success('Document supprime')
      await fetchDocuments()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Erreur lors de la suppression.')
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
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
      {/* Back Button */}
      <Link
        to="/client/cases"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour aux dossiers</span>
      </Link>

      {/* Case Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {caseData.titre}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={CASE_STATUS_COLORS[caseData.statut]}>
                {CASE_STATUS_LABELS[caseData.statut]}
              </span>
              <span className="text-sm text-gray-500 flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Cree le{' '}
                  {format(new Date(caseData.created_at), 'dd MMMM yyyy', {
                    locale: fr,
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {caseData.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {caseData.description}
            </p>
          </div>
        )}

        {/* Avocat Info */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Avocat assigne
          </h3>
          {caseData.avocat ? (
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {caseData.avocat.prenom} {caseData.avocat.nom}
                </p>
                {caseData.avocat.specialite && (
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <Briefcase className="h-3 w-3" />
                    <span>{caseData.avocat.specialite}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun avocat assigne.</p>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`h-10 w-10 mx-auto mb-3 ${
              isDragActive ? 'text-primary-500' : 'text-gray-400'
            }`}
          />
          {uploading ? (
            <p className="text-sm text-gray-600">Upload en cours...</p>
          ) : isDragActive ? (
            <p className="text-sm text-primary-600">
              Deposez les fichiers ici...
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-600">
                Glissez-deposez des fichiers ici, ou{' '}
                <span className="text-primary-500 font-medium">
                  cliquez pour selectionner
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tous types de fichiers acceptes
              </p>
            </div>
          )}
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="mt-6 space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.file_size)} -{' '}
                      {format(new Date(doc.created_at), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Telecharger"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center py-6">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Aucun document pour ce dossier.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Send, ArrowLeft } from 'lucide-react'
import conversationsData from '../../data/mock/conversations.json'

const MOCK_CONVERSATIONS = conversationsData.conversations
const MOCK_MESSAGES      = conversationsData.messages
const MY_ID = 'avocat-001'

export default function LawyerMessages() {
  const [selectedConv, setSelectedConv] = useState(MOCK_CONVERSATIONS[0])
  const [localMessages, setLocalMessages] = useState(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [mobileView, setMobileView] = useState('list')

  const messages = localMessages[selectedConv?.id] || []

  const handleSelectConv = (conv) => {
    setSelectedConv(conv)
    setMobileView('chat')
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv) return

    const msg = {
      id: 'new-' + Date.now(),
      sender_id: MY_ID,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    }

    setLocalMessages((prev) => ({
      ...prev,
      [selectedConv.id]: [...(prev[selectedConv.id] || []), msg],
    }))
    setNewMessage('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}
      >
        <div className="flex h-full">

          {/* ── Liste des conversations ── */}
          <div className={`w-full lg:w-80 flex-shrink-0 border-r border-gray-100 flex flex-col ${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">
                Conversations ({MOCK_CONVERSATIONS.length})
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {MOCK_CONVERSATIONS.map((conv) => {
                const isActive = selectedConv?.id === conv.id
                const lastMsg = (localMessages[conv.id] || []).at(-1)
                const initials = `${conv.client.prenom.charAt(0)}${conv.client.nom.charAt(0)}`

                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${isActive ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {conv.client.prenom} {conv.client.nom}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{conv.titre}</p>
                      {lastMsg && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.content}</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Thread de messages ── */}
          <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
            {/* Header */}
            {selectedConv && (
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedConv.client.prenom} {selectedConv.client.nom}
                  </p>
                  <p className="text-xs text-gray-500">{selectedConv.titre}</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">
                  Démarrez la conversation en envoyant un message.
                </p>
              )}
              {messages.map((msg) => {
                const isMine = msg.sender_id === MY_ID
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        isMine
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                        {format(new Date(msg.created_at), 'dd MMM HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez un message..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-white px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Database, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MCPChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ollamaStatus, setOllamaStatus] = useState(null);
    const messagesEndRef = useRef(null);
    const sessionId = useRef(`session-${Date.now()}`);

    // Auto-scroll al final de los mensajes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Verificar estado de Ollama al abrir el chat
    useEffect(() => {
        if (isOpen && ollamaStatus === null) {
            checkOllamaStatus();
        }
    }, [isOpen]);

    const checkOllamaStatus = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/mcp/status');
            const data = await response.json();
            setOllamaStatus(data);
            
            if (!data.available) {
                setMessages([{
                    role: 'system',
                    content: '⚠️ Ollama no está disponible. Asegúrate de tener Ollama ejecutándose en tu sistema.',
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error('Error al verificar Ollama:', error);
            setOllamaStatus({ available: false });
            setMessages([{
                role: 'system',
                content: '⚠️ No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.',
                timestamp: new Date()
            }]);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/mcp/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    sessionId: sessionId.current
                }),
            });

            const data = await response.json();

            if (data.success) {
                const assistantMessage = {
                    role: 'assistant',
                    content: data.response,
                    toolUsed: data.toolUsed,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                const errorMessage = {
                    role: 'error',
                    content: `Error: ${data.error}`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            const errorMessage = {
                role: 'error',
                content: 'Error al comunicarse con el servidor. Verifica tu conexión.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        sessionId.current = `session-${Date.now()}`;
    };

    const suggestedQuestions = [
        "¿Cuántos sensores tenemos registrados?",
        "Muéstrame las últimas lecturas",
        "¿Cuáles son los eventos recientes?",
        "Dame estadísticas del sensor de presión",
        "¿Qué dispositivos tenemos?",
    ];

    return (
        <>
            {/* Botón flotante */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Abrir Chatbot MCP"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>

            {/* Ventana del chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bot className="text-white" size={24} />
                                <div>
                                    <h3 className="text-white font-bold">Katari AI Assistant</h3>
                                    <p className="text-xs text-blue-100 flex items-center gap-1">
                                        <Database size={12} />
                                        Consultas a la Base de Datos
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {ollamaStatus?.available && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Ollama conectado"></div>
                                )}
                                <button
                                    onClick={clearChat}
                                    className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                                    title="Limpiar chat"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-8">
                                    <Bot size={48} className="mx-auto mb-4 text-blue-500" />
                                    <p className="mb-4">¡Hola! Soy tu asistente de IA.</p>
                                    <p className="text-sm mb-4">Puedo ayudarte a consultar la base de datos de telemetría de Katari.</p>
                                    
                                    <div className="mt-6 space-y-2">
                                        <p className="text-xs font-semibold text-gray-300 mb-2">Preguntas sugeridas:</p>
                                        {suggestedQuestions.map((question, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInputMessage(question)}
                                                className="block w-full text-left text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded transition-colors"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${
                                            message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : message.role === 'error'
                                                ? 'bg-red-600 text-white'
                                                : message.role === 'system'
                                                ? 'bg-yellow-600 text-white'
                                                : 'bg-gray-700 text-gray-100'
                                        }`}
                                    >
                                        {message.toolUsed && (
                                            <div className="text-xs text-blue-200 mb-1 flex items-center gap-1">
                                                <Database size={12} />
                                                Consultó: {message.toolUsed}
                                            </div>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {message.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-700 text-gray-100 p-3 rounded-2xl flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-sm">Pensando...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-gray-900 border-t border-gray-700">
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Pregunta algo sobre los datos..."
                                    className="flex-1 bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MCPChatbot;

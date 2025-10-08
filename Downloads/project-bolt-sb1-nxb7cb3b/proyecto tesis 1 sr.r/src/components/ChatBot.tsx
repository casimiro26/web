import React, { useState } from 'react';
import { X, Send, Bot, ExternalLink } from 'lucide-react';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy el asistente virtual de Sr. Robot. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickResponses = [
    '¿Tienen auriculares gaming?',
    'Información de envíos',
    '¿Cómo puedo rastrear mi pedido?',
    'Métodos de pago',
    'Política de devoluciones'
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Gracias por tu consulta. Un momento mientras busco la información más actualizada para ti. Para obtener una respuesta inmediata, también puedes contactarnos por WhatsApp.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickResponse = (response: string) => {
    setInputMessage(response);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* WhatsApp Button */}
        <a
          href="https://w.app/wdebhf"
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-.816-.911-1.115-.24-.297-.487-.447-.669-.447-.182-.001-.332-.024-.482-.024-.149 0-.395.099-.495.347-.099.248-.372.952-.421 2.284-.049 1.332.446 3.3 1.642 4.496 1.197 1.197 2.966 1.94 4.889 2.163.473.053.896.08 1.27.08.369 0 .718-.099 1.016-.272.297-.174.495-.471.644-.868.149-.397.149-.645.025-.744-.123-.099-.273-.148-.421-.148z"/>
            <path d="M12.003 2C6.48 2 2.004 6.475 2.004 12c0 1.776.468 3.464 1.314 4.935l-1.406 5.147 5.297-1.389c1.418.826 3.004 1.262 4.794 1.262 5.523 0 10-4.475 10-10s-4.477-10-10-10zm0 18c-1.518 0-2.955-.404-4.206-1.113l-.303-.18-3.14.825.845-3.083-.198-.305C3.465 14.63 2.703 13.077 2.703 12c0-4.96 4.037-9 9-9s9 4.04 9 9-4.037 9-9 9z"/>
          </svg>
        </a>
        
        {/* ChatBot Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Sr. Robot As</h3>
              <p className="text-xs opacity-90">Online ahora</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="https://w.app/wdebhf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-green-600 rounded transition-colors drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]"
              title="Ir a WhatsApp"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-.816-.911-1.115-.24-.297-.487-.447-.669-.447-.182-.001-.332-.024-.482-.024-.149 0-.395.099-.495.347-.099.248-.372.952-.421 2.284-.049 1.332.446 3.3 1.642 4.496 1.197 1.197 2.966 1.94 4.889 2.163.473.053.896.08 1.27.08.369 0 .718-.099 1.016-.272.297-.174.495-.471.644-.868.149-.397.149-.645.025-.744-.123-.099-.273-.148-.421-.148z"/>
                <path d="M12.003 2C6.48 2 2.004 6.475 2.004 12c0 1.776.468 3.464 1.314 4.935l-1.406 5.147 5.297-1.389c1.418.826 3.004 1.262 4.794 1.262 5.523 0 10-4.475 10-10s-4.477-10-10-10zm0 18c-1.518 0-2.955-.404-4.206-1.113l-.303-.18-3.14.825.845-3.083-.198-.305C3.465 14.63 2.703 13.077 2.703 12c0-4.96 4.037-9 9-9s9 4.04 9 9-4.037 9-9 9z"/>
              </svg>
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-red-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-sm ${
                  message.isBot
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Responses */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-1 mb-2">
            {quickResponses.slice(0, 2).map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {response}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
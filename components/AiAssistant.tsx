
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { askAiAssistant } from '../services/geminiService';
import NeumorphicCard from './NeumorphicCard';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC = () => {
  const { employees, withdrawals } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'مرحباً! أنا مساعدك المحاسبي الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await askAiAssistant(input, employees, withdrawals);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">المساعد الذكي</h1>
      <NeumorphicCard className="flex-1 flex flex-col p-0">
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">AI</div>}
              <div className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none shadow-[3px_3px_6px_#bebebe,_-3px_-3px_6px_#ffffff]'
                : 'bg-gray-200 text-gray-800 rounded-bl-none shadow-[3px_3px_6px_#bebebe,_-3px_-3px_6px_#ffffff]'
                }`}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">AI</div>
               <div className="px-4 py-3 rounded-2xl bg-gray-200 shadow-[3px_3px_6px_#bebebe,_-3px_-3px_6px_#ffffff]">
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t-2 border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اسأل عن أي شيء يتعلق بالبيانات..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="p-3 rounded-full text-white bg-blue-500 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
};

// Icon
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

export default AiAssistant;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export const AIPromptBox = ({ onGenerate, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  const placeholderPrompts = [
    "Show all applications with high compliance risk",
    "Generate a view of our CRM's data flows",
    "Which technologies are approaching end-of-life?",
    "Map business capabilities to supporting applications",
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Ask anything about your architecture, e.g., "Show all applications with high compliance risk"'
          className="pl-12 pr-28 h-12 text-base bg-background"
          disabled={loading}
        />
        <Button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2" 
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Generate'
          )}
        </Button>
      </form>
      <div className="flex gap-2 mt-3 flex-wrap">
        {placeholderPrompts.map((p) => (
          <Button
            key={p}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onGenerate(p)}
            disabled={loading}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );
};
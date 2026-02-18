import React from "react";
import { FileText } from "lucide-react";

/**
 * AITranscript Component
 * Displays either the AI-generated transcript or the default lesson introduction.
 */
const AITranscript = ({ aiTranscript, selectedCelebrity, introduction }) => {
  return (
    <div className="max-w-none">
      {aiTranscript ? (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in duration-500">
          <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            AI Transcript ({selectedCelebrity})
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed italic">
            "{aiTranscript}"
          </p>
        </div>
      ) : (
        introduction && (
          <div className="animate-in fade-in duration-300">
            <p className="text-gray-700 text-sm leading-relaxed">
              {introduction}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default AITranscript;

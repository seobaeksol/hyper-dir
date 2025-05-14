import React from "react";

interface CommandInputProps {
  prompt: any;
  query: string;
  setQuery: (q: string) => void;
  onPromptInput?: (v: string) => void;
  promptInput?: string;
  setPromptInput?: (v: string) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  prompt,
  query,
  setQuery,
  promptInput,
  setPromptInput,
}) => {
  if (prompt) {
    return (
      <>
        <div className="mb-2 text-sm text-zinc-300">{prompt.message}</div>
        <input
          type="text"
          value={promptInput || ""}
          onChange={(e) => setPromptInput && setPromptInput(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800 text-sm focus:outline-none"
          placeholder={prompt.initialValue || ""}
          autoFocus
        />
      </>
    );
  }
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full px-3 py-2 rounded bg-zinc-800 text-sm focus:outline-none"
      placeholder={"> Type a command..."}
      autoFocus
    />
  );
};

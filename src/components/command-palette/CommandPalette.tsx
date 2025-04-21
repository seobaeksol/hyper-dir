import React from "react";
import { CommandInput } from "./CommandInput";
import { CommandResultList } from "./CommandResultList";
import { FileSearchResultList } from "./FileSearchResultList";
import useCommandPalette from "./useCommandPalette";

export const CommandPalette: React.FC = () => {
  const {
    visible,
    prompt,
    mode,
    query,
    setQuery,
    ...rest
  } = useCommandPalette();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50">
      <div
        className="mt-32 w-full max-w-md bg-zinc-900 text-white rounded shadow-lg p-4"
        onClick={e => e.stopPropagation()}
      >
        <CommandInput
          prompt={prompt}
          query={query}
          setQuery={setQuery}
          {...rest}
        />
        {prompt ? null : mode === "command" ? (
          <CommandResultList commands={rest.commands} onCommandExecute={rest.onCommandExecute} query={query} />
        ) : (
          <FileSearchResultList files={rest.files} onFileExecute={rest.onFileExecute} query={query} />
        )}
      </div>
    </div>
  );
};


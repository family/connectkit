import { useState } from 'react';

export const TruncateData = ({ className, data }: { className?: string; data?: string }) => {
  const [viewMore, setViewMore] = useState(false);
  if (!data) return null;

  return (
    <div className={`mt-4 p-2 border border-zinc-700 rounded bg-zinc-900 ${className}`}>
      <pre className="break-words whitespace-normal text-sm">
        {viewMore ? data : data.length > 90 ? `${data.slice(0, 90)}...` : data}
      </pre>
      {data.length > 90 && (
        <button
          className="text-primary hover:text-primary-hover transition-colors hover:underline text-sm cursor-pointer"
          onClick={() => setViewMore(!viewMore)}
          type="button"
        >
          {viewMore ? 'View less' : 'View more'}
        </button>
      )}
    </div>
  );
};

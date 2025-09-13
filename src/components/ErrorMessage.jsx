export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 w-full mx-auto text-center">
      <p className="text-red-700 text-sm font-medium flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {message}
      </p>
    </div>
  );
}
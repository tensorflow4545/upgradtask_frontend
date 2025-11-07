export default function ErrorBox({ message }) {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg mb-4">
      {message}
    </div>
  );
}
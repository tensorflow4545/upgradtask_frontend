export default function StatBox({ label, value, color = 'text-blue-400' }) {
    return (
      <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
        <p className="text-gray-300 text-sm">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
    );
  }
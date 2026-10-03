export default function StatsCard({ title, value, icon, color = 'bg-primary' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${color} text-white w-12 h-12 rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

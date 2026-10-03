export default function DataTable({ columns, data, renderActions }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            {renderActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="px-6 py-8 text-center text-gray-500"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row._id || idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

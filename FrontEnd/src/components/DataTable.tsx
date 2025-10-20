import React from 'react'

type Column<T> = {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  emptyText?: string
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  emptyText = 'Không có dữ liệu.'
}: DataTableProps<T>) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto border border-gray-100">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className={`px-4 py-3 text-left font-semibold ${c.className ?? ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={String(c.key)} className={`px-4 py-3 ${c.className ?? ''}`}>
                  {c.render ? c.render(row) : String(row[c.key as keyof typeof row] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

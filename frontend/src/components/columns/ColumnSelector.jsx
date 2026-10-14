import Card from '../ui/Card'

export default function ColumnSelector({
  columns,
  feedbackColumn,
  metadataColumns,
  previewRows,
  onFeedbackColumnChange,
  onMetadataToggle,
}) {
  return (
    <div className="space-y-6">
      <Card
        title="Select feedback column"
        description="Choose the column that contains customer comments or complaints."
      >
        <select
          value={feedbackColumn}
          onChange={(event) => onFeedbackColumnChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Select a column</option>
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </Card>

      <Card
        title="Optional metadata columns"
        description="Select extra columns to keep with each feedback record in the results view."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((column) => {
            const isFeedbackColumn = column === feedbackColumn

            return (
              <label
                key={column}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                  isFeedbackColumn ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={metadataColumns.includes(column)}
                  disabled={isFeedbackColumn}
                  onChange={() => onMetadataToggle(column)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 disabled:cursor-not-allowed"
                />
                <span>
                  {column}
                  {isFeedbackColumn ? ' (required feedback column)' : ''}
                </span>
              </label>
            )
          })}
        </div>
      </Card>

      {previewRows.length > 0 && (
        <Card title="Data preview" description="First few rows from your uploaded file.">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  {columns.map((column) => (
                    <th key={column} className="px-3 py-2 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-100">
                    {columns.map((column) => (
                      <td key={column} className="max-w-xs truncate px-3 py-2 text-slate-700">
                        {row[column] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

import '../../styles/components.css';

export default function DataTable({ columns, rows }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td
                key={col.key}
                dangerouslySetInnerHTML={
                  typeof row[col.key] === 'string' ? { __html: row[col.key] } : undefined
                }
              >
                {typeof row[col.key] !== 'string' ? row[col.key] : undefined}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

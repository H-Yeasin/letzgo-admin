import React from 'react';

// Compound Table component
interface TableContextValue {
  variant?: 'default' | 'compact';
}

const TableContext = React.createContext<TableContextValue>({});

interface TableProps {
  variant?: 'default' | 'compact';
  children: React.ReactNode;
  className?: string;
}

function Table({ variant = 'default', children, className = '' }: TableProps) {
  return (
    <TableContext.Provider value={{ variant }}>
      <table className={`defi-table ${className}`}>{children}</table>
    </TableContext.Provider>
  );
}

function Head({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

interface RowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function Row({ children, onClick, className = '' }: RowProps) {
  return (
    <tr
      className={className}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </tr>
  );
}

interface CellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function Cell({ children, className = '', style }: CellProps) {
  return (
    <td className={className} style={style}>
      {children}
    </td>
  );
}

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;

export default Table;

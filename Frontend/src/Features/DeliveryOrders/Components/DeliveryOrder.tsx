// "use client"

// import * as React from "react"
// import {
//   useReactTable,
//   getCoreRowModel,
//   getExpandedRowModel,
//   flexRender,
//   ColumnDef,
// } from "@tanstack/react-table"
// import { ChevronDown, ChevronRight } from "lucide-react"

// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"

// type User = {
//   id: number
//   name: string
//   email: string
//   details: string
// }

// const data: User[] = [
//   { id: 1, name: "Alice", email: "alice@example.com", details: "Additional info about Alice" },
//   { id: 2, name: "Bob", email: "bob@example.com", details: "Additional info about Bob" },
// ]

// const columns: ColumnDef<User>[] = [
//   {
//     id: "expander",
//     header: () => null,
//     cell: ({ row }) =>
//       row.getCanExpand() ? (
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={row.getToggleExpandedHandler()}
//         >
//           {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//         </Button>
//       ) : null,
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
// ]

// export function ExpandableTable() {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getExpandedRowModel: getExpandedRowModel(),
//     getRowCanExpand: () => true, // allow all rows to expand
//   })

//   return (
//     <div className="rounded-md border w-full">
//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <TableHead key={header.id}>
//                   {flexRender(header.column.columnDef.header, header.getContext())}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows.map((row) => (
//             <React.Fragment key={row.id}>
//               <TableRow>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//               {row.getIsExpanded() && (
//                 <TableRow>
//                   <TableCell colSpan={row.getVisibleCells().length}>
//                     <div className="p-2 text-sm text-muted-foreground">
//                       {row.original.details}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </React.Fragment>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

import { jsPDF } from "jspdf"
import "jspdf-autotable"

/**
 * Exports data to CSV
 */
export function exportToCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(","),
        ...data.map(row => headers.map(header => {
            const cell = row[header];
            return `"${String(cell).replace(/"/g, '""')}"`;
        }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Exports data to PDF
 */
export function exportToPDF(data: any[], title: string, filename: string) {
    const doc = new jsPDF() as any;

    doc.text(title, 14, 15);

    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => String(row[header])));

    doc.autoTable({
        head: [headers.map(h => h.toUpperCase())],
        body: rows,
        startY: 20,
        theme: 'grid',
        headStyles: { fillStyle: [41, 128, 185] }
    });

    doc.save(`${filename}.pdf`);
}

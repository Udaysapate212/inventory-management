import { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import { Button } from './ui/button'
import { Download, FileText, Sheet, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { utils, writeFile } from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { differenceInDays, parseISO, format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

export default function ExportButton() {
  const { products } = useProducts()
  const [isExporting, setIsExporting] = useState(false)

  const exportCSV = () => {
    try {
      // Validate data before export
      if (!products || products.length === 0) {
        throw new Error('No products to export')
      }

      const ws = utils.json_to_sheet(products.map(p => ({
        Name: p.name,
        Quantity: p.quantity,
        'Expiry Date': p.expDate,
        Status: differenceInDays(parseISO(p.expDate), new Date()) > 7 ? 'Safe' : 'Urgent'
      })))
      
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Products')
      writeFile(wb, `inventory-export-${new Date().toISOString().slice(0,10)}.xlsx`)
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`)
    }
  }

  const exportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      })
      
      // Add title with current date
      doc.setFontSize(16)
      doc.text(
        `Inventory Report - ${format(new Date(), 'PP')}`, 
        14, 
        16
      )
      
      // Table configuration
      autoTable(doc, {
        startY: 25,
        head: [['Product', 'Quantity', 'Expiry Date', 'Status']],
        body: products.map(p => [
          p.name,
          p.quantity,
          format(parseISO(p.expDate), 'PP'),
          differenceInDays(parseISO(p.expDate), new Date()) > 7 
            ? '✅ Safe' 
            : '🔥 Urgent'
        ]),
        theme: 'grid',
        headStyles: { 
          fillColor: [30, 41, 59],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: { 
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        }
      })
      
      doc.save(`inventory-report-${new Date().toISOString().slice(0,10)}.pdf`)
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`)
    }
  }

  const handleExport = async (format) => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate processing
      format === 'csv' ? exportCSV() : exportPDF()
      toast.success(`Exported ${products.length} products`, {
        description: format === 'csv' 
          ? 'Spreadsheet generated' 
          : 'PDF report created'
      })
    } catch (error) {
      toast.error('Export failed', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => handleExport(format)
        }
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={isExporting || !products?.length}
          className="min-w-[120px]"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Data
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-48 bg-slate-800 border-slate-700"
        align="end"
      >
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700"
        >
          <Sheet className="mr-2 h-4 w-4" />
          Excel (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700"
        >
          <FileText className="mr-2 h-4 w-4" />
          PDF Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
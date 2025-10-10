/**
 * PDF-related type definitions
 */

/**
 * PDF document state
 */
export interface PdfState {
  /** The loaded PDF document */
  document: any; // PDFDocumentProxy from pdfjs-dist
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Original filename */
  filename: string;
  /** Rendered image data for current page */
  imageData: ImageData | null;
  /** PDF page dimensions */
  width: number;
  height: number;
  /** Opacity (0-1) */
  opacity: number;
  /** Position offset on canvas */
  offset: { x: number; y: number };
  /** Scale factor for PDF rendering */
  scale: number;
}


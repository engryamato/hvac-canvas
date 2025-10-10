/**
 * PDF Loading and Rendering Utilities
 * 
 * Uses PDF.js to load and render PDF files on canvas
 */

import * as pdfjsLib from 'pdfjs-dist';
import type { PdfState } from '../../types';

// Configure PDF.js worker - use local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Load a PDF file and return initial PDF state
 * 
 * @param file - The PDF file to load
 * @returns Promise resolving to PdfState
 */
export async function loadPdfFile(file: File): Promise<PdfState> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;
    
    // Get first page to determine dimensions
    const page = await pdfDocument.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });
    
    return {
      document: pdfDocument,
      currentPage: 1,
      totalPages: pdfDocument.numPages,
      filename: file.name,
      imageData: null,
      width: viewport.width,
      height: viewport.height,
      opacity: 0.5, // Default 50% opacity
      offset: { x: 0, y: 0 }, // Center will be calculated when rendering
      scale: 1.0
    };
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Render a PDF page to ImageData
 * 
 * @param pdfState - Current PDF state
 * @param pageNumber - Page number to render (1-based)
 * @param renderScale - Scale factor for rendering quality
 * @returns Promise resolving to ImageData
 */
export async function renderPdfPage(
  pdfState: PdfState,
  pageNumber: number = pdfState.currentPage,
  renderScale: number = 2.0 // Higher scale for better quality
): Promise<ImageData> {
  try {
    const page = await pdfState.document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: renderScale });
    
    // Create off-screen canvas for rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Render PDF page
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    return imageData;
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    throw new Error(`Failed to render PDF page: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate centered position for PDF on canvas
 * 
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height
 * @param pdfWidth - PDF width
 * @param pdfHeight - PDF height
 * @returns Offset position to center PDF
 */
export function calculateCenteredPosition(
  canvasWidth: number,
  canvasHeight: number,
  pdfWidth: number,
  pdfHeight: number
): { x: number; y: number } {
  return {
    x: (canvasWidth - pdfWidth) / 2,
    y: (canvasHeight - pdfHeight) / 2
  };
}

/**
 * Draw PDF ImageData on canvas with opacity
 *
 * @param ctx - Canvas 2D context
 * @param imageData - PDF page image data
 * @param x - X position
 * @param y - Y position
 * @param width - Display width
 * @param height - Display height
 * @param opacity - Opacity (0-1)
 */
export function drawPdfOnCanvas(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number,
  opacity: number
): void {
  // Save current context state
  ctx.save();

  // Set opacity
  ctx.globalAlpha = opacity;

  // Create temporary canvas for the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext('2d');

  if (tempCtx) {
    tempCtx.putImageData(imageData, 0, 0);
    // Draw with specified width and height to scale down from render resolution
    ctx.drawImage(tempCanvas, x, y, width, height);
  }

  // Restore context state
  ctx.restore();
}


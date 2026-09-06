// utils/screenshot.js

/**
 * 下载 PNG 截图（原有功能）
 */
export const downloadFullPageScreenshot = async (element, fileName = 'report.png') => {
  try {
    const module = await import('html2canvas');
    const html2canvas = module.default || module;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      windowHeight: document.documentElement.scrollHeight,
      windowWidth: document.documentElement.scrollWidth,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('截图失败:', error);
  }
};

/**
 * 导出为 PDF（新增）
 */
export const downloadAsPDF = async (element, fileName = 'report.pdf') => {
  try {
    // 截图
    const module = await import('html2canvas');
    const html2canvas = module.default || module;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      windowHeight: document.documentElement.scrollHeight,
      windowWidth: document.documentElement.scrollWidth,
    });

    // 转为 JPEG 数据
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const response = await fetch(imgData);
    const jpegBytes = await response.arrayBuffer();

    // 使用 pdf-lib 创建 PDF
    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const image = await pdfDoc.embedJpg(jpegBytes);
    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });

    // 下载
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('PDF 导出失败:', error);
  }
};
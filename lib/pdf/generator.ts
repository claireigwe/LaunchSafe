export async function generatePdfFromHtml(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

export function generatePdfFromText(
  title: string,
  content: string,
  businessName: string,
  filename: string
): void {
  const { jsPDF } = require("jspdf");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  function addText(text: string, size: number, bold: boolean) {
    if (y > 270) {
      pdf.addPage();
      y = margin;
    }
    pdf.setFontSize(size);
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, margin, y);
    y += lines.length * (size * 0.35) + 4;
  }

  function addLine() {
    if (y > 275) { pdf.addPage(); y = margin; }
    y += 3;
    pdf.setDrawColor(220);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 6;
  }

  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(37, 99, 235);
  pdf.text("LaunchSafe", margin, y);
  y += 10;

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text(title, margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  pdf.text(`Generated: ${dateStr}`, margin, y);
  y += 4;
  pdf.text(`Business: ${businessName}`, margin, y);
  y += 8;
  addLine();

  const paragraphs = content.split("\n\n");
  for (const para of paragraphs) {
    const lines = para.trim().split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const isHeading = /^[A-Z][A-Z\s]+$|^\d+\./.test(trimmed);
      const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("[ ]");

      if (isHeading) {
        addText(trimmed, 12, true);
      } else if (isBullet) {
        addText("  •  " + trimmed.replace(/^[-*\s]+/, ""), 10, false);
      } else {
        addText(trimmed, 10, false);
      }
    }
    y += 2;
  }

  pdf.save(filename);
}

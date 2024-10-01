import jsPDF from "jspdf";

interface TweetPreview {
  templateName: string;
  content: string;
  previewImage: string;
}

export const generatePDF = async (
  title: string,
  tweetPreviews: TweetPreview[]
): Promise<Blob> => {
  const pdf = new jsPDF("p", "mm", "a4");
  let yOffset = 10;

  // Add title
  pdf.setFontSize(20);
  pdf.text(title, 10, yOffset);
  yOffset += 15;

  for (const preview of tweetPreviews) {
    // Add the tweet preview image to PDF
    const imgWidth = 190;
    const img = new Image();
    img.src = preview.previewImage;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const imgHeight = (img.height * imgWidth) / img.width;

    if (yOffset + imgHeight > 280) {
      pdf.addPage();
      yOffset = 10;
    }

    pdf.addImage(preview.previewImage, "PNG", 10, yOffset, imgWidth, imgHeight);
    yOffset += imgHeight + 5;

    // Add template name
    pdf.setFontSize(12);
    pdf.text(`Template: ${preview.templateName}`, 10, yOffset);
    yOffset += 10;
  }

  // Return the PDF as a Blob
  return pdf.output("blob");
};

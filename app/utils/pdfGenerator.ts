import jsPDF from "jspdf";
import { StandardFonts } from "pdf-lib";

interface TweetPreview {
  templateName: string;
  content: string;
}

const PAGE_CONFIG = {
  format: "a4" as const,
  orientation: "p" as const,
  unit: "mm" as const,
  margin: 10,
};

const TWEET_STYLE = {
  backgroundColor: "#15202b",
  textColor: "#f7f9f9",
  cornerRadius: 5,
  padding: 10,
  titleFontSize: 18,
  contentFontSize: 12,
  lineHeight: 6,
};

const FONT_NAME = "TwitterFont";

export const generatePDF = async (
  title: string,
  tweetPreviews: TweetPreview[]
): Promise<Blob> => {
  const pdf = new jsPDF(
    PAGE_CONFIG.orientation,
    PAGE_CONFIG.unit,
    PAGE_CONFIG.format
  );

  // Add the custom font
  pdf.addFont(StandardFonts.Helvetica, FONT_NAME, "normal");
  pdf.setFont(FONT_NAME);

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const addPage = (): void => {
    pdf.addPage();
    applyPageStyle(pdf);
  };

  applyPageStyle(pdf);
  addTitle(pdf, title);

  tweetPreviews.forEach((preview, index) => {
    if (index > 0) addPage();
    addTweet(pdf, preview, pageWidth, pageHeight);
    addPage(); // Ensure each tweet ends with a page break
  });

  return pdf.output("blob");
};

const applyPageStyle = (pdf: jsPDF): void => {
  const { getWidth, getHeight } = pdf.internal.pageSize;
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, getWidth(), getHeight(), "F");
};

const addTitle = (pdf: jsPDF, title: string): void => {
  pdf.setFontSize(24);
  pdf.setTextColor(0);
  pdf.text(title, PAGE_CONFIG.margin, PAGE_CONFIG.margin + 10);
};

const addTweet = (
  pdf: jsPDF,
  preview: TweetPreview,
  pageWidth: number,
  pageHeight: number
): void => {
  const boxWidth = pageWidth - PAGE_CONFIG.margin * 2;
  const maxContentWidth = boxWidth - TWEET_STYLE.padding * 2;

  // Set correct background color
  pdf.setFillColor(TWEET_STYLE.backgroundColor);
  pdf.setTextColor(TWEET_STYLE.textColor);

  // Add template name as title
  pdf.setFontSize(TWEET_STYLE.titleFontSize);
  const titleHeight = pdf.getTextDimensions(preview.templateName).h;
  let titleY = PAGE_CONFIG.margin + TWEET_STYLE.padding;

  // Prepare content
  pdf.setFontSize(TWEET_STYLE.contentFontSize);
  const splitContent = pdf.splitTextToSize(preview.content, maxContentWidth);

  // Calculate initial box height
  let boxHeight =
    titleHeight +
    TWEET_STYLE.padding * 3 +
    splitContent.length * TWEET_STYLE.lineHeight;
  let contentY = titleY + titleHeight + TWEET_STYLE.padding;

  // Ensure box doesn't exceed page height
  if (boxHeight > pageHeight - PAGE_CONFIG.margin * 2) {
    boxHeight = pageHeight - PAGE_CONFIG.margin * 2;
  }

  // Draw initial box
  pdf.roundedRect(
    PAGE_CONFIG.margin,
    PAGE_CONFIG.margin,
    boxWidth,
    boxHeight,
    TWEET_STYLE.cornerRadius,
    TWEET_STYLE.cornerRadius,
    "F"
  );

  // Add the title
  pdf.text(
    preview.templateName,
    PAGE_CONFIG.margin + TWEET_STYLE.padding,
    titleY
  );

  // Add the content
  splitContent.forEach((line: string) => {
    if (contentY + TWEET_STYLE.lineHeight > pageHeight - PAGE_CONFIG.margin) {
      // Move to next page
      pdf.addPage();
      applyPageStyle(pdf);
      pdf.setFillColor(TWEET_STYLE.backgroundColor);
      pdf.setTextColor(TWEET_STYLE.textColor);

      // Reset Y positions for new page
      titleY = PAGE_CONFIG.margin + TWEET_STYLE.padding;
      contentY = titleY + TWEET_STYLE.padding;

      // Draw new box on new page
      boxHeight = pageHeight - PAGE_CONFIG.margin * 2;
      pdf.roundedRect(
        PAGE_CONFIG.margin,
        PAGE_CONFIG.margin,
        boxWidth,
        boxHeight,
        TWEET_STYLE.cornerRadius,
        TWEET_STYLE.cornerRadius,
        "F"
      );
    }

    pdf.text(line, PAGE_CONFIG.margin + TWEET_STYLE.padding, contentY);
    contentY += TWEET_STYLE.lineHeight;
  });
};

import html2canvas from "html2canvas";

export async function exportAsImage(
  element: HTMLElement,
  filename: string = "phone-case-design"
): Promise<string> {
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  const dataUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();

  return dataUrl;
}

export async function generateThumbnail(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: 200,
    height: 400,
  });

  return canvas.toDataURL("image/png");
}

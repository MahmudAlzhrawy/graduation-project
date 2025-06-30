export const isValidImage = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true); // valid image
    img.onerror = () => resolve(false); // broken or blocked
  });
};

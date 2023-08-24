import cheerio from "cheerio";

export const extractTextToHTML = (html) => {
  const $ = cheerio.load(html);

  const textElements = $("*:not(script)")
    .contents()
    .filter(function () {
      return this.nodeType === 3;
    });

  return textElements
    .map(function () {
      return $(this).text();
    })
    .get()
    .join(" ");
};

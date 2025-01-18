if (typeof chrome !== "undefined") {
  chrome.storage.local.get({ dataUrls: [] }, (result) => {
    console.log(result);
    const dataUrls = result.dataUrls;
    console.log(dataUrls);
    dataUrls.forEach((dataUrl) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = dataUrl;
      document.head.appendChild(link);
    });
  });
}

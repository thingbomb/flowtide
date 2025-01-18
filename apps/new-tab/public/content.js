async function checkIfUrlIsAlreadySaved(url) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ dataUrls: [] }, (result) => {
      const dataUrls = result.dataUrls;
      if (dataUrls.includes(url)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

const saveDataUrl = () => {
  document.querySelectorAll("button[data-url]").forEach(async (button) => {
    const dataUrl = button.getAttribute("data-url");
    const isUrlAlreadySaved = await checkIfUrlIsAlreadySaved(dataUrl);
    if (dataUrl.startsWith("data:text/css;base64,") && !isUrlAlreadySaved) {
      button.disabled = false;
      button.innerHTML = "Add to Flowtide";
    } else if (isUrlAlreadySaved) {
      button.disabled = false;
      button.innerHTML = "Remove from Flowtide";
    }

    button.addEventListener("click", async () => {
      const isSaved = await checkIfUrlIsAlreadySaved(dataUrl);
      if (isSaved) {
        chrome.storage.local.get({ dataUrls: [] }, (result) => {
          const dataUrls = result.dataUrls;
          const index = dataUrls.indexOf(dataUrl);
          dataUrls.splice(index, 1);
          chrome.storage.local.set({ dataUrls });

          button.innerHTML = "Add to Flowtide";
          button.disabled = false;
        });
      } else {
        chrome.storage.local.get({ dataUrls: [] }, (result) => {
          const dataUrls = result.dataUrls;
          dataUrls.push(dataUrl);
          chrome.storage.local.set({ dataUrls });

          button.innerHTML = "Remove from Flowtide";
          button.disabled = false;
        });
      }
    });
  });
};

saveDataUrl();

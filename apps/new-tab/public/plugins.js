/*
    Flowtide
    Copyright (C) 2024-present George Stone

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    https://github.com/thingbomb/flowtide
*/

if (typeof chrome !== "undefined" && chrome.storage?.local) {
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

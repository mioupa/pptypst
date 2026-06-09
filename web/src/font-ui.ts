/**
 * UI wiring for the "Custom fonts" panel: adding font files (by upload or URL),
 * listing the loaded fonts, and removing them. Adding or removing a font
 * updates the Typst compiler's fonts and refreshes the preview.
 */

import { DOM_IDS, STORAGE_KEYS } from "./constants.js";
import {
  getButtonElement,
  getDetailsElement,
  getHTMLElement,
  getInputElement,
} from "./utils/dom.js";
import { getStoredValue, storeValue } from "./utils/storage.js";
import {
  addFontFromFile,
  addFontFromUrl,
  getUserFonts,
  removeFont,
  type UserFont,
} from "./registry/user-fonts.js";
import { reloadCompilerFonts } from "./typst.js";
import { updatePreview } from "./preview.js";
import { setStatus } from "./ui.js";

/**
 * Initializes the custom-fonts panel: restores its open state, renders the
 * current fonts, and wires up the file input.
 */
export function setupFontsPanel() {
  const details = getDetailsElement(DOM_IDS.FONTS_DETAILS);
  details.open = getStoredValue(STORAGE_KEYS.FONTS_OPEN) === "true";
  details.addEventListener("toggle", () => {
    storeValue(STORAGE_KEYS.FONTS_OPEN, details.open.toString());
  });

  const input = getInputElement(DOM_IDS.FONTS_INPUT);
  input.addEventListener("change", () => {
    void handleFilesSelected(input);
  });

  const urlInput = getInputElement(DOM_IDS.FONTS_URL_INPUT);
  const urlButton = getButtonElement(DOM_IDS.FONTS_URL_BTN);
  urlButton.addEventListener("click", () => {
    void handleUrlSubmit(urlInput);
  });
  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleUrlSubmit(urlInput);
    }
  });

  renderFontsList();
}

/**
 * Fetches a font from the pasted URL, adds it, reloads the compiler and
 * refreshes the preview.
 */
async function handleUrlSubmit(urlInput: HTMLInputElement) {
  const url = urlInput.value.trim();
  if (!url) {
    return;
  }

  setStatus("Loading font from URL…");
  let key: string;
  try {
    const font = await addFontFromUrl(url);
    key = font.key;
  } catch (error) {
    console.error("Failed to add font from URL:", error);
    setStatus("Could not load a font from that URL (check the link and CORS).", true);
    return;
  }

  urlInput.value = "";
  await reloadCompilerFonts();
  renderFontsList();
  await updatePreview();
  setStatus(`Added: ${key}`);
}

/**
 * Reads the selected files, adds them as user fonts, reloads the compiler and
 * refreshes the preview.
 */
async function handleFilesSelected(input: HTMLInputElement) {
  const files = Array.from(input.files ?? []);
  if (files.length === 0) {
    return;
  }
  // Reset so selecting the same file again still fires a change event.
  input.value = "";

  setStatus(`Loading ${files.length.toString()} font(s)…`);
  const added: string[] = [];
  try {
    for (const file of files) {
      const font = await addFontFromFile(file);
      added.push(font.key);
    }
  } catch (error) {
    console.error("Failed to add custom font:", error);
    setStatus("Could not read that font file.", true);
    return;
  }

  await reloadCompilerFonts();
  renderFontsList();
  await updatePreview();
  setStatus(`Added: ${added.join(", ")}`);
}

/**
 * Removes a font, reloads the compiler and refreshes the preview.
 */
async function handleRemove(key: string) {
  await removeFont(key);
  await reloadCompilerFonts();
  renderFontsList();
  await updatePreview();
  setStatus("");
}

/**
 * Renders the list of loaded custom fonts.
 */
function renderFontsList() {
  const list = getHTMLElement(DOM_IDS.FONTS_LIST);
  list.innerHTML = "";

  const fonts = getUserFonts();
  if (fonts.length === 0) {
    const empty = document.createElement("li");
    empty.className = "fonts-empty";
    empty.textContent = "No custom fonts yet.";
    list.appendChild(empty);
    return;
  }

  for (const font of fonts) {
    list.appendChild(createFontRow(font));
  }
}

/**
 * Builds a single list row for a loaded font.
 */
function createFontRow(font: UserFont): HTMLLIElement {
  const row = document.createElement("li");
  row.className = "fonts-item";

  const info = document.createElement("div");
  info.className = "fonts-item-info";

  const familyRow = document.createElement("div");
  familyRow.className = "fonts-item-family-row";

  const family = document.createElement("code");
  family.className = "fonts-item-family";
  family.textContent = font.family;
  family.title = `Use in Typst: #set text(font: "${font.family}")`;
  familyRow.appendChild(family);

  if (font.subfamily) {
    const style = document.createElement("span");
    style.className = "fonts-item-style";
    style.textContent = font.subfamily;
    familyRow.appendChild(style);
  }

  const fileName = document.createElement("span");
  fileName.className = "fonts-item-file";
  fileName.textContent = font.fileName;

  info.append(familyRow, fileName);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "fonts-item-remove";
  remove.textContent = "✕";
  remove.title = `Remove ${font.family}`;
  remove.setAttribute("aria-label", `Remove ${font.family}`);
  remove.onclick = () => void handleRemove(font.key);

  row.append(info, remove);
  return row;
}

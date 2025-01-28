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

import {
  AlignCenter,
  AlignVerticalJustifyStart,
  ArrowLeft,
  Bookmark,
  Calendar,
  Calendar1,
  Clock,
  CloudLightningIcon,
  File,
  Grid,
  Hourglass,
  Image,
  Link,
  MessageCircle,
  Moon,
  PaintBucket,
  Palette,
  RefreshCcw,
  Settings,
  Square,
  Sunrise,
  Text,
} from "lucide-solid";
import { createSignal, on, onMount } from "solid-js";
import { createStoredSignal } from "./hooks/localStorage";
import { cn } from "./libs/cn";
import { TextField, TextFieldRoot } from "./components/ui/textfield";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

function BigButton(props: any) {
  return (
    <button class="card-style" {...props}>
      <div class="icon">{props.icon}</div>
      <span class="text-xl">{props.title}</span>
    </button>
  );
}

function SettingsTrigger({
  className,
  triggerClass,
}: {
  className?: string;
  triggerClass?: string;
}) {
  function textToImage(text: string) {
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");

    canvas.width = 128;
    canvas.height = 128;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let fontSize = 128;
    ctx.font = `bold ${fontSize}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    while (ctx.measureText(text).width > canvas.width - 10 && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px system-ui`;
    }

    if (document.documentElement.style.colorScheme === "dark") {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "black";
    }

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
  }

  const [open, setOpen] = createSignal(false);
  const [font, setFont] = createStoredSignal("font", "sans");
  const [theme, setTheme] = createStoredSignal("kb-color-mode", "system");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [clockFormat, setClockFormat] = createStoredSignal(
    "clockFormat",
    "12h"
  );
  const [squareWidgets, setSquareWidgets] = createStoredSignal(
    "squareWidgets",
    false
  );
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [greetingNameValue, setGreetingNameValue] = createSignal(name());
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [pageTitleValue, setPageTitleValue] = createSignal(pageTitle());
  const [pageIcon, setPageIcon] = createStoredSignal("pageIcon", "");
  const [color, setColor] = createStoredSignal("color", "unset");
  const [pageIconValue, setPageIconValue] = createSignal(pageIcon());
  const [opacity, setOpacity] = createStoredSignal<number>("opacity", 0.8);
  const [settingsMenu, setSettingsMenu] = createSignal<string>("general");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [hideSettings, setHideSettings] = createStoredSignal(
    "hideSettings",
    false
  );
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
  );
  const [localFileImage, setLocalFileImage] = createStoredSignal(
    "localFile",
    ""
  );
  const [dateFormat, setDateFormat] = createStoredSignal(
    "dateFormat",
    "normal"
  );
  const [customUrl, setCustomUrl] = createStoredSignal("customUrl", "");
  const [wallpaperChangeTime, setWallpaperChangeTime] =
    createStoredSignal<number>("wallpaperChangeTime", 1000 * 60 * 60 * 24);
  const [pageIconURL, setPageIconURL] = createStoredSignal(
    "iconUrl",
    "assets/logo.png"
  );
  const [textStyle, setTextStyle] = createStoredSignal("textStyle", "normal");
  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setOpen(true);
      }
    });
  });
  function SettingsPage() {
    return (
      <div
        class={cn("text-foreground flex flex-col sm:flex-row", {
          "**:font-sans": font() == "sans",
          "**:font-serif": font() == "serif",
          "**:font-mono": font() == "mono",
          "**:font-comic-sans": font() == "comic-sans",
        })}
      >
        <div
          id="sidebar"
          class="sm:max-w-50 sticky top-0 flex h-[140px] w-full max-w-full flex-col gap-2 sm:h-full"
        >
          <button
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10 data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5 dark:data-[selected]:bg-white/10"
            {...(settingsMenu() == "general"
              ? { "data-selected": "true" }
              : "")}
            id="generalButton"
            onmousedown={() => {
              setSettingsMenu("general");
            }}
          >
            <Settings
              height={20}
              class="size-6 justify-start rounded-lg bg-purple-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("general")}
          </button>
          <button
            {...(settingsMenu() == "appearance"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("appearance");
            }}
            id="appearanceButton"
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10 data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5 dark:data-[selected]:bg-white/10"
          >
            <Palette
              height={20}
              class="size-6 rounded-lg bg-pink-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("appearance")}
          </button>
          <button
            {...(settingsMenu() == "background"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("background");
            }}
            id="backgroundButton"
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10 data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5 dark:data-[selected]:bg-white/10"
          >
            <Image
              height={20}
              class="size-6 rounded-lg bg-teal-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("background")}
          </button>
        </div>
        <div class="h-full w-full overflow-y-auto p-10 pt-0">
          {settingsMenu() === "general" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("mode")}
              </h3>
              <div class="card-group grid-cols-3 grid-rows-1">
                <BigButton
                  {...(mode() === "widgets" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setMode("widgets");
                  }}
                  title={chrome.i18n.getMessage("widgets")}
                  icon={<Grid class="size-[64px]" />}
                />
                <BigButton
                  {...(mode() === "nightstand"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setMode("nightstand");
                  }}
                  title={chrome.i18n.getMessage("nightstand")}
                  icon={<Clock class="size-[64px]" />}
                />
                <BigButton
                  {...(mode() === "speeddial" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setMode("speeddial");
                  }}
                  title={chrome.i18n.getMessage("speed_dial")}
                  icon={<Bookmark class="size-[64px]" />}
                />
              </div>
              <br />
              <br />
              {mode() === "widgets" && (
                <div>
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("layout")}
                  </h3>
                  <div class="card-group grid-cols-2 grid-rows-1">
                    <BigButton
                      {...(layout() === "center"
                        ? { "data-selected": true }
                        : {})}
                      onmousedown={() => {
                        setLayout("center");
                      }}
                      title={chrome.i18n.getMessage("center")}
                      icon={
                        <AlignCenter class="size-[64px]" fill="currentColor" />
                      }
                    />
                    <BigButton
                      {...(layout() === "top" ? { "data-selected": true } : {})}
                      onmousedown={() => {
                        setLayout("top");
                      }}
                      title={chrome.i18n.getMessage("top")}
                      icon={
                        <AlignVerticalJustifyStart
                          class="size-[64px]"
                          fill="currentColor"
                        />
                      }
                    />
                  </div>
                </div>
              )}
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("greeting")}
              </h3>
              <div class="flex max-w-full items-start gap-2">
                <TextFieldRoot class="flex-1">
                  <TextField
                    placeholder={chrome.i18n.getMessage("enter_greeting")}
                    value={greetingNameValue()}
                    onInput={(e) => setGreetingNameValue(e.currentTarget.value)}
                  />
                  <span class="text-muted-foreground text-sm">
                    {chrome.i18n.getMessage("leave_blank_to_disable")}
                  </span>
                </TextFieldRoot>
                <Button
                  onmousedown={() => setName(greetingNameValue())}
                  disabled={name() == greetingNameValue()}
                >
                  {name() == greetingNameValue()
                    ? chrome.i18n.getMessage("saved")
                    : chrome.i18n.getMessage("set_greeting")}
                </Button>
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("page")}
              </h3>
              <div class="flex items-start gap-2">
                <TextFieldRoot class="flex flex-1 gap-2">
                  <TextField
                    placeholder={chrome.i18n.getMessage("icon")}
                    class="h-10 w-10"
                    value={pageIconValue()}
                    onInput={(e) => setPageIconValue(e.currentTarget.value)}
                  />
                  <TextField
                    placeholder={chrome.i18n.getMessage("new_tab")}
                    class="h-10"
                    value={pageTitleValue()}
                    onInput={(e) => setPageTitleValue(e.currentTarget.value)}
                  />
                </TextFieldRoot>
                <Button
                  onmousedown={() => {
                    setPageTitle(pageTitleValue());
                    setPageIcon(pageIconValue());
                    setPageIconURL(
                      pageIconValue() == ""
                        ? "assets/logo.png"
                        : textToImage(pageIconValue())
                    );
                  }}
                  disabled={
                    pageTitle() == pageTitleValue() &&
                    pageIcon() == pageIconValue()
                  }
                >
                  {pageTitle() == pageTitleValue() &&
                  pageIcon() == pageIconValue()
                    ? chrome.i18n.getMessage("saved")
                    : chrome.i18n.getMessage("save")}
                </Button>
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("more")}
              </h3>
              <div class="flex gap-2">
                <a
                  href="https://discord.gg/QEPd4MA3zF"
                  class="text-gray-800 dark:text-white"
                >
                  Discord
                </a>
                •
                <a
                  href="https://github.com/thingbomb/flowtide/discussions"
                  class="text-gray-800 dark:text-white"
                >
                  {chrome.i18n.getMessage("forum")}
                </a>
                •
                <a
                  href="https://feedback.flowtide.app/feature-requests"
                  class="text-gray-800 dark:text-white"
                >
                  {chrome.i18n.getMessage("feature_request")}
                </a>
              </div>
            </>
          )}
          {settingsMenu() === "appearance" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("font")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-2">
                <BigButton
                  {...(font() === "sans" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("sans");
                  }}
                  title={chrome.i18n.getMessage("sans")}
                  icon={<span class="!font-sans !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "serif" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("serif");
                  }}
                  title={chrome.i18n.getMessage("serif")}
                  icon={<span class="!font-serif !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "mono" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("mono");
                  }}
                  title={chrome.i18n.getMessage("mono")}
                  icon={<span class="!font-mono !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "comic-sans"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setFont("comic-sans");
                  }}
                  title={chrome.i18n.getMessage("comic_sans")}
                  icon={
                    <span class="!font-comic-sans !text-5xl font-bold">Aa</span>
                  }
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("text_style")}
              </h3>
              <div class="card-group grid-cols-3 grid-rows-1">
                <BigButton
                  {...(textStyle() === "uppercase"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setTextStyle("uppercase");
                  }}
                  title={chrome.i18n.getMessage("uppercase")}
                  icon={<span class="!text-5xl font-bold !uppercase">AA</span>}
                />
                <BigButton
                  {...(textStyle() === "normal"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setTextStyle("normal");
                  }}
                  title={chrome.i18n.getMessage("normal")}
                  icon={
                    <span class="!text-5xl font-bold !normal-case">Aa</span>
                  }
                />
                <BigButton
                  {...(textStyle() === "lowercase"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setTextStyle("lowercase");
                  }}
                  title={chrome.i18n.getMessage("lowercase")}
                  icon={<span class="!text-5xl font-bold !lowercase">aa</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("clock_format")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(clockFormat() === "12h"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setClockFormat("12h");
                  }}
                  icon={<span class="!text-5xl font-bold">12h</span>}
                />
                <BigButton
                  {...(clockFormat() === "24h"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setClockFormat("24h");
                  }}
                  icon={<span class="!text-5xl font-bold">24h</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("date_format")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(dateFormat() === "normal"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setDateFormat("normal");
                  }}
                  icon={<span class="!text-5xl font-bold">Normal</span>}
                />
                <BigButton
                  {...(dateFormat() === "iso-8601"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setDateFormat("iso-8601");
                  }}
                  icon={<span class="!text-5xl font-bold">ISO-8601</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="mb-2 text-lg font-[600]">
                {chrome.i18n.getMessage("square_widgets")}
              </h3>
              <div class="flex">
                <input
                  type="checkbox"
                  class="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                  id="hs-checked-checkbox"
                  onChange={(e) => setSquareWidgets(e.currentTarget.checked)}
                  checked={squareWidgets()}
                />
                <label
                  for="hs-checked-checkbox"
                  class="ms-3 text-sm text-gray-500 dark:text-neutral-400"
                >
                  {chrome.i18n.getMessage("square_widgets_description")}
                </label>
              </div>
              <br />
              <br />
              <h3 class="mb-2 text-lg font-[600]">
                {chrome.i18n.getMessage("hide_settings")}
              </h3>
              <div class="flex">
                <input
                  type="checkbox"
                  class="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                  id="hs-checked-checkbox"
                  onChange={(e) => setHideSettings(e.currentTarget.checked)}
                  checked={hideSettings()}
                />
                <label
                  for="hs-checked-checkbox"
                  class="ms-3 text-sm text-gray-500 dark:text-neutral-400"
                >
                  {chrome.i18n.getMessage("hide_settings_description")}
                </label>
              </div>
            </>
          )}
          {settingsMenu() === "background" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("background")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(background() === "image"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("image");
                  }}
                  title={chrome.i18n.getMessage("image")}
                  icon={<Image class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "solid-color"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("solid-color");
                  }}
                  title={chrome.i18n.getMessage("solid_color")}
                  icon={<PaintBucket class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "gradient"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("gradient");
                  }}
                  title={chrome.i18n.getMessage("gradient")}
                  icon={<Sunrise class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "blank"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("blank");
                  }}
                  title={chrome.i18n.getMessage("blank")}
                  icon={<Square class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "custom-url"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("custom-url");
                  }}
                  title={chrome.i18n.getMessage("custom_url")}
                  icon={<Link class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "local-file"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("local-file");
                  }}
                  title={chrome.i18n.getMessage("local_file")}
                  icon={<File class="size-[64px]" fill="none" />}
                />
              </div>
              {background() === "custom-url" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("custom_url")}
                  </h3>
                  <TextFieldRoot class="flex-1">
                    <TextField
                      placeholder={chrome.i18n.getMessage("custom_url")}
                      value={customUrl()}
                      onInput={(e) =>
                        setCustomUrl(e.currentTarget.value.trim())
                      }
                    />
                  </TextFieldRoot>
                </>
              )}
              {background() === "solid-color" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("custom_color")}
                  </h3>
                  <input
                    type="color"
                    class="block h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
                    id="hs-color-input"
                    value={color()}
                    onInput={(e) => setColor(e.currentTarget.value)}
                    title="Choose your color"
                  />
                </>
              )}
              {background() === "local-file" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("local_file")}
                  </h3>
                  <form class="max-w-sm">
                    <label for="file-input" class="sr-only">
                      {chrome.i18n.getMessage("choose_file")}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="file-input"
                      id="file-input"
                      onChange={(e) => {
                        const files: FileList | null = e.target?.files;
                        if (files && files[0]) {
                          if (!files[0].type.startsWith("image/")) {
                            alert(chrome.i18n.getMessage("invalid_file_type"));
                            return;
                          }
                          const reader = new FileReader();

                          reader.onload = (e) => {
                            if (e.target && e.target.result) {
                              if (
                                e.target.result.toString().length >
                                2.5 * 1024 * 1024
                              ) {
                                alert(chrome.i18n.getMessage("file_too_large"));
                                return;
                              }
                              setLocalFileImage(e.target.result.toString());
                            }
                          };

                          reader.onerror = () => {
                            alert(chrome.i18n.getMessage("file_read_error"));
                          };

                          reader.readAsDataURL(files[0]);
                        }
                      }}
                      class="block w-full rounded-lg border-none bg-neutral-500 text-sm text-white backdrop-blur-3xl file:me-4 file:border-0 file:bg-neutral-600 file:px-4 file:py-3 file:text-white focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-black/5 dark:text-neutral-400 dark:file:bg-white/10 dark:file:text-neutral-400"
                    />
                  </form>
                </>
              )}
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("new_wallpaper")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1);
                  }}
                  title={chrome.i18n.getMessage("every_reload")}
                  icon={<RefreshCcw class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60);
                  }}
                  title={chrome.i18n.getMessage("every_hour")}
                  icon={<Hourglass class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60 * 24
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24);
                  }}
                  title={chrome.i18n.getMessage("every_day")}
                  icon={<Calendar1 class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60 * 24 * 7
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24 * 7);
                  }}
                  title={chrome.i18n.getMessage("every_week")}
                  icon={<Calendar class="size-[64px]" fill="none" />}
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("opacity")}
              </h3>
              <div class="flex items-start gap-2">
                <input
                  type="range"
                  class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
                  value={Number(opacity()) * 100}
                  onInput={(e) =>
                    setOpacity(Number(e.currentTarget.value) / 100)
                  }
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("wallpaper_blur")}
              </h3>
              <div class="flex items-start gap-2">
                <input
                  type="range"
                  class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
                  value={Number(wallpaperBlur() * 2.5)}
                  onInput={(e) =>
                    setWallpaperBlur(Number(e.currentTarget.value) / 2.5)
                  }
                />
              </div>
            </>
          )}
          <br />
          <br />
          <p>
            Open-source on{" "}
            <a href="https://github.com/thingbomb/flowtide">GitHub</a>. Released
            under{" "}
            <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a>.
          </p>
          <br />
        </div>
      </div>
    );
  }

  return (
    <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
      <DialogTrigger
        id="settingsButton"
        class={triggerClass}
        aria-label={chrome.i18n.getMessage("add_widget")}
      >
        <Settings class="transition-transform" />
      </DialogTrigger>
      <DialogContent
        class={cn(
          "max-w-3xl",
          textStyle() == "uppercase" ? "**:!uppercase" : "",
          textStyle() == "lowercase" ? "**:lowercase" : ""
        )}
      >
        <DialogHeader>
          <DialogTitle class="mb-4 pl-4">
            {chrome.i18n.getMessage("settings")}
          </DialogTitle>
          <SettingsPage />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export { SettingsTrigger };

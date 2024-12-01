# Flowtide

<a href="https://chromewebstore.google.com/detail/flowtide-beautiful-new-ta/fpdjjjmglibdjocjpcchgkbakeelaghm"><img alt="Chrome Web Store Users" src="https://img.shields.io/chrome-web-store/users/fpdjjjmglibdjocjpcchgkbakeelaghm?color=red"></a>

Flowtide is a beautiful, smart New Tab page for your browser. Magic Search is the core feature of Flowtide, allowing you to easily complete tasks (e.g. making a Google Doc or Excel workbook) and search your bookmarks all with `/`.

![Screenshot](https://utfs.io/f/rY9f3xCqBWAKPdnBT85CnSYuHethWmJioz4IcG2bM5FX8TD3)

## Install for your browser

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/flowtide-new-tab/)
- [Chrome](https://chromewebstore.google.com/detail/flowtide-beautiful-new-ta/fpdjjjmglibdjocjpcchgkbakeelaghm)
- [Vivaldi](https://docs.flowtide.app/install-guides/vivaldi)

## License

This project is licensed under the GPLv3 license.

## Developing the extension

First, install the dependencies:

```bash
pnpm install
```

Then, start the development server:

```bash
pnpm dev
```

To test the extension in the browser, go to `chrome://extensions` and enable developer mode. Then, click on "Load unpacked" and select the `dist` directory.


## Building from source

First, install the dependencies:

```bash
pnpm install
```

Then, build the extension:

```bash
pnpm build-only
```

The extension's source code will be inside the `dist` folder.

## Contributions

We welcome contributions! If you have suggestions or improvements, please:

- **Open an Issue**: [Create an issue](https://github.com/Thingbomb/Flowtide/issues).
- **Submit a Pull Request**: [Submit a pull request](https://github.com/Thingbomb/Flowtide/pulls).

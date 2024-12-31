# Flowtide

<a href="https://chromewebstore.google.com/detail/flowtide-beautiful-new-ta/fpdjjjmglibdjocjpcchgkbakeelaghm"><img alt="Chrome Web Store Users" src="https://img.shields.io/chrome-web-store/users/fpdjjjmglibdjocjpcchgkbakeelaghm?color=red"></a>

Flowtide is a heavily customizable, beautiful, and modular New Tab page. Flowtide lets you build your New Tab page, customizing it every step of the way, using a simple drag-and-drop widget system. Get stuff done with todos and the pomodoro technique, relax with soundscapes, and move faster with Magic Search.

Features:

- Widget-based system for max customizability
- Use it as a speed dial or a nightstand-style clock
- Listen to relaxing soundscapes
- Focus with the pomodoro technique
- Beautiful background images, solid colors, gradients, all up to you
- Change the font, layout, theme, and more
- Be greeted on every New Tab

<img src="https://github.com/user-attachments/assets/f47196ea-7c95-4ac4-ae19-8a894551c458" style="border-radius: 24px;">

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

Go to the port shown for the development server.

## Building from source

First, install the dependencies:

```bash
pnpm install
```

Then, build the extension:

**Chrome compatible:**

```bash
pnpm build:chrome
```

**Firefox compatible:**

```bash
pnpm build:firefox
```

The extension's source code will be inside the `apps/new-tab/dist` folder.

## Contributions

We welcome contributions! If you have suggestions or improvements, please:

- **Open an Issue**: [Create an issue](https://github.com/Thingbomb/Flowtide/issues).
- **Submit a Pull Request**: [Submit a pull request](https://github.com/Thingbomb/Flowtide/pulls).

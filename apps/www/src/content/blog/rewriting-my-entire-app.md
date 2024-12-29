---
title: "Why I chose Solid to rewrite my app"
pubDate: 2024-12-28
description: "This article goes over the reasons why I rewrote, technical decisions, and the future of Flowtide."
heroImage: "/rewriting.jpg"
author: "George"
---

I decided to rewrite Flowtide entirely using SolidJS. This article will explain the reasons, technical decisions, and the future of Flowtide.

For context, Flowtide is a New Tab page for Chrome and Firefox that aims to be beautiful and customizable. It is free and open-source software.

## New goals

I ultimately realized that Flowtide wasn't doing anything different. It worked like every other New Tab page; clock in the middle, a bookmarks menu, and some sort of background.

I wanted to make it stand out from the crowd, taking a modular approach while keeping the customizability.

After feedback suggesting a 'modular' approach, I planned out suitable solutions for achieving the goal.

With more iteration, I decided the app should be 'block-based.' Think of it as a display of organizable, high-quality widgets on every New Tab.

If you don't like the widget-based approach, I've left in some other options. You can choose nightstand mode, which puts the clock and date front and center. If you like easy access to your most commonly visited websites, you can enable Speed Dial, which puts your first 12 bookmarks front and center for quick access.

After planning out the new details and iterating, I decided that if I am rewriting Flowtide, I must design the application to be future-proofed, really fast, and bug-free. These goals ultimately meant I'd have to switch frameworks.

## Why not just use React?

Before v3, Flowtide used React. React provided a good developer experience and a vast ecosystem but also had many drawbacks.

I had to research and test different options, but eventually, I landed on SolidJS. If you don't know what it is, it is simple and performant reactivity for building user interfaces (from their website.)

This section will explain React's main problems, using Solid to future-proof my app, and explain why I chose Solid instead of other major frameworks.

### The re-render problem

One key benefit of React is its ease of managing state. It's almost as easy as creating a variable and having it always be the text of an element.

React re-renders the entire component and its children whenever you change a state. That means replacing the entirety of the component (which can be very big) in some cases just to change some text.

This behavior can get messy fast, especially if you accidentally wrote a recursive re-render, where changing a state creates an event that changes the state again, and so on.

About a month ago, I decided to benchmark Flowtide by checking how many times the app re-renders in a given moment. I was shocked to find hundreds of re-renders per second, eating away at users' system resources.

It's not just Flowtide. Many popular websites also accidentally re-render too often without their engineers or users noticing anything.

The main point of Solid is fine-grained reactivity, which means it only updates elements where it is relevant.

### Future-proofing my app

React can introduce breaking changes between major releases, requiring substantial effort to migrate your app each time. SolidJS, on the other hand, prioritizes stability and backward compatibility, making it a safer long-term choice for app maintenance.

SolidJS learned from the mistakes of many other frameworks, such as bundle size, performance, and developer experience. In my opinion, Solid distilled the good parts of popular frameworks like Svelte, React, and more and left behind the bad parts.

SolidJS consistently scores in the top 3 in JavaScript framework performance benchmarks, usually slightly below Svelte.

SolidJS also utilizes JSX, the same syntax as React, making it relatively trivial to migrate your existing app.

### Other options

Before settling on SolidJS, I explored different framework options based on my needs.

See: [https://www.solidjs.com/guides/comparison](https://www.solidjs.com/guides/comparison)

**SvelteKit**: I tried to set it up but couldn't figure out how to turn off SSR. I looked at many solutions to the problem only to find Svelte laser-focused on SSR.

SSR means the server will render the page and send you back the code whenever you go to the website, which wouldn't work as it operates as an extension page.

If you are building a full-stack app, SvelteKit is an excellent option that does this exceptionally well.

**Vue**: If I had to rewrite Flowtide again without Solid, this would probably be my choice. Vue uses a template-based approach with special directives, making development slightly more complicated rather than using a more HTML-like syntax. Its usage of the Virtual DOM can make it slower than other alternatives.

**Angular**: Angular is a complex, fully-featured framework with heavy tooling. It is built for large teams and used by Google. I'm just not an Angular person.

Any framework not listed here is likely because it isn't as well-known as these and has a worse ecosystem.

## Drawbacks to Solid

While Solid is great for most use cases, there are definitely drawbacks compared to alternative options.

### Infrequent updates

Unlike other frameworks, Solid lacks frequent updates and contributions. As of December 28, 2024, the last commit was a month ago. While this isn't necessarily bad, Solid might not improve as rapidly as a more mature framework.

### Lack of a mature ecosystem

Unlike more widely adopted frameworks, Solid's ecosystem hasn't matured yet. You'll find incompatible libraries, [uncaught internal errors](https://github.com/solidjs/solid/issues/97), and less documentation and blogs compared to other options.

## The Future for Flowtide

In a future update, I plan on making an API that lets anybody with web development skills extend Flowtide to include new features and capabilities that weren't otherwise possible.

The idea is to use a fully typed JavaScript library as a wrapper for an API that works like `window.flowtide.function()` for different actions.

Once you compile your code using a build tool like Webpack, you can upload the file to Flowtide, and it will run on every New Tab. If you want it to be public, you can file a PR on a dedicated repository that hosts community plugins. All submissions will be examined for malicious code before being made public.

## Conclusion

This update makes Flowtide faster, more customizable, and more feature-rich. Stay tuned for more exciting changes.

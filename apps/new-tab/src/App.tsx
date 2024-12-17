import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import { Button } from "./components/ui/button";
import { ArrowRight } from "lucide-solid";

const App: Component = () => {
  const [needsOnboarding, setNeedsOnboarding] = createSignal(
    localStorage.getItem("onboarding") !== "true",
  );
  const [onboardingScreen, setOnboardingScreen] = createSignal<number>(1);

  const OnboardingScreen1: Component = () => {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center gap-6">
        <h1 class="text-7xl font-[600]">Welcome to Flowtide</h1>
        <Button class="group" onclick={() => setOnboardingScreen(2)}>
          Get started
          <ArrowRight
            class="group-hover:translate-x-1 transition-transform"
            height={16}
          />
        </Button>
      </div>
    );
  };
  const OnboardingScreen2: Component = () => {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center gap-6">
        <div>
          <h1 class="text-5xl font-[600] mb-4">Resources</h1>
          <p class="w-[280px] text-left mb-4">
            If you need any help setting up Flowtide, check out our{" "}
            <a href="https://docs.flowtide.app" class="hover:underline">
              documentation
            </a>{" "}
            or ask me for help on{" "}
            <a
              class="hover:underline"
              href="https://github.com/thingbomb/flowtide/discussions"
            >
              GitHub discussions
            </a>
            .
          </p>
          <Button
            class="group"
            onclick={() => {
              localStorage.setItem("onboarding", "true");
              setNeedsOnboarding(false);
            }}
          >
            Start using Flowtide
            <ArrowRight
              class="group-hover:translate-x-1 transition-transform"
              height={16}
            />
          </Button>
        </div>
      </div>
    );
  };

  const OnboardingFlow: Component = () => {
    return (
      <div class="absolute inset-0 dark:bg-[#2f2f2f]">
        {onboardingScreen() === 1 && <OnboardingScreen1 />}
        {onboardingScreen() === 2 && <OnboardingScreen2 />}
      </div>
    );
  };

  return (
    <main>
      {needsOnboarding() && <OnboardingFlow />}
      <div></div>
    </main>
  );
};

export default App;

<template>
  <div class="auth-brand-particles" aria-hidden="true">
    <div :id="containerId" class="auth-brand-particles__host" />
  </div>
</template>

<script setup>
  import { onBeforeUnmount, onMounted } from "vue";
  import { tsParticles } from "@tsparticles/engine";
  import { loadSlim } from "@tsparticles/slim";

  const containerId = "auth-brand-particles";

  let slimLoaded = false;
  let particleContainer;
  let tabletQuery;
  let desktopQuery;
  let reducedMotionQuery;
  let removeListeners = [];

  function addMediaListener(query, handler) {
    if (!query) {
      return;
    }

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handler);
      removeListeners.push(() => query.removeEventListener("change", handler));
      return;
    }

    query.addListener(handler);
    removeListeners.push(() => query.removeListener(handler));
  }

  function getOptions() {
    const isDesktop = desktopQuery?.matches ?? false;

    return {
      fpsLimit: 60,
      detectRetina: true,
      fullScreen: {
        enable: false,
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      background: {
        color: "transparent",
      },
      particles: {
        number: {
          value: isDesktop ? 46 : 30,
          density: {
            enable: true,
            value_area: 820,
          },
        },
        color: {
          value: [
            "rgba(255, 255, 255, 0.68)",
            "rgba(130, 216, 78, 0.42)",
            "rgba(238, 125, 59, 0.34)",
          ],
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.42,
          random: true,
          anim: {
            enable: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            size_min: 2,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: 136,
          color: "rgba(130, 216, 78, 0.28)",
          frequency: 1,
          opacity: 0.26,
          width: 1,
          triangles: {
            enable: true,
            frequency: 1,
            color: "rgba(238, 125, 59, 0.38)",
            opacity: 0.12,
          },
        },
        move: {
          enable: true,
          speed: isDesktop ? 1.85 : 1.45,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
            mode: "repulse",
          },
          onclick: {
            enable: false,
            mode: "push",
          },
          resize: true,
        },
      },
    };
  }

  async function destroyParticles() {
    if (!particleContainer) {
      return;
    }

    await particleContainer.destroy();
    particleContainer = undefined;
  }

  async function ensureParticles() {
    const canRender =
      tabletQuery?.matches && !(reducedMotionQuery?.matches ?? false);

    if (!canRender) {
      await destroyParticles();
      return;
    }

    if (!slimLoaded) {
      await loadSlim(tsParticles);
      slimLoaded = true;
    }

    await destroyParticles();

    particleContainer = await tsParticles.load({
      id: containerId,
      options: getOptions(),
    });
  }

  onMounted(async () => {
    tabletQuery = window.matchMedia("(min-width: 768px)");
    desktopQuery = window.matchMedia("(min-width: 1024px)");
    reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    addMediaListener(tabletQuery, ensureParticles);
    addMediaListener(desktopQuery, ensureParticles);
    addMediaListener(reducedMotionQuery, ensureParticles);

    await ensureParticles();
  });

  onBeforeUnmount(async () => {
    for (const removeListener of removeListeners) {
      removeListener();
    }

    removeListeners = [];
    await destroyParticles();
  });
</script>

<style scoped>
  .auth-brand-particles {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .auth-brand-particles__host {
    width: 100%;
    height: 100%;
    opacity: 0.94;
  }

  .auth-brand-particles__host :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
    opacity: 0.78;
  }

  @media (max-width: 767px) {
    .auth-brand-particles {
      display: none;
    }
  }
</style>

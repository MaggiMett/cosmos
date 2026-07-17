import { defineAsyncComponent, defineComponent, h } from "vue";
import { useRoute } from "vue-router";

const CosmosView = defineAsyncComponent(() => import("./CosmosView.vue"));

export default defineComponent({
  name: "EnvironmentView",
  setup() {
    const route = useRoute();
    return () => {
      if (route.meta.environment === "cosmos") return h(CosmosView);
      return h("section", {
        class: "environment-view",
        "data-environment": route.meta.environment,
        "aria-label": `${route.meta.title} environment`,
      });
    };
  },
});

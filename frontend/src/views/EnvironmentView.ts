import { defineComponent, h } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "EnvironmentView",
  setup() {
    const route = useRoute();
    return () =>
      h("section", {
        class: "environment-view",
        "data-environment": route.meta.environment,
        "aria-label": `${route.meta.title} environment`,
      });
  },
});

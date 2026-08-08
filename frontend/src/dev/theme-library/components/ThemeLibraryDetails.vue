<template>
  <aside class="theme-details" aria-label="Selected theme details" data-testid="theme-library-details">
    <header>
      <h2>Nebula Garden</h2>
      <p><span>Installed</span> · <span>Inactive</span></p>
      <small>A luminous conservatory where botanical forms meet deep-space calm.</small>
    </header>

    <section>
      <h3>Screenshots</h3>
      <div class="theme-details__screenshots">
        <ThemeLibraryVisual label="Nebula Garden screenshot one" tone="nebula" variant="screenshot" />
        <ThemeLibraryVisual label="Nebula Garden screenshot two" tone="nebula" variant="screenshot" />
        <ThemeLibraryVisual label="Nebula Garden screenshot three" tone="nebula" variant="screenshot" />
      </div>
    </section>

    <section>
      <h3>Included Content</h3>
      <div class="theme-details__included">
        <span>2 Room Shells</span>
        <span>5 Objects</span>
        <span>18 Assets</span>
      </div>
    </section>

    <dl>
      <div><dt>Version</dt><dd>1.2.0</dd></div>
      <div><dt>Author</dt><dd>Northlight Studio</dd></div>
      <div><dt>Changes</dt><dd>New twilight state and refined glass materials.</dd></div>
      <div><dt>Compatibility</dt><dd>Cosmos 2.0+</dd></div>
    </dl>

    <div class="theme-details__actions">
      <button type="button" class="theme-details__primary">Activate</button>
      <button type="button">Customize</button>
      <button type="button">Duplicate</button>
      <button type="button">Export</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import ThemeLibraryVisual from "./ThemeLibraryVisual.vue";
</script>

<style scoped>
.theme-details {
  display: grid;
  min-width: 0;
  min-height: 0;
  padding: 16px 18px;
  align-content: start;
  overflow: hidden;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-window);
  background: linear-gradient(145deg, rgba(11, 19, 30, 0.96), rgba(5, 11, 18, 0.96));
  gap: 10px;
}

.theme-details header {
  display: grid;
  padding-bottom: 9px;
  border-bottom: 1px solid rgba(181, 211, 225, 0.08);
  gap: 4px;
}

.theme-details h2 {
  margin: 0;
  color: #eadfce;
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 1.65rem;
  font-weight: 400;
  line-height: 1;
}

.theme-details header p,
.theme-details header small {
  margin: 0;
  color: var(--cosmos-color-muted);
  font-size: 0.62rem;
  line-height: 1.45;
}

.theme-details header p span:last-child {
  color: var(--cosmos-color-accent);
}

.theme-details section {
  display: grid;
  gap: 6px;
}

.theme-details h3 {
  margin: 0;
  color: #c2ccd1;
  font-size: 0.63rem;
  font-weight: 500;
}

.theme-details__screenshots,
.theme-details__included {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.theme-details__screenshots > :deep(.theme-visual) {
  height: 75px;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-control);
}

.theme-details__included span {
  display: grid;
  min-height: 34px;
  place-items: center;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-control);
  background: rgba(255, 255, 255, 0.018);
  color: #bdc8cd;
  font-size: 0.59rem;
}

.theme-details dl {
  display: grid;
  margin: 0;
}

.theme-details dl div {
  display: grid;
  min-height: 28px;
  grid-template-columns: 130px minmax(0, 1fr);
  align-items: center;
  border-bottom: 1px solid rgba(181, 211, 225, 0.08);
  color: var(--cosmos-color-muted);
  font-size: 0.61rem;
}

.theme-details dd {
  margin: 0;
  overflow: hidden;
  color: #b9c4c9;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theme-details__actions {
  display: grid;
  margin-top: auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.theme-details__actions button {
  min-height: 38px;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-control);
  background: rgba(255, 255, 255, 0.018);
  color: #c8d1d5;
  cursor: pointer;
  font-size: 0.68rem;
}

.theme-details__actions .theme-details__primary {
  border-color: rgba(119, 190, 221, 0.66);
  background: linear-gradient(180deg, rgba(71, 128, 162, 0.27), rgba(33, 70, 95, 0.2));
  box-shadow: 0 0 18px rgba(98, 200, 234, 0.12);
  color: var(--cosmos-color-text);
}
</style>

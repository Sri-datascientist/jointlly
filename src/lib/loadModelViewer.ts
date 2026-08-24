/** Load @google/model-viewer once; shared across all 3D viewers. */
let modelViewerReady: Promise<void> | null = null;

export function loadModelViewer(): Promise<void> {
  if (typeof customElements !== "undefined" && customElements.get("model-viewer")) {
    return Promise.resolve();
  }
  if (!modelViewerReady) {
    modelViewerReady = import("@google/model-viewer/dist/model-viewer.min.js").then(() => undefined);
  }
  return modelViewerReady;
}

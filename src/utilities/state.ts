export let drawingInProgress = false;
export let drawingScaffoldingInProgress = false;
export let deletionInProgress = false;
export let drawingInProgressSwitch = false;
export let isDrawingBlueprint = false;
export let deletionScaffoldingRowInProgress = false;
export let deletionScaffoldingColumnInProgress = false;
export let replaceScaffoldingColumnWithExternalStaircaseInProgress = false;
export let replaceScaffoldingColumnWithInternalStaircaseInProgress = false;
export let rotatingRoofInProgress = false;
export let editingBlueprint = false;

export const setEditingBlueprint = (value: boolean) => {
  editingBlueprint = value;
};

export const setIsDrawingBlueprint = (value: boolean) => {
  isDrawingBlueprint = value;
};

export const setDrawingInProgress = (value: boolean) => {
  drawingInProgress = value;
};

export const setDrawingScaffoldingInProgress = (value: boolean) => {
  drawingScaffoldingInProgress = value;
};

export const setDeletionInProgress = (value: boolean) => {
  deletionInProgress = value;
};

export const setDrawingInProgressSwitch = (value: boolean) => {
  drawingInProgressSwitch = value;
};

export const setDeletionScaffoldingRowInProgress = (value: boolean) => {
  deletionScaffoldingRowInProgress = value;
};

export const setDeletionScaffoldingColumnInProgress = (value: boolean) => {
  deletionScaffoldingColumnInProgress = value;
};

export const setReplaceScaffoldingColumnWithExternalStaircaseInProgress = (
  value: boolean
) => {
  replaceScaffoldingColumnWithExternalStaircaseInProgress = value;
};

export const setReplaceScaffoldingColumnWithInternalStaircaseInProgress = (
  value: boolean
) => {
  replaceScaffoldingColumnWithInternalStaircaseInProgress = value;
};

export const setRotatingRoofInProgress = (value: boolean) => {
  rotatingRoofInProgress = value;
};

// function to manage states from state.ts
export function setStates(
  states: {
    deletionInProgress?: boolean;
    drawingInProgress?: boolean;
    drawingScaffoldingInProgress?: boolean;
    deletionScaffoldingRowInProgress?: boolean;
    deletionScaffoldingColumnInProgress?: boolean;
    replaceScaffoldingColumnWithExternalStaircaseInProgress?: boolean;
    replaceScaffoldingColumnWithInternalStaircaseInProgress?: boolean;
    rotatingRoofInProgress?: boolean;
    drawingInProgressSwitch?: boolean;
    // editingBlueprint?: boolean;
    // isDrawingBlueprint?: boolean;
  } = {}
) {
  // Default all states to false if not specified
  const defaultStates = {
    deletionInProgress: false,
    drawingInProgress: false,
    drawingScaffoldingInProgress: false,
    deletionScaffoldingRowInProgress: false,
    deletionScaffoldingColumnInProgress: false,
    replaceScaffoldingColumnWithExternalStaircaseInProgress: false,
    replaceScaffoldingColumnWithInternalStaircaseInProgress: false,
    rotatingRoofInProgress: false,
    drawingInProgressSwitch: false,
    // editingBlueprint: false,
    // isDrawingBlueprint: false
  };

  // Merge the default states with the provided states
  const mergedStates = { ...defaultStates, ...states };

  setDeletionInProgress(mergedStates.deletionInProgress);
  setDrawingInProgress(mergedStates.drawingInProgress);
  setDrawingScaffoldingInProgress(mergedStates.drawingScaffoldingInProgress);
  setDeletionScaffoldingRowInProgress(
    mergedStates.deletionScaffoldingRowInProgress
  );
  setDeletionScaffoldingColumnInProgress(
    mergedStates.deletionScaffoldingColumnInProgress
  );
  setReplaceScaffoldingColumnWithExternalStaircaseInProgress(
    mergedStates.replaceScaffoldingColumnWithExternalStaircaseInProgress
  );
  setReplaceScaffoldingColumnWithInternalStaircaseInProgress(
    mergedStates.replaceScaffoldingColumnWithInternalStaircaseInProgress
  );
  setRotatingRoofInProgress(mergedStates.rotatingRoofInProgress);
  setDrawingInProgressSwitch(mergedStates.drawingInProgressSwitch);
  // setEditingBlueprint(mergedStates.editingBlueprint)
  // setIsDrawingBlueprint(mergedStates.isDrawingBlueprint)
}

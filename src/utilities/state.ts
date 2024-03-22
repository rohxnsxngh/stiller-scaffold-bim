export let drawingInProgress = false;
export let drawingScaffoldingInProgress = false;
export let deletionInProgress = false;
export let drawingInProgressSwitch = false;
export let isDrawingBlueprint = false;
export let deletionScaffoldingRowInProgress = false;
export let deletionScaffoldingColumnInProgress = false;

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

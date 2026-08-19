export type LayerInteractEvent = {
  originalEvent: InputObject;
  defaultPrevented: boolean;
  preventDefault: () => void;
};

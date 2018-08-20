export interface StatusIndicatorElement {
  bgColor?: string;
  color?: string;
  text: string;
}

export interface StatusIndicator {
  elements: StatusIndicatorElement[];
}

export default class StatusIndicatorManager {
  private list: StatusIndicator[] = [];
  public addStatusIndicator(ind: StatusIndicator): () => void;
  public addStatusIndicator(...ind: StatusIndicatorElement[]): () => void;
  public addStatusIndicator(
    ...elems: Array<StatusIndicatorElement | StatusIndicator>
  ): () => void {
    let ind: StatusIndicator;
    if (elems.length === 0 && (elems[0] as any).elements !== void 0) {
      ind = elems[0] as any;
    } else {
      ind = {
        elements: elems as StatusIndicatorElement[],
      };
    }
    this.list.addObject(ind);
    return () => {
      this.list.removeObject(ind);
    };
  }
}

export interface StatusIndicatorElement {
  bgColor?: string;
  color?: string;
  hide?: boolean;
  text: string;
}

export interface StatusIndicator {
  elements: StatusIndicatorElement[];
}

export default class StatusIndicatorManager {
  private list: StatusIndicator[] = [];
  public add(ind: StatusIndicator): () => void;
  public add(...ind: StatusIndicatorElement[]): () => void;
  public add(
    ...elems: Array<StatusIndicatorElement | StatusIndicator>
  ): () => void {
    let ind: StatusIndicator;
    if (elems.length === 1 && (elems[0] as any).elements !== void 0) {
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

export default function getFrameById(id: string): Window | undefined {
  for (var i = 0; i < window.frames.length; i++) {
    try {
      if ((window as any).frames[i].name === id) {
          return (window as any).frames[i];
      }
    } catch(err) {}
  }
  return undefined;
}

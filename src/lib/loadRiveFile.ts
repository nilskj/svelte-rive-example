import Rive, { File, RiveCanvas } from "rive-canvas";

export async function loadRiveFile(
  filePath: string
): Promise<{
  rive: RiveCanvas;
  file: File;
}> {
  const req = new Request(filePath);
  const loadRive = Rive({ locateFile: (file: string) => "file://" + file });
  const loadFile = fetch(req)
    .then((res) => res.arrayBuffer())
    .then((buf) => new Uint8Array(buf));
  const [rive, file] = await Promise.all([loadRive, loadFile]);
  return { rive, file: rive.load(file) };
}

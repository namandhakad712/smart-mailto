import { captureGuidesDeskView, captureGuidesInstallCopy } from './demoAnalytics';
import { INSTALL_COMMAND } from './installCommand';

type Capture = () => void;
type ClipboardWrite = (text: string) => Promise<void>;

export function createGuidesDeskViewCapture(capture: Capture = captureGuidesDeskView): Capture {
  let captured = false;

  return () => {
    if (captured) return;

    captured = true;
    capture();
  };
}

export async function copyGuidesInstallCommand(
  writeText: ClipboardWrite,
  capture: Capture = captureGuidesInstallCopy,
): Promise<void> {
  await writeText(INSTALL_COMMAND);
  capture();
}

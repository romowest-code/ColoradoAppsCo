import { Composition } from "remotion";
import { YearEndBooks, DURATION } from "./YearEndBooks";
import {
  MG1Apps,
  MG1_DURATION,
  MG2Envelopes,
  MG2_DURATION,
  MG3Compare,
  MG3_DURATION,
  MG4Prompt,
  MG4_DURATION,
} from "./BudgetApp";

const HD = { fps: 60, width: 1920, height: 1080 };

export const Root = () => (
  <>
    <Composition
      id="YearEndBooks"
      component={YearEndBooks}
      durationInFrames={DURATION}
      fps={60}
      width={1080}
      height={1080}
    />
    <Composition id="Budget01Apps" component={MG1Apps} durationInFrames={MG1_DURATION} {...HD} />
    <Composition id="Budget02Envelopes" component={MG2Envelopes} durationInFrames={MG2_DURATION} {...HD} />
    <Composition id="Budget03Compare" component={MG3Compare} durationInFrames={MG3_DURATION} {...HD} />
    <Composition id="Budget04Prompt" component={MG4Prompt} durationInFrames={MG4_DURATION} {...HD} />
  </>
);

import TestResultMetadataTitle from "./Title";
import TestResultMetadataCategory from "./Category";
import TestResultMetadataTakenByUser from "./TakenByUser/Index";
import TestResultMetadataScore from "./Score";
import type getDatePopoverLabels from "@/lib/getDatePopoverLabels";

type Props = {
  takenAtLabels: ReturnType<typeof getDatePopoverLabels>;
};

export default function TestResultMetadata({ takenAtLabels }: Props) {
  return (
    <div className="mb-8 space-y-2">
      <div className="space-y-2">
        <div>
          <TestResultMetadataTitle />
          <TestResultMetadataCategory />
        </div>
        <div>
          <TestResultMetadataScore />
          <TestResultMetadataTakenByUser takenAtLabels={takenAtLabels} />
        </div>
      </div>
    </div>
  );
}

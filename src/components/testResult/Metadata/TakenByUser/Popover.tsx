import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import getDatePopoverLabels from "@/lib/getDatePopoverLabels";
import useTestResultContext from "@/lib/hooks/testResult/context";
import { useEffect, useState } from "react";

type Props = {
  labels: ReturnType<typeof getDatePopoverLabels>;
};

export default function TestResultMetadataTakenByUserPopover({ labels }: Props) {
  const { createdAt } = useTestResultContext();
  const [currentLabels, setCurrentLabels] = useState(labels);

  useEffect(() => {
    setCurrentLabels(getDatePopoverLabels(createdAt));
  }, [createdAt]);

  return (
    <Popover>
      <PopoverTrigger>{currentLabels.relative}</PopoverTrigger>
      <PopoverContent className="max-w-max">
        {currentLabels.absolute}
      </PopoverContent>
    </Popover>
  );
}

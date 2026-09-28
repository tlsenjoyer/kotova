import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import getDatePopoverLabels from "@/lib/getDatePopoverLabels";
import useTakeTestContext from "@/lib/hooks/takeTest/context";
import { useEffect, useState } from "react";

type Props = {
  labels: ReturnType<typeof getDatePopoverLabels>;
};

export default function TakeTestMetadataCreatedByUserPopover({ labels }: Props) {
  const { createdAt } = useTakeTestContext();
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

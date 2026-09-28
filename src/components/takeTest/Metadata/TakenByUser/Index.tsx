"use client";

import Link from "next/link";
import TakeTestMetadataCreatedByUserPopover from "./Popover";
import useTakeTestContext from "@/lib/hooks/takeTest/context";
import type getDatePopoverLabels from "@/lib/getDatePopoverLabels";

type Props = {
  createdAtLabels: ReturnType<typeof getDatePopoverLabels>;
};

export default function TakeTestMetadataCreatedByUser({ createdAtLabels }: Props) {
  const test = useTakeTestContext();
  return (
    <div className="text-muted-foreground">
      Создан пользователем{" "}
      <Link
        className="font-semibold text-black"
        href={`/users/${test.createdBy?.id ?? "deleteduser"}`}
      >
        {test.createdBy?.name ?? "Удаленный пользователь"}
      </Link>{" "}
      <TakeTestMetadataCreatedByUserPopover labels={createdAtLabels} />
    </div>
  );
}

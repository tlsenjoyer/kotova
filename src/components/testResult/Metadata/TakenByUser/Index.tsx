"use client";

import useTestResultContext from "@/lib/hooks/testResult/context";
import Link from "next/link";
import TestResultMetadataTakenByUserPopover from "./Popover";
import type getDatePopoverLabels from "@/lib/getDatePopoverLabels";

type Props = {
  takenAtLabels: ReturnType<typeof getDatePopoverLabels>;
};

export default function TestResultMetadataTakenByUser({ takenAtLabels }: Props) {
  const testResult = useTestResultContext();
  return (
    <div className="text-muted-foreground">
      Пройден пользователем{" "}
      <Link
        className="font-semibold text-black"
        href={`/users/${testResult.userId ?? "deleteduser"}`}
      >
        {testResult.user?.name ?? "Удаленный пользователь"}
      </Link>{" "}
      <TestResultMetadataTakenByUserPopover labels={takenAtLabels} />
    </div>
  );
}

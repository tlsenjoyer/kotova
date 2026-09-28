import TestResultAnswers from "@/components/testResult/Answers";
import TestResultMetadata from "@/components/testResult/Metadata/Index";
import TestResultContextProvider from "@/lib/contexts/testResult/Index/Provider";
import getSignedInUser from "@/lib/fetchers/getSignedInUser";
import getTestResult from "@/lib/fetchers/testResults/getTestResults";
import getDatePopoverLabels from "@/lib/getDatePopoverLabels";
import { notFound } from "next/navigation";

type Context = {
  params: Promise<{ id: string }>;
};

export default async function TestResult(props: Context) {
  const [params, signedInUser] = await Promise.all([
    props.params,
    getSignedInUser(),
  ]);
  const { id: testResultId } = params;

  const testResult = await getTestResult(testResultId);
  if (!testResult) notFound();
  const takenAtLabels = getDatePopoverLabels(testResult.createdAt);

  return (
    <TestResultContextProvider {...testResult} signedInUser={signedInUser}>
      <TestResultMetadata takenAtLabels={takenAtLabels} />
      <TestResultAnswers />
    </TestResultContextProvider>
  );
}

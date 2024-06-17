import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { useGetShowSubmissionQuery } from "../../redux/slices/apiSlice";
import { Link, useParams } from "react-router-dom";

const getLanguageMode = (language) => {
  switch (language.toLowerCase()) {
    case "javascript":
      return javascript();
    case "java":
      return java();
    case "python":
      return python();
    case "cpp":
      return cpp();
    default:
      return null;
  }
};

const SubmissionScreen = () => {
  const userId = JSON.parse(localStorage.getItem("userid"));
  const { questionId } = useParams();
  const {
    data: solutionCode,
    isLoading,
    isError,
    refetch,
  } = useGetShowSubmissionQuery({ userId, questionId });

  useEffect(() => {
    // Call the refetch function to fetch data every time the component is mounted or userId changes
    refetch();
  }, [userId, questionId]);

  if (isLoading) {
    return <div className="text-center text-xl mt-8">Loading...</div>;
  }

  if (isError) {
    return (
      <>
        <Link
          to="/"
          className="w-[180px] ml-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Go to Questions List
        </Link>
        <div className="text-center text-xl mt-8 text-red-500">
          Error loading submissions.
        </div>
      </>
    );
  }

  if (!solutionCode || solutionCode.length === 0) {
    return (
      <>
        <Link
          to="/"
          className="w-[180px] ml-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Go to Questions List
        </Link>
        <div className="text-center text-xl mt-8">No submissions found.</div>
      </>
    );
  }

  const lastSubmission = solutionCode[solutionCode.length - 1];
  const languageMode = getLanguageMode(lastSubmission.language);

  return (
    <>
      <Link
        to="/"
        className="w-[180px] ml-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Go to Questions List
      </Link>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          Your Last Accepted Submitted Solution
        </h1>
        {lastSubmission.status === "Wrong Answer" ? (
          <div className="text-center text-xl mt-8">No submissions found.</div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            {languageMode ? (
              <CodeMirror
                value={lastSubmission.code}
                extensions={[languageMode]}
                options={{
                  theme: "material",
                  readOnly: "nocursor",
                }}
              />
            ) : (
              <pre className="whitespace-pre-wrap">{lastSubmission.code}</pre>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SubmissionScreen;

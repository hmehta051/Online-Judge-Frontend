import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAllQuestionQuery,
  useGetQuestionQuery,
  useRuntestCaseQuestionMutation,
  useSubmitQuestionMutation,
} from "../../redux/slices/apiSlice";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import TestCaseInputGuide from "./TestInputGuide";

const SingleQuestion = () => {
  const { refetch } = useGetAllQuestionQuery();
  const [runTestCaseQuestion, { isLoading: isRunTestLoading }] =
    useRuntestCaseQuestionMutation();
  const [submitQuestion, { isLoading: isSubmit }] = useSubmitQuestionMutation();
  const { quesId } = useParams();
  const navigate = useNavigate();
  const { data: question, error, isLoading } = useGetQuestionQuery(quesId);
  const [value, setValue] = useState(
    "#include <iostream>\n\nint main() {\n\tstd::cout << 'Hello, World!' << std::endl;\n\treturn 0;\n}",
  );
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const onChange = useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);
  const [testCaseOutput, setTestCaseOutput] = useState({});

  const handleSubmit = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Token not found");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      toast.error("Invalid token");
      console.error("Token decode error:", error);
      return;
    }

    const postData = {
      userId: decoded.userId,
      questionId: quesId,
      code: value,
      language: selectedLanguage,
    };

    try {
      const res = await submitQuestion(postData).unwrap();
      if (res.status === "success" && res.solution.status === "Accepted") {
        toast.success(res.solution.status);
      } else {
        toast.error(res.solution.status);
      }
    } catch (error) {
      if (error.data.details.error == "Execution error") {
        toast.error(error.data.details.error || error.message);
      } else {
        toast.error("Syntax error/Server Error" || error.data.details.stderr);
      }
      console.error("API request error:", error); // Log the error for debugging
    }
  };
  const handleTestCaseRun = async () => {
    if (!input) {
      toast.error("Input is Empty");
      return;
    }
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Token not found");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      toast.error("Invalid token");
      console.error("Token decode error:", error);
      return;
    }

    const postData = {
      userId: decoded.userId,
      questionId: quesId,
      code: value,
      input: input,
      language: selectedLanguage,
    };

    try {
      const res = await runTestCaseQuestion(postData).unwrap();
      if (res.status === "error") {
        toast.error(res.message);
      } else if (res.status === "success") {
        setTestCaseOutput(res.output);
      } else {
        toast.error(res.message || "Check Network Connection");
      }
    } catch (error) {
      if (error.status === 500) {
        toast.error(
          "Syntax Error or Server Error" ||
            error.data.details.error ||
            error.message,
        );
      } else {
        toast.error(error.data.details.stderr);
      }
      console.error("API request error:", error); // Log the error for debugging
    }
  };

  const handleLanguageChange = useCallback((e) => {
    const selectedLanguage = e.target.value;
    setSelectedLanguage(selectedLanguage);
    resetCodeMirror();
  }, []);

  const resetCodeMirror = () => {
    setValue(initialCode[selectedLanguage] || "");
  };

  const initialCode = {
    cpp: "#include <iostream>\n\nint main() {\n\tstd::cout << 'Hello, World!' << std::endl;\n\treturn 0;\n}",
    java: "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println('Hello, World!');\n\t}\n}",
    python: "print('Hello, World!')",
    js: "console.log('hello world!');",
  };

  useEffect(() => {
    resetCodeMirror();
  }, [question, selectedLanguage]);

  let languageExtension;
  switch (selectedLanguage) {
    case "cpp":
      languageExtension = cpp();
      break;
    case "java":
      languageExtension = java();
      break;
    case "python":
      languageExtension = python();
      break;
    case "js":
      languageExtension = javascript({ jsx: true });
      break;
    default:
      languageExtension = cpp();
  }

  if (isLoading) {
    return (
      <div className="loading text-center text-gray-600">
        Loading question...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error text-center text-red-500">
        Error fetching question: {error.message}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="not-found text-center text-gray-600">
        Question not found.
      </div>
    );
  }

  return (
    <>
      <div>
        <div
          onClick={() => {
            refetch();
            navigate("/");
          }}
          className="w-[200px] ml-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Go to Question List
        </div>
        <Link
          to={`/submission/${quesId}`}
          className=" w-[200px] ml-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Submission
        </Link>
      </div>
      <div className="question-container container mx-auto px-4 py-8">
        <div className="text-2xl">Question: {question.question.title}</div>
        <div className="details flex items-center justify-between mb-4">
          <div>
            <span className="label text-gray-600 text-sm font-medium">
              Difficulty:
            </span>
            <span className="ml-2 text-gray-700">
              {question.question.difficulty}
            </span>
          </div>
          <div>
            <span className="label text-gray-600 text-sm font-medium">
              Topic:
            </span>
            <span className="ml-2 text-gray-700">
              {question.question.topic}
            </span>
          </div>
        </div>
        <div className="description mb-4">
          <div className="text-xl">Description</div>
          <p>{question.question.description}</p>
          <p className="constraints text-gray-600 mt-2">
            <strong>Constraints:</strong> {question.question.constraints}
          </p>
        </div>
        <TestCaseInputGuide />
        <div className="test-cases">
          <h3>Test Cases</h3>
          {question.question.testCase.map((testCase) => (
            <div
              className="test-case border border-gray-200 rounded p-4 mb-4"
              key={testCase.input}
            >
              <div className="input flex items-start mb-2 w-fit">
                <span className="text-gray-600 text-sm font-medium mr-2">
                  Input:
                </span>
                <pre className="break-words overflow-auto">
                  {testCase.input}
                </pre>
              </div>
              <hr className="my-2" />
              <div className="output flex items-center">
                <span className="text-gray-600 text-sm font-medium mr-2">
                  Output:
                </span>
                <pre className="break-words overflow-auto">
                  {testCase.output}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="language" className="mr-2 text-gray-700">
            Select Language:
          </label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="bg-gray-100 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="js">JavaScript</option>
          </select>
        </div>

        <div className="border-2 border-black">
          <CodeMirror
            value={value}
            height="500px"
            extensions={[languageExtension]}
            onChange={onChange}
          />
          <div className="w-full p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-center gap-4">
              <textarea
                placeholder="Input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              ></textarea>

              {Object.keys(testCaseOutput).length > 0 ? (
                <textarea
                  readOnly
                  value={testCaseOutput.stdout || testCaseOutput}
                  placeholder="Output"
                  className="w-full h-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <textarea
                  readOnly
                  placeholder="Output"
                  className="w-full h-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>

            <div className="flex justify-center items-center my-4">
              <div className="flex space-x-4">
                {isRunTestLoading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleTestCaseRun}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Run
                  </button>
                )}

                {isSubmit ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleQuestion;

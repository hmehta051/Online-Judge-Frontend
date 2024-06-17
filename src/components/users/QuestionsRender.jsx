import React from "react";
import {
  useGetAllQuestionQuery,
  useGetSolutionsQuery,
} from "../../redux/slices/apiSlice";
import { useNavigate } from "react-router-dom";

const QuestionsRender = () => {
  const navigate = useNavigate();
  const {
    data: questionData,
    error: questionError,
    isLoading: questionLoading,
  } = useGetAllQuestionQuery();
  const { data: solutionsData } = useGetSolutionsQuery(
    JSON.parse(localStorage.getItem("userid")),
  );

  if (questionLoading) {
    return <div className="text-center text-xl mt-8">Loading...</div>;
  }

  if (questionError) {
    return (
      <div className="text-center text-xl mt-8 text-red-500">
        Error loading questions.
      </div>
    );
  }

  if (!questionData || questionData.length === 0) {
    return <div className="text-center text-xl mt-8">No questions found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="text-2xl my-2 w-[94%] m-auto">List of Questions</div>
      <>
        {questionData.questions.map((question) => {
          // Filter solutions for the current question
          const filteredSolutions = solutionsData
            ? solutionsData.filter((data) => data.questionId === question._id)
            : [];

          // Check if any submission is accepted
          const isAccepted = filteredSolutions.some(
            (data) => data.status === "Accepted",
          );

          return (
            <div
              onClick={() => navigate(`/question/${question._id}`)}
              className="flex flex-col border rounded shadow-md p-4 mb-4 cursor-pointer w-[94%] m-auto"
              key={question._id}
            >
              <div className="font-bold text-lg mb-2">
                {question.title}
                {isAccepted && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    Accepted
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2 font-medium">Difficulty:</span>
                <span className="badge bg-blue-500 text-white px-2 py-1 rounded">
                  {question.difficulty}
                </span>
                <span className="ml-2 font-medium">Topic:</span>
                <span className="text-gray-600">{question.topic}</span>
              </div>
            </div>
          );
        })}
      </>
    </div>
  );
};

export default QuestionsRender;

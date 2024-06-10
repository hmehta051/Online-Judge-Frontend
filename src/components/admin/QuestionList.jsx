import React from "react";
import {
  useDeleteQuestionMutation,
  useGetAllQuestionQuery,
  useGetQuestionQuery,
} from "../../redux/slices/apiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const QuestionList = () => {
  const navigate = useNavigate();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const { quesId } = useParams();
  const {
    data: questions,
    error,
    isLoading,
    refetch,
  } = useGetAllQuestionQuery();

  const { data: question, isLoading: isQuestionLoading } = useGetQuestionQuery(
    quesId,
    { skip: !quesId },
  );

  const handleDelete = async (quesId) => {
    try {
      await deleteQuestion(quesId).unwrap();
      refetch();
    } catch (error) {
      toast.error("Failed to save the question: ", error);
      console.error("Failed to delete the question: ", error);
    }
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (isQuestionLoading) return <div>Loading question details...</div>;
  if (error) return <div>Error loading questions</div>;

  return (
    <>
      <Link
        to="/admin/add/questions"
        className="ml-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Go to Add Question
      </Link>
      {!questions ? (
        "Loading..."
      ) : questions.questions.length > 0 ? (
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-800 my-4">
            Questions List
          </h1>

          <ul>
            {questions.questions.map((question) => (
              <li
                key={question._id}
                className="mb-4 p-4 border rounded-md shadow-sm"
              >
                <h2 className="text-xl font-semibold">{question.title}</h2>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    onClick={() =>
                      navigate(`/admin/update/question/${question._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No questions available.</p>
      )}
    </>
  );
};
export default QuestionList;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetQuestionQuery,
  useUpdateQuestionMutation,
} from "../../redux/slices/apiSlice"; // Replace 'your-api-module' with the actual module
import { toast } from "react-toastify";

const EditQuestion = () => {
  const { quesId } = useParams();
  const navigate = useNavigate();
  const { data: question, isLoading: isQuestionLoading } = useGetQuestionQuery(
    quesId,
    { skip: !quesId },
  );
  const [updateQuestion] = useUpdateQuestionMutation();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("");
  const [newConstraints, setNewConstraints] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newInitialCode, setNewInitialCode] = useState("");
  const [newBoilerPlateCode, setNewBoilerPlateCode] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  useEffect(() => {
    if (question) {
      setNewTitle(question.question.title);
      setNewDescription(question.question.description);
      setNewDifficulty(question.question.difficulty);
      setNewConstraints(question.question.constraints);
      setNewTopic(question.question.topic);
      setNewInitialCode(question.question.initialCode);
      setNewBoilerPlateCode(question.question.boilerPlate);
      setTestCases(question.question.testCase);
    }
  }, [question]);

  const handleUpdate = async () => {
    try {
      await updateQuestion({
        _id: quesId,
        title: newTitle || question.title,
        description: newDescription || question.question.description,
        difficulty: newDifficulty || question.question.difficulty,
        constraints: newConstraints || question.question.constraints,
        topic: newTopic || question.question.topic,
        initialCode: newInitialCode || question.question.initialCode,
        boilerPlate: newBoilerPlateCode || question.question.boilerPlate,
        testCase: testCases || question.question.testCase,
      }).unwrap();
      navigate("/admin/add/questions");
    } catch (error) {
      // Handle error
      toast.error("Error updating question:", error);
      console.error("Error updating question:", error);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const handleRemoveTestCase = (index) => {
    const updatedTestCases = [...testCases];
    updatedTestCases.splice(index, 1);
    setTestCases(updatedTestCases);
  };

  if (isQuestionLoading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl mb-4">Update Question</h2>
      <div className="mb-4">
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Description:</label>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Difficulty:</label>
        <select
          value={newDifficulty}
          onChange={(e) => setNewDifficulty(e.target.value)}
          className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        >
          <option value="none">None</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Constraints:</label>
        <textarea
          value={newConstraints}
          onChange={(e) => setNewConstraints(e.target.value)}
          className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Topic:</label>
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Initial Code:</label>
        <textarea
          value={newInitialCode}
          onChange={(e) => setNewInitialCode(e.target.value)}
          className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">BoilerPlate Code:</label>
        <textarea
          value={newBoilerPlateCode}
          onChange={(e) => setNewBoilerPlateCode(e.target.value)}
          className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg mb-2">Test Cases</h3>
        {testCases.map((testCase, index) => (
          <div key={index} className="mb-4">
            <div className="mb-2">
              <label className="block mb-1">Input:</label>
              <textarea
                type="text"
                value={testCase.input}
                onChange={(e) =>
                  handleTestCaseChange(index, "input", e.target.value)
                }
                className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Output:</label>
              <input
                type="text"
                value={testCase.output}
                onChange={(e) =>
                  handleTestCaseChange(index, "output", e.target.value)
                }
                className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              />
            </div>
            <button
              onClick={() => handleRemoveTestCase(index)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddTestCase}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Add Test Case
        </button>
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update
      </button>
    </div>
  );
};

export default EditQuestion;

import React from "react";

const TestCaseInputGuide = () => {
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-4">
      <div className="mb-4 text-lg font-semibold text-gray-800">
        For Test Cases like Array and 2D Array, take input like this in the
        input box:
      </div>

      <div className="mb-4">
        <div className="mb-2 text-md font-medium text-gray-700">1D Array</div>
        <pre className="p-2 bg-white border border-gray-300 rounded-md">
          {`5
1 2 3 4 5`}
        </pre>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-md font-medium text-gray-700">2D Array</div>
        <pre className="p-2 bg-white border border-gray-300 rounded-md">
          {`4 4
1 2 3 4
1 2 3 4
1 2 3 4
1 2 3 4`}
        </pre>
        <pre className="p-2 bg-white border border-gray-300 rounded-md">
          {`4 2
2 3
4 5
3 6
4 8`}
        </pre>
      </div>

      <div>
        <div className="mb-2 text-md font-medium text-gray-700">
          For Questions like Graphs (nodes and edges)
        </div>
        <pre className="p-2 bg-white border border-gray-300 rounded-md">
          {`5 4
1 2
2 3
3 4
4 5`}
        </pre>
      </div>
    </div>
  );
};

export default TestCaseInputGuide;

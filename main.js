const fibForm = document.querySelector(".calculator"),
  fibInput = document.querySelector(".fibonacci-index-input"),
  fibOutput = document.querySelector(".fibonacci-number-output"),
  resultsElement = document.querySelector(".results"),
  resultSpinner = document.querySelector(
    ".results-container .spinner-container"
  ),
  sortByButton = document.querySelector(".sort-by-button"),
  sortByList = document.querySelector(".sort-by-list"),
  currSort = { by: "createdDate", order: -1 };

let results;

init();

fibForm.addEventListener("submit", (e) => {
  e.preventDefault();

  fibForm.classList.add("was-validated");

  if (fibForm.checkValidity()) {
    handleSubmit();
  }
});

sortByList.addEventListener("click", (e) => {
  const sortText = e.target.textContent;

  sortByButton.firstElementChild.textContent = sortText;

  currSort.by = sortText.slice(0, 6) === "Number" ? "number" : "createdDate";
  currSort.order = sortText.slice(-4) === "asc." ? 1 : -1;

  sortResults();
  showResults();
});

async function init() {
  await loadResults();
  sortResults();
  showResults();
}

async function handleSubmit() {
  const useServer = document.querySelector(".save-calculation").checked;

  resetOutput();
  fibOutput.classList.add("spinner-border");

  if (useServer) {
    await serverFibonacci(fibInput.value);
  } else {
    fibOutput.textContent = fibonacci(+fibInput.value);
  }

  fibOutput.classList.remove("spinner-border");

  if (useServer) {
    init();
  }
}

function resetOutput() {
  styleOutput(true);
  fibOutput.replaceChildren();
}

function fibonacci(index) {
  if (index <= 0) {
    return 0;
  }

  let prev = 0,
    curr = 1;

  for (let i = 2; i <= index; i++) {
    [prev, curr] = [curr, prev + curr];
  }

  return curr;
}

async function serverFibonacci(index) {
  try {
    fibOutput.textContent = await fetchFibonacci(index);
  } catch (error) {
    styleOutput(false);
    reportError(error);
  }
}

async function fetchFibonacci(index) {
  const response = await fetch(`http://localhost:5050/fibonacci/${index}`);

  if (!response.ok) {
    throw Error(await response.text());
  }

  return (await response.json()).result;
}

async function fetchResults() {
  resultSpinner.classList.add("spinner-border");
  const response = await fetch("http://localhost:5050/getFibonacciResults");
  resultSpinner.classList.remove("spinner-border");

  return (await response.json()).results;
}

async function loadResults() {
  results = await fetchResults();
}

function showResults() {
  resultsElement.replaceChildren();

  for (const result of results) {
    const resultElement = document.createElement("li");
    resultElement.classList.add("result", "list-group-item", "px-0");

    resultElement.innerHTML = `The Fibonnaci of <span class="fw-bold">${
      result.number
    }</span> is <span class="fw-bold">${
      result.result
    }</span>. Calculated at: ${new Date(result.createdDate)}`;

    resultsElement.append(resultElement);
  }
}

function sortResults() {
  results.sort((a, b) => currSort.order * (a[currSort.by] - b[currSort.by]));
}

function reportError(error) {
  const errorElement = document.createElement("small");
  errorElement.textContent = "Server Error: " + error.message;
  fibOutput.append(errorElement);
}

function styleOutput(ok) {
  const currentStyles = fibOutput.classList,
    normalStyles = ["text-body", "text-decoration-underline", "fw-bold"],
    errorStyles = ["text-danger", "text-decoration-none", "fw-normal"];

  if (ok) {
    currentStyles.add(...normalStyles);
    currentStyles.remove(...errorStyles);
  } else {
    currentStyles.remove(...normalStyles);
    currentStyles.add(...errorStyles);
  }
}

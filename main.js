const fibForm = document.querySelector(".calculator"),
  fibInput = document.querySelector(".fibonacci-index-input"),
  fibOutput = document.querySelector(".fibonacci-number-output");

fibForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  fibForm.classList.add("was-validated");

  if (!fibForm.checkValidity()) {
    return;
  }

  fibOutput.replaceChildren();
  styleOutput(true);
  fibOutput.classList.add("spinner-border");
  const index = +fibInput.value;

  fetchFibonacci(index)
    .finally(() => fibOutput.classList.remove("spinner-border"))
    .then((result) => {
      fibOutput.textContent = result;
    })
    .catch((error) => reportError(error));
});

async function fetchFibonacci(index) {
  const response = await fetch(`http://localhost:5050/fibonacci/${index}`);

  if (!response.ok) {
    throw Error(await response.text());
  }

  return (await response.json()).result;
}

function reportError(error) {
  styleOutput(false);
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

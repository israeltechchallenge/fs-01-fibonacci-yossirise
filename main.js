const inputFibonacciIndex = document.querySelector(".fibonacci-index-input"),
  buttonGetFibonacciNumber = document.querySelector(".get-fibonacci-number"),
  fibonacciNumberOutput = document.querySelector(".fibonacci-number-output");

buttonGetFibonacciNumber.addEventListener("click", () => {
  const index = +inputFibonacciIndex.value;
  fetchFibonacci(index).then((result) => {
    fibonacciNumberOutput.textContent = result;
  });
});

function fetchFibonacci(index) {
  return fetch(`http://localhost:5050/fibonacci/${index}`)
    .then((response) => response.json())
    .then((data) => data.result);
}

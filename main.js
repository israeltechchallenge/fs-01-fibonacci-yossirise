const inputFibonacciIndex = document.querySelector(".fibonacci-index-input"),
  buttonGetFibonacciNumber = document.querySelector(".get-fibonacci-number"),
  fibonacciNumberOutput = document.querySelector(".fibonacci-number-output");

buttonGetFibonacciNumber.addEventListener("click", () => {
  const fibonacciNumber = fibonacci(+inputFibonacciIndex.value);
  fibonacciNumberOutput.textContent = fibonacciNumber;
});

function fibonacci(index) {
  if (index <= 0) {
    return 0;
  }

  if (index === 1) {
    return 1;
  }

  return fibonacci(index - 1) + fibonacci(index - 2);
}

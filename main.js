const inputFibonacciIndex = document.querySelector(".fibonacci-index-input"),
  buttonGetFibonacciNumber = document.querySelector(".get-fibonacci-number"),
  fibonacciNumberOutput = document.querySelector(".fibonacci-number-output");

buttonGetFibonacciNumber.addEventListener("click", () => {
  const fibonacciNumber = fibonacci(inputFibonacciIndex.value);
  fibonacciNumberOutput.textContent = fibonacciNumber;
});

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

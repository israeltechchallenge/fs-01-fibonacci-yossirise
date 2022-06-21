const fibonacci_index = 7,
  fibonacci_number = fibonacci(fibonacci_index);

document.querySelector(".fibonacci-index").textContent = fibonacci_index;
document.querySelector(".fibonacci-number").textContent = fibonacci_number;

function fibonacci(index) {
  if (index <= 1) {
    return 0;
  }

  let prev = 0,
    curr = 1;

  for (let i = 3; i <= index; i++) {
    [prev, curr] = [curr, prev + curr];
  }

  return curr;
}

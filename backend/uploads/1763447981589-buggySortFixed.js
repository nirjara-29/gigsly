/**
 * Corrected sorting function.
 * - Implements Bubble Sort (no built-in .sort())
 * - Works for:
 *      ✔ Positive numbers
 *      ✔ Negative numbers
 *      ✔ Floating point values
 *      ✔ Duplicate values
 * - Final function name must be sortArray(arr)
 */

function sortArray(arr) {
    // Bubble Sort implementation
    // Repeatedly compare adjacent elements and swap them if out of order
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            // If current element is greater than the next, swap them
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}



/* -------------------------------
   Test Cases (Required ≥ 3)
--------------------------------*/

// 1. Positive numbers + duplicates
console.log(sortArray([5, 2, 9, 1, 2]));   
// Expected: [1, 2, 2, 5, 9]

// 2. Negative numbers
console.log(sortArray([-5, 3, -1, 0, -10]));
// Expected: [-10, -5, -1, 0, 3]

// 3. Floating point values
console.log(sortArray([3.2, 1.5, 0.9, 1.5]));
// Expected: [0.9, 1.5, 1.5, 3.2]

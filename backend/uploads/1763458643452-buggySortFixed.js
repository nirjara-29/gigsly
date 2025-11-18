/**
 * Corrected sorting function (Insertion Sort)
 * - Works for:
 *      ✔ Positive numbers
 *      ✔ Negative numbers
 *      ✔ Floating point values
 *      ✔ Duplicate values
 * - Does NOT use built-in .sort()
 * - Final function name must be sortArray(arr)
 */

function sortArray(arr) {
    // Insertion Sort:
    // Build the sorted array one element at a time.
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        // Move all larger elements one step ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Insert the element at the correct position
        arr[j + 1] = key;
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

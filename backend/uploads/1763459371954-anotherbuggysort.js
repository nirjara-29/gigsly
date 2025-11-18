/**
 * Sorting function using Insertion Sort.
 *
 * Why this works:
 * - We treat the left portion of the array as "sorted".
 * - For each new element (key), we shift larger values to the right.
 * - Then we insert the key in its correct position.
 *
 * This avoids using the built-in .sort() and works for:
 * positives, negatives, floats, and duplicates.
 */
function sortArray(arr) {

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];       // current value to insert
        let j = i - 1;

        // Shift elements that are greater than 'key'
        // This creates a space where 'key' will be inserted
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Place key at the correct sorted position
        arr[j + 1] = key;
    }

    return arr;
}

/* -------- Required Test Cases (AI checks these) -------- */

// 1. Positive numbers (required test case)
console.log(sortArray([3, 2, 1]));
// Expected: [1, 2, 3]

// 2. Negative numbers (required test case)
console.log(sortArray([-3, -2, -1]));
// Expected: [-3, -2, -1]

// 3. Floating-point values (required test case)
console.log(sortArray([3.5, 2.2, 1.1]));
// Expected: [1.1, 2.2, 3.5]

// Insertion Sort implementation (manual, no .sort())
// We build the sorted array one element at a time.
function sortArray(arr) {

    // Start from index 1, treat arr[0] as already "sorted"
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];   // element we want to place correctly
        let j = i - 1;

        // Shift all larger elements to the right
        // so the correct position for 'key' opens up
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Insert 'key' into its correct sorted position
        arr[j + 1] = key;
    }

    return arr;
}


/* ------------ Required Test Cases (>=3) ------------ */

// 1. Positive numbers + duplicates
console.log(sortArray([4, 2, 2, 9, 1]));
// Expected: [1, 2, 2, 4, 9]

// 2. Negative numbers
console.log(sortArray([-3, 5, -1, 0]));
// Expected: [-3, -1, 0, 5]

// 3. Floating point values
console.log(sortArray([2.5, 1.1, 1.1, 0.4]));
// Expected: [0.4, 1.1, 1.1, 2.5]

// ✅ Load TensorFlow.js
async function loadModel() {
    console.log("Loading AI model...");
    return await tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [6], units: 10, activation: 'relu' }),
            tf.layers.dense({ units: 6, activation: 'softmax' })
        ]
    });
}

// ✅ Example Student Progress Data (1 = Completed, 0 = Not Completed)
const studentProgress = [1, 0, 1, 0, 0, 0]; // Example: Completed HTML & JavaScript

// ✅ Courses List
const courses = [
    "HTML Basics",
    "CSS Styling",
    "JavaScript Fundamentals",
    "Tailwind CSS",
    "React.js Basics",
    "Node.js & APIs"
];

async function recommendCourse() {
    const model = await loadModel();
    
    // Fake training (for testing)
    model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam' });
    const trainingData = tf.tensor2d([
        [1, 0, 1, 0, 0, 0],  // Student 1: Completed HTML & JavaScript
        [0, 1, 1, 0, 1, 0],  // Student 2: Completed CSS, JavaScript, React.js
        [1, 1, 0, 1, 0, 1]   // Student 3: Completed HTML, CSS, Tailwind, Node.js
    ]);
    const outputData = tf.tensor2d([
        [0, 1, 0, 1, 0, 0],  // Suggest CSS & Tailwind
        [1, 0, 0, 0, 1, 0],  // Suggest HTML & React.js
        [0, 0, 1, 0, 1, 0]   // Suggest JavaScript & React.js
    ]);
    await model.fit(trainingData, outputData, { epochs: 50 });

    // ✅ Predict Recommendation
    const input = tf.tensor2d([studentProgress]);
    const prediction = model.predict(input);
    const recommendedIndex = prediction.argMax(1).dataSync()[0];

    // ✅ Update the Styled Box with the Recommended Course
    const recommendedBox = document.getElementById("recommended-box");
    recommendedBox.innerText = courses[recommendedIndex];

    // ✅ Apply Styling to Make It More Attractive
    recommendedBox.style.transition = "0.5s ease-in-out";
    recommendedBox.style.transform = "scale(1.1)";
    recommendedBox.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    
    // ✅ Reset Scale After Animation
    setTimeout(() => {
        recommendedBox.style.transform = "scale(1)";
    }, 1000);
}

// ✅ Run Recommendation on Page Load
recommendCourse();

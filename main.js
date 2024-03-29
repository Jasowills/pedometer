document.addEventListener('DOMContentLoaded', function () {
    let steps = 0;
    let isCounting = false;
    let acceleration = 0;
    let startTime;
    let distance = 0;

    const stepCounter = document.getElementById('step-counter');
    const speedCounter = document.getElementById('speed-counter');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');

    startButton.addEventListener('click', function () {
        isCounting = !isCounting;
        startButton.innerText = isCounting ? 'Pause' : 'Start';

        if (isCounting) {
            startPedometer();
        } else {
            pausePedometer();
        }
    });

    resetButton.addEventListener('click', function () {
        resetPedometer();
    });

    function startPedometer() {
        if (isCounting) {
            // Check if the DeviceMotionEvent is supported
            if (window.DeviceMotionEvent) {
                // Listen for the motion events
                window.addEventListener('devicemotion', handleMotion);
                startTime = new Date().getTime();
            } else {
                alert('DeviceMotionEvent is not supported on this device.');
                pausePedometer();
            }
        }
    }

    function handleMotion(event) {
        const accelerationIncludingGravity = event.accelerationIncludingGravity;

        // Calculate the absolute acceleration value
        acceleration = Math.abs(accelerationIncludingGravity.x) +
            Math.abs(accelerationIncludingGravity.y) +
            Math.abs(accelerationIncludingGravity.z);

        // Adjust this threshold based on your device and walking style
        const accelerationThreshold = 15;

        if (acceleration > accelerationThreshold) {
            steps++;
            stepCounter.innerText = `${steps} Steps`;

            // Calculate speed
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - startTime) / 1000; // in seconds

            const currentSpeed = distance / elapsedTime;
            speedCounter.innerText = `${currentSpeed.toFixed(2)} m/s`;

            // Reset start time and distance for the next calculation
            startTime = currentTime;
            distance = 0;

            // Update distance (simple accumulation based on speed for demonstration purposes)
            distance += acceleration / 2 * Math.pow(elapsedTime, 2);
        }
    }

    function pausePedometer() {
        // Stop listening for motion events
        window.removeEventListener('devicemotion', handleMotion);
    }

    function resetPedometer() {
        steps = 0;
        distance = 0;
        stepCounter.innerText = `${steps} Steps`;
        speedCounter.innerText = '0 m/s';
        isCounting = false;
        startButton.innerText = 'Start';
        pausePedometer();
    }
});

import React, { useState, useEffect } from "react";
import Classifier from "./Classifier.js";
import { addRecordToDb } from "../db/records.js";
import lunge from "../components/vids/lunge.mp4";
import "../pages/css/Home.css";

const Lunge = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // For correct / incorrect
  const [hasStarted, setHasStarted] = useState(false);
  const [isCorrectState, setIsCorrectState] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [exerciseName, setExerciseName] = useState(""); // New state for exercise name

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleHome = () => {
    // Adds record to db
    addRecordToDb("Lunges", sets, reps, (err, response) => {
      if (err) console.log(err);
    });

    window.location.href = "/homepage";
  };

  // Controls the cameras
  const cameraClick = () => {
    setHasStarted(true);
    setIsTimerRunning(false);
    setTimer(30);
    setShowCamera(true);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setShowCamera(false);
  };

  const LABEL = "lunges";
  const COOLDOWN_TIME = 2000; // 2 seconds cooldown

  const predictionHandler = (predictions) => {
    if (predictions) {
      // console.log(predictions); // Uncomment for debugging

      if (predictions.label !== LABEL) {
        setIsCorrectState(false);
        setIncorrectCount((prevCount) => prevCount + 1);
        setExerciseName(""); // Clear exercise name if incorrect
      } else if (!isCooldown) {
        setIsCorrectState(true);
        setExerciseName("Lunge"); // Set exercise name if correct
        setReps((prevReps) => {
          const newReps = prevReps + 1;
          if (newReps >= 12) {
            setSets((prevSets) => {
              const newSets = prevSets + 1;
              if (newSets >= 4) {
                setShowCamera(false); // Close the camera after 4 sets
              }
              return newSets;
            });
            return 0;
          }
          return newReps;
        });
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), COOLDOWN_TIME);
      }
    }
  };

  return (
    <div className="home-container">
      <div className="dashboard-container">
        <h2 style={styles.heading}>Start Workout</h2>
        <div style={styles.videoContainer}>
          <video src={lunge} autoPlay loop muted style={styles.video}></video>
        </div>
        <div style={styles.webContainer}>
          <div style={styles.buttonContainer}>
            <button type="button" style={styles.button} onClick={cameraClick}>
              Start Workout
            </button>
            <button type="button" style={styles.button} onClick={startTimer}>
              Rest
            </button>
          </div>
          <div style={styles.text}>
            {hasStarted && (
              <h2 style={{ textAlign: "center", color: isCorrectState ? styles.greenText.color : styles.lightRedText.color, ...styles.exerciseText }}>
                {isCorrectState
                  ? "Correct Exercise"
                  : "Incorrect Exercise"}
              </h2>
            )}
          </div>
          <div style={styles.camera}>
            {showCamera && (
              <Classifier predictionHandler={predictionHandler} />
            )}
          </div>
          <div style={styles.text}>
            {exerciseName && (
              <h2 style={styles.exerciseName}>{exerciseName}</h2>
            )}
            {!exerciseName && hasStarted && (
              <h2 style={styles.unrecognizedExercise}>Unrecognized Exercise</h2>
            )}
            <h2 style={styles.setsRepsText}>
              Set: <span style={styles.greenText}>{sets}</span> / 4
            </h2>
            <h2 style={styles.setsRepsText}>
              Rep: <span style={styles.greenText}>{reps}</span> / 12
            </h2>
            <h2 style={styles.timerText}>
              Rest Duration: <span style={styles.greenText}>{timer} seconds</span>
            </h2>
          </div>
          <button type="button" style={styles.finishButton} onClick={handleHome}>
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lunge;

const styles = {
  heading: {
    textAlign: "center",
    fontFamily: "Viga, sans-serif",
    fontSize: "35px",
    fontWeight: "bold",
    lineHeight: "65px",
    color: "#fff",
    margin: "20px 0",
  },
  greenText: {
    color: "#5aad70",
  },
  lightRedText: {
    color: "#FF6666",
  },
  unrecognizedExercise: {
    textAlign: "center",
    color: "#FF6666",
    fontSize: "51px", // Modified text size
    fontWeight: "bold",
    marginTop: "5px", // Adjusted margin
  },
  exerciseName: {
    textAlign: "center",
    color: "#00FF00",
    fontSize: "51px", // Modified text size
    fontWeight: "bold",
    marginTop: "5px", // Adjusted margin
  },
  exerciseText: {
    fontSize: "51px", // Modified text size
    fontWeight: "bold",
    marginTop: "5px", // Adjusted margin
  },
  webContainer: {
    padding: "20px",
    backgroundColor: "#1a1a1a",
    border: "2px solid #333",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
    maxWidth: "600px",
    margin: "20px auto",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  camera: {
    marginBottom: "20px",
    borderRadius: "10px",
    overflow: "hidden",
    position: "relative",
  },
  text: {
    textAlign: "center",
    fontSize: "18px",
    color: "#fff",
    marginBottom: "20px",
  },
  button: {
    flex: "1",
    padding: "15px 20px",
    borderRadius: "5px",
    backgroundColor: "#DFA100",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    margin: "0 10px",
    transition: "background-color 0.3s ease",
  },
  finishButton: {
    width: "100%",
    padding: "15px 20px",
    borderRadius: "5px",
    backgroundColor: "#DFA100",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto 20px",
    padding: "10px",
    backgroundColor: "#000",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
  },
  video: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
  },
};

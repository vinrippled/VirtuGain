import React, { useState, useEffect } from "react";
import Classifier from "./Classifier.js";
import { addRecordToDb } from "../db/records.js";
import jacks from "../components/vids/jacks.mp4";
import "../pages/css/Home.css";

const Jack = () => {
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
    addRecordToDb("Jump and Jacks", sets, reps, (err, response) => {
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

  const LABEL = "jump_and_jacks";
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
        setExerciseName("Jumping Jack"); // Set exercise name if correct
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
          <video src={jacks} autoPlay loop muted style={styles.video}></video>
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
          <div style={styles.statusTextContainer}>
            {hasStarted && (
              <h2 style={{ color: isCorrectState ? styles.greenText.color : styles.lightRedText.color, ...styles.exerciseText }}>
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
            <h2 style={{ fontSize: "24px", marginTop: "10px", color: "#fff" }}>
              Set: <span style={styles.greenText}>{sets}</span> / 4
            </h2>
            <h2 style={{ fontSize: "24px", marginTop: "10px", color: "#fff" }}>
              Rep: <span style={styles.greenText}>{reps}</span> / 12
            </h2>
            <h2 style={{ fontSize: "24px", marginTop: "10px", color: "#fff" }}>
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

export default Jack;

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
  statusTextContainer: {
    textAlign: "center",
    marginBottom: "10px", // Reduced margin for closer placement
  },
  camera: {
    marginBottom: "20px",
    borderRadius: "10px",
    overflow: "hidden",
    position: "relative",
  },
  text: {
    textAlign: "center",
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
  buttonHover: {
    backgroundColor: "#b38000",
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
  exerciseName: {
    color: "#5aad70",
    fontSize: "51px", // Updated text size for exercise name
    fontWeight: "bold",
    marginTop: "10px",
  },
  unrecognizedExercise: {
    color: "#FF6666",
    fontSize: "51px", // Updated text size for unrecognized exercise
    fontWeight: "bold",
    marginTop: "10px",
  },
  exerciseText: {
    fontSize: "51px", // Updated text size for exercise status
    fontWeight: "bold",
    marginTop: "10px",
  },
};

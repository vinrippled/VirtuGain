export const EXERCISES_PER_TYPE = {
  underWeight: ["squats", "deadlifts", "overheadpress", "curls"],
  healthyWeight: ["overheadpress", "curls", "lunges", "pushups"],
  overWeight: ["lunges", "pushups", "jacks"],
  obese: ["curls", "deadlifts","overheadpress"],
};

export const EXERCISES = {
  curls: {
    name: "Bicep Curl",
    imageFile: "bicep.jpg",
    description: "STRENGTH TRAINING | Build strength in your Upper Arm.",
    link: "/curl",
  },
  deadlifts: {
    name: "Deadlift",
    imageFile: "lift.jpg",
    description: "STRENGTH TRAINING | Strengthening Upper and Lower Back, and Glutes.",
    link: "/lift",
  },
  jacks: {
    name: "JumpingJack",
    imageFile: "jacks.jpg",
    description: "CARDIO | Burn Fat and Build Muscle without using Weights.",
    link: "/jack",
  },
  lunges: {
    name: "Lunge",
    imageFile: "lunges.jpg",
    description: "CARDIO | Increases Muscle Mass in Core, Butt, and Legs.",
    link: "/lunge",
  },
  pushups: {
    name: "Push Up",
    imageFile: "pushup.jpg",
    description: "CARDIO | Strengthen and tone Chest, Triceps, and Shoulders.",
    link: "/pushup",
  },
  overheadpress: {
    name: "OverheadPress",
    imageFile: "press.jpg",
    description: "STRENGTH TRAINING | Strengthen Shoulders, and Triceps.",
    link: "/overheadpress",
  }, 
};

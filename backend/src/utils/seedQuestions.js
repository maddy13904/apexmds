import Question from "../models/Question.js";
import Subject from "../models/Subject.js";

const seedQuestions = async () => {
  const count = await Question.countDocuments();
  if (count > 0) {
    console.log("Questions already seeded");
    return;
  }

  console.log("Seeding demo questions...");

  const subjects = await Subject.find();

  const oralPath = subjects.find(s => s.name === "Oral Pathology");
  const anatomy = subjects.find(s => s.name === "General and Oral Human Anatomy");
  const pharma = subjects.find(s => s.name === "Pharmacology");

  if (!oralPath || !anatomy || !pharma) {
    console.log("Required subjects not found");
    return;
  }

  const questions = [
    {
      subject: oralPath._id,
      concept: "Ameloblastoma",
      questionText: "Which is the most common type of ameloblastoma?",
      options: [
        { text: "Unicystic", isCorrect: false },
        { text: "Solid/Multicystic", isCorrect: true },
        { text: "Peripheral", isCorrect: false },
        { text: "Desmoplastic", isCorrect: false }
      ],
      explanation:
        "Solid/Multicystic ameloblastoma is the most common variant and shows aggressive behavior.",
      difficulty: "medium"
    },

    {
      subject: anatomy._id,
      concept: "Trigeminal Nerve",
      questionText: "Which branch of trigeminal nerve exits through the foramen rotundum?",
      options: [
        { text: "Ophthalmic (V1)", isCorrect: false },
        { text: "Maxillary (V2)", isCorrect: true },
        { text: "Mandibular (V3)", isCorrect: false },
        { text: "Facial nerve", isCorrect: false }
      ],
      explanation:
        "The maxillary nerve (V2) exits the skull via the foramen rotundum.",
      difficulty: "easy"
    },

    {
      subject: pharma._id,
      concept: "Local Anesthetics",
      questionText: "Which local anesthetic has the longest duration of action?",
      options: [
        { text: "Lidocaine", isCorrect: false },
        { text: "Articaine", isCorrect: false },
        { text: "Bupivacaine", isCorrect: true },
        { text: "Prilocaine", isCorrect: false }
      ],
      explanation:
        "Bupivacaine has a longer duration of action compared to Lidocaine and others.",
      difficulty: "medium"
    }
  ];

  await Question.insertMany(questions);

  console.log("Demo questions seeded successfully");
};

export default seedQuestions;

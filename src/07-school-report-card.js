/**
 * 📝 School Report Card Generator
 *
 * Sharma ji ke bete ka report card generate karna hai! Student ka naam aur
 * subjects ke marks milenge, tujhe pura analysis karke report card banana hai.
 *
 * Rules:
 *   - student object: { name: "Rahul", marks: { maths: 85, science: 92, ... } }
 *   - Calculate using Object.values() and array methods:
 *     - totalMarks: sum of all marks (use reduce)
 *     - percentage: (totalMarks / (numSubjects * 100)) * 100,
 *       rounded to 2 decimal places using parseFloat(val.toFixed(2))
 *     - grade based on percentage:
 *       "A+" (>= 90), "A" (>= 80), "B" (>= 70), "C" (>= 60), "D" (>= 40), "F" (< 40)
 *     - highestSubject: subject name with highest marks (use Object.entries)
 *     - lowestSubject: subject name with lowest marks
 *     - passedSubjects: array of subject names where marks >= 40 (use filter)
 *     - failedSubjects: array of subject names where marks < 40
 *     - subjectCount: total number of subjects (Object.keys().length)
 *   - Hint: Use Object.keys(), Object.values(), Object.entries(),
 *     reduce(), filter(), map(), Math.max(), Math.min(), toFixed()
 *
 * Validation:
 *   - Agar student object nahi hai ya null hai, return null
 *   - Agar student.name string nahi hai ya empty hai, return null
 *   - Agar student.marks object nahi hai ya empty hai (no keys), return null
 *   - Agar koi mark valid number nahi hai (not between 0 and 100 inclusive),
 *     return null
 *
 * @param {{ name: string, marks: Object<string, number> }} student
 * @returns {{ name: string, totalMarks: number, percentage: number, grade: string, highestSubject: string, lowestSubject: string, passedSubjects: string[], failedSubjects: string[], subjectCount: number } | null}
 *
 * @example
 *   generateReportCard({ name: "Rahul", marks: { maths: 85, science: 92, english: 78 } })
 *   // => { name: "Rahul", totalMarks: 255, percentage: 85, grade: "A",
 *   //      highestSubject: "science", lowestSubject: "english",
 *   //      passedSubjects: ["maths", "science", "english"], failedSubjects: [],
 *   //      subjectCount: 3 }
 *
 *   generateReportCard({ name: "Priya", marks: { maths: 35, science: 28 } })
 *   // => { name: "Priya", totalMarks: 63, percentage: 31.5, grade: "F", ... }
 */

const calculateGrade = (percentage) => {
  if (percentage >= 90) {
    return 'A+';
  } else if (percentage >= 80) {
    return 'A';
  } else if (percentage >= 70) {
    return 'B';
  } else if (percentage >= 60) {
    return 'C';
  } else if (percentage >= 40) {
    return 'D';
  }
  return 'F';
}

export function generateReportCard(student) {
  if (!student || !student.name || !student.marks || typeof student.marks !== 'object') {
    return null;
  }

  const { name, marks } = student;

  const marksInSubjects = Object.values(marks);

  if (!marksInSubjects.length || marksInSubjects.some((marks) => typeof marks !== 'number' || marks < 0 || marks > 100)) {
    return null;
  }

  const totalMarks = marksInSubjects.reduce((acc, marksInSingleSub) => acc + marksInSingleSub, 0);

  const subjectCount = marksInSubjects.length;
  const percentage = (totalMarks / (subjectCount * 100)) * 100;

  const marksEntries = Object.entries(marks);

  const minMarks = Math.min(...marksInSubjects);
  const maxMarks = Math.max(...marksInSubjects);

  const lowestSubjectValue = marksEntries.find(([_subName, marks]) => marks === minMarks);
  const highestSubjectValue = marksEntries.find(([_subName, marks]) => marks === maxMarks);

  const passedSubjects = marksEntries.filter(([_subName, subMarks]) => subMarks >= 40).map(([subName]) => subName);
  const failedSubjects = marksEntries.filter(([_subName, subMarks]) => subMarks < 40).map(([subName]) => subName);

  return {
    name,
    totalMarks,
    percentage: parseFloat(percentage.toFixed(2)),
    grade: calculateGrade(percentage),
    highestSubject: highestSubjectValue[0],
    lowestSubject: lowestSubjectValue[0],
    passedSubjects,
    failedSubjects,
    subjectCount
  }
}

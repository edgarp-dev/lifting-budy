-- Get all completed routines for a particular user
SELECT *
FROM Routines
WHERE user_id = 1 AND is_completed = TRUE;

-- Get exercises from a particular routine
SELECT *
FROM RoutineExercises re
JOIN Exercises e ON re.exercise_id = e.exercise_id
WHERE re.routine_id = 1;

-- Get exercises that a user has done for a particular muscle
SELECT e.name, e.muscle, re.repetitions, re.weight, r.date
FROM Users u
JOIN Routines r ON u.user_id = r.user_id
JOIN RoutineExercises re ON r.routine_id = re.routine_id
JOIN Exercises e ON re.exercise_id = e.exercise_id
WHERE u.user_id = 1 AND e.muscle = 'Chest';
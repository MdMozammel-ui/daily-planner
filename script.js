// ========================================
// ELEMENTS
// ========================================

const routineForm =
    document.getElementById("routineForm");

const taskInput =
    document.getElementById("taskInput");

const startInput =
    document.getElementById("startInput");

const endInput =
    document.getElementById("endInput");

const categoryInput =
    document.getElementById("categoryInput");

const timeline =
    document.getElementById("timeline");

const emptyMessage =
    document.getElementById("emptyMessage");

const routineCount =
    document.getElementById("routineCount");

const currentDate =
    document.getElementById("currentDate");

const clearAll =
    document.getElementById("clearAll");

const resetToday =
    document.getElementById("resetToday");

const themeBtn =
    document.getElementById("themeBtn");


// ========================================
// PROGRESS ELEMENTS
// ========================================

const progressText =
    document.getElementById("progressText");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");


// ========================================
// SUMMARY ELEMENTS
// ========================================

const sleepHours =
    document.getElementById("sleepHours");

const codingHours =
    document.getElementById("codingHours");

const studyHours =
    document.getElementById("studyHours");

const thesisHours =
    document.getElementById("thesisHours");

const exerciseHours =
    document.getElementById("exerciseHours");

const workHours =
    document.getElementById("workHours");


// ========================================
// OVERVIEW BAR ELEMENTS
// ========================================

const codingBar =
    document.getElementById("codingBar");

const studyBar =
    document.getElementById("studyBar");

const thesisBar =
    document.getElementById("thesisBar");

const workBar =
    document.getElementById("workBar");

const exerciseBar =
    document.getElementById("exerciseBar");

const sleepBar =
    document.getElementById("sleepBar");

const personalBar =
    document.getElementById("personalBar");

const productivePercent =
    document.getElementById("productivePercent");


// ========================================
// DAILY TASK DATA
// ========================================

let routines =
    JSON.parse(
        localStorage.getItem("dailyTasks")
    ) || [];


// ========================================
// COMPLETION DATA
// ========================================
//
// Structure:
//
// {
//     "2026-10-01": [1, 2],
//     "2026-10-02": [1, 3]
// }
//
// অর্থাৎ কোন দিনে কোন task complete হয়েছে
// সেটা আলাদাভাবে save থাকবে.
//

let completionData =
    JSON.parse(
        localStorage.getItem(
            "dailyTaskCompletions"
        )
    ) || {};


// ========================================
// TODAY KEY
// ========================================

function getTodayKey() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


const todayKey =
    getTodayKey();


// ========================================
// CURRENT DATE
// ========================================

const today = new Date();

currentDate.textContent =
    today.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );


// ========================================
// SAVE TASKS
// ========================================

function saveRoutines() {

    localStorage.setItem(
        "dailyTasks",
        JSON.stringify(routines)
    );

}


// ========================================
// SAVE COMPLETION DATA
// ========================================

function saveCompletionData() {

    localStorage.setItem(
        "dailyTaskCompletions",
        JSON.stringify(
            completionData
        )
    );

}


// ========================================
// GET TODAY'S COMPLETED TASK IDs
// ========================================

function getTodayCompletedIds() {

    if (
        !completionData[todayKey]
    ) {

        completionData[todayKey] = [];

    }


    return completionData[todayKey];

}


// ========================================
// CHECK TASK COMPLETED TODAY
// ========================================

function isCompletedToday(id) {

    const completedIds =
        getTodayCompletedIds();


    return completedIds.includes(id);

}


// ========================================
// ADD DAILY TASK
// ========================================

routineForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            taskInput.value.trim();

        const start =
            startInput.value;

        const end =
            endInput.value;

        const category =
            categoryInput.value;


        if (
            !name ||
            !start ||
            !end
        ) {

            alert(
                "Please fill all fields."
            );

            return;

        }


        // Allow overnight task.
        //
        // Example:
        // 11:00 PM -> 7:00 AM
        //
        // This is valid for Sleep.


        const duration =
            calculateMinutes(
                start,
                end
            );


        if (duration <= 0) {

            alert(
                "Start and end time cannot be the same."
            );

            return;

        }


        const routine = {

            id: Date.now(),

            name: name,

            start: start,

            end: end,

            category: category

        };


        routines.push(routine);


        saveRoutines();

        renderRoutines();

        updateSummary();


        routineForm.reset();

    }
);


// ========================================
// RENDER ROUTINES
// ========================================

function renderRoutines() {

    timeline.innerHTML = "";


    const sortedRoutines =
        [...routines].sort(
            function(a, b) {

                return a.start.localeCompare(
                    b.start
                );

            }
        );


    routineCount.textContent =
        `${sortedRoutines.length} ${
            sortedRoutines.length === 1
                ? "task"
                : "tasks"
        }`;


    if (
        sortedRoutines.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    sortedRoutines.forEach(
        function(routine) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "timeline-item";


            const duration =
                calculateDuration(
                    routine.start,
                    routine.end
                );


            const icon =
                getCategoryIcon(
                    routine.category
                );


            const color =
                getCategoryColor(
                    routine.category
                );


            const completed =
                isCompletedToday(
                    routine.id
                );


            item.innerHTML = `

                <!-- TIME -->

                <div class="timeline-time">

                    ${formatTime(
                        routine.start
                    )}

                    <br>

                    ↓

                    <br>

                    ${formatTime(
                        routine.end
                    )}

                </div>


                <!-- LINE -->

                <div class="timeline-line">

                    <div
                        class="timeline-dot"
                        style="
                            background: ${color};
                        "
                    ></div>

                </div>


                <!-- CARD -->

                <div
                    class="
                        timeline-card
                        ${
                            completed
                                ? "completed"
                                : ""
                        }
                    "
                >

                    <div class="routine-header">

                        <div class="routine-name">

                            ${icon}

                            ${escapeHTML(
                                routine.name
                            )}

                        </div>


                        <span class="category">

                            ${routine.category}

                        </span>

                    </div>


                    <div class="routine-duration">

                        ⏱️ ${duration}

                    </div>


                    <div
                        class="
                            status-text
                            ${
                                completed
                                    ? "status-completed"
                                    : "status-pending"
                            }
                        "
                    >

                        ${
                            completed
                                ? "✓ Completed today"
                                : "○ Pending"
                        }

                    </div>


                    <div class="routine-actions">

                        <button
                            class="
                                ${
                                    completed
                                        ? "undo-btn"
                                        : "complete-btn"
                                }
                            "
                            data-action="complete"
                            data-id="${routine.id}"
                            type="button"
                        >

                            ${
                                completed
                                    ? "↩️ Undo"
                                    : "✅ Complete"
                            }

                        </button>


                        <button
                            class="edit-btn"
                            data-action="edit"
                            data-id="${routine.id}"
                            type="button"
                        >

                            ✏️ Edit

                        </button>


                        <button
                            class="delete-btn"
                            data-action="delete"
                            data-id="${routine.id}"
                            type="button"
                        >

                            🗑️ Delete

                        </button>

                    </div>

                </div>

            `;


            timeline.appendChild(item);

        }
    );

}


// ========================================
// BUTTON EVENT DELEGATION
// ========================================

timeline.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) return;


        const id =
            Number(
                button.dataset.id
            );


        const action =
            button.dataset.action;


        if (action === "complete") {

            toggleComplete(id);

        }


        if (action === "edit") {

            editRoutine(id);

        }


        if (action === "delete") {

            deleteRoutine(id);

        }

    }
);


// ========================================
// COMPLETE / UNDO
// ========================================

function toggleComplete(id) {

    const completedIds =
        getTodayCompletedIds();


    const index =
        completedIds.indexOf(id);


    if (index === -1) {

        // Complete

        completedIds.push(id);

    } else {

        // Undo

        completedIds.splice(
            index,
            1
        );

    }


    completionData[todayKey] =
        completedIds;


    saveCompletionData();

    renderRoutines();

    updateSummary();

}


// ========================================
// EDIT TASK
// ========================================

function editRoutine(id) {

    const routine =
        routines.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!routine) return;


    const newName =
        prompt(
            "Enter new task name:",
            routine.name
        );


    if (newName === null) return;


    const trimmedName =
        newName.trim();


    if (!trimmedName) {

        alert(
            "Task name cannot be empty."
        );

        return;

    }


    const newStart =
        prompt(
            "Enter start time (HH:MM):",
            routine.start
        );


    if (newStart === null) return;


    const newEnd =
        prompt(
            "Enter end time (HH:MM):",
            routine.end
        );


    if (newEnd === null) return;


    if (
        !isValidTime(newStart) ||
        !isValidTime(newEnd)
    ) {

        alert(
            "Please enter valid time like 09:00 or 23:30."
        );

        return;

    }


    if (
        calculateMinutes(
            newStart,
            newEnd
        ) <= 0
    ) {

        alert(
            "Start and end time cannot be the same."
        );

        return;

    }


    routine.name =
        trimmedName;

    routine.start =
        newStart;

    routine.end =
        newEnd;


    saveRoutines();

    renderRoutines();

    updateSummary();

}


// ========================================
// DELETE TASK
// ========================================

function deleteRoutine(id) {

    const routine =
        routines.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!routine) return;


    const confirmation =
        confirm(
            `Delete "${routine.name}" from your daily tasks?`
        );


    if (!confirmation) return;


    routines =
        routines.filter(
            function(item) {

                return item.id !== id;

            }
        );


    // Remove task from all
    // historical completion data.

    Object.keys(
        completionData
    ).forEach(
        function(date) {

            completionData[date] =
                completionData[date].filter(
                    function(taskId) {

                        return taskId !== id;

                    }
                );

        }
    );


    saveRoutines();

    saveCompletionData();

    renderRoutines();

    updateSummary();

}


// ========================================
// RESET TODAY
// ========================================

resetToday.addEventListener(
    "click",
    function() {

        const completedIds =
            getTodayCompletedIds();


        if (
            completedIds.length === 0
        ) {

            alert(
                "No completed task to reset today."
            );

            return;

        }


        const confirmation =
            confirm(
                "Reset all completed tasks for today?"
            );


        if (!confirmation) return;


        completionData[todayKey] =
            [];


        saveCompletionData();

        renderRoutines();

        updateSummary();

    }
);


// ========================================
// CLEAR ALL TASKS
// ========================================

clearAll.addEventListener(
    "click",
    function() {

        if (
            routines.length === 0
        ) {

            return;

        }


        const confirmation =
            confirm(
                "Delete ALL daily tasks permanently?"
            );


        if (!confirmation) return;


        routines = [];

        completionData = {};


        saveRoutines();

        saveCompletionData();

        renderRoutines();

        updateSummary();

    }
);


// ========================================
// CALCULATE MINUTES
// ========================================

function calculateMinutes(
    start,
    end
) {

    const [
        startHour,
        startMin
    ] =
        start
            .split(":")
            .map(Number);


    const [
        endHour,
        endMin
    ] =
        end
            .split(":")
            .map(Number);


    let startMinutes =
        startHour * 60 +
        startMin;


    let endMinutes =
        endHour * 60 +
        endMin;


    // Overnight task
    //
    // Example:
    // 23:00 -> 07:00
    //
    if (
        endMinutes < startMinutes
    ) {

        endMinutes += 24 * 60;

    }


    return (
        endMinutes -
        startMinutes
    );

}


// ========================================
// CALCULATE DURATION
// ========================================

function calculateDuration(
    start,
    end
) {

    const difference =
        calculateMinutes(
            start,
            end
        );


    const hours =
        Math.floor(
            difference / 60
        );


    const minutes =
        difference % 60;


    if (hours === 0) {

        return `${minutes} min`;

    }


    if (minutes === 0) {

        return `${hours}h`;

    }


    return `${hours}h ${minutes}min`;

}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(time) {

    const [
        hour,
        minute
    ] =
        time.split(":");


    const date =
        new Date();


    date.setHours(
        Number(hour),
        Number(minute),
        0,
        0
    );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// ========================================
// VALIDATE TIME
// ========================================

function isValidTime(time) {

    return /^([01]\d|2[0-3]):[0-5]\d$/
        .test(time);

}


// ========================================
// CATEGORY ICON
// ========================================

function getCategoryIcon(category) {

    const icons = {

        Coding: "💻",

        Study: "📚",

        Thesis: "📝",

        Work: "💼",

        Exercise: "⚽",

        Sleep: "😴",

        Personal: "🏠"

    };


    return (
        icons[category] ||
        "📌"
    );

}


// ========================================
// CATEGORY COLOR
// ========================================

function getCategoryColor(category) {

    const colors = {

        Coding: "#3b82f6",

        Study: "#8b5cf6",

        Thesis: "#ec4899",

        Work: "#f59e0b",

        Exercise: "#ef4444",

        Sleep: "#64748b",

        Personal: "#22c55e"

    };


    return (
        colors[category] ||
        "#22c55e"
    );

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    const totalMinutes = {

        Coding: 0,

        Study: 0,

        Thesis: 0,

        Work: 0,

        Exercise: 0,

        Sleep: 0,

        Personal: 0

    };


    const completedIds =
        getTodayCompletedIds();


    // ------------------------------------
    // Count ONLY completed tasks
    // ------------------------------------

    routines.forEach(
        function(routine) {

            if (
                !completedIds.includes(
                    routine.id
                )
            ) {

                return;

            }


            const duration =
                calculateMinutes(
                    routine.start,
                    routine.end
                );


            if (
                totalMinutes[
                    routine.category
                ] !== undefined
            ) {

                totalMinutes[
                    routine.category
                ] += duration;

            }

        }
    );


    // ------------------------------------
    // Summary Cards
    // ------------------------------------

    sleepHours.textContent =
        formatHours(
            totalMinutes.Sleep
        );


    codingHours.textContent =
        formatHours(
            totalMinutes.Coding
        );


    studyHours.textContent =
        formatHours(
            totalMinutes.Study
        );


    thesisHours.textContent =
        formatHours(
            totalMinutes.Thesis
        );


    exerciseHours.textContent =
        formatHours(
            totalMinutes.Exercise
        );


    workHours.textContent =
        formatHours(
            totalMinutes.Work
        );


    // ------------------------------------
    // Update Progress
    // ------------------------------------

    updateProgress();

    // ------------------------------------
    // Update Overview
    // ------------------------------------

    updateBars(totalMinutes);

}


// ========================================
// UPDATE PROGRESS
// ========================================

function updateProgress() {

    const total =
        routines.length;


    const completed =
        getTodayCompletedIds().length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );

    }


    progressText.textContent =
        `${completed} / ${total} Completed`;


    progressPercent.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;

}


// ========================================
// FORMAT HOURS
// ========================================

function formatHours(minutes) {

    if (minutes === 0) {

        return "0h";

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    if (hours === 0) {

        return `${mins}m`;

    }


    if (mins === 0) {

        return `${hours}h`;

    }


    return `${hours}h ${mins}m`;

}


// ========================================
// UPDATE OVERVIEW BARS
// ========================================

function updateBars(minutes) {

    const totalDay =
        24 * 60;


    codingBar.style.width =
        `${(
            minutes.Coding /
            totalDay
        ) * 100}%`;


    studyBar.style.width =
        `${(
            minutes.Study /
            totalDay
        ) * 100}%`;


    thesisBar.style.width =
        `${(
            minutes.Thesis /
            totalDay
        ) * 100}%`;


    workBar.style.width =
        `${(
            minutes.Work /
            totalDay
        ) * 100}%`;


    exerciseBar.style.width =
        `${(
            minutes.Exercise /
            totalDay
        ) * 100}%`;


    sleepBar.style.width =
        `${(
            minutes.Sleep /
            totalDay
        ) * 100}%`;


    personalBar.style.width =
        `${(
            minutes.Personal /
            totalDay
        ) * 100}%`;


    // Productive time
    //
    // Only completed tasks are counted.

    const productive =
        minutes.Coding +
        minutes.Study +
        minutes.Thesis +
        minutes.Work +
        minutes.Exercise;


    const percentage =
        Math.round(
            (
                productive /
                totalDay
            ) * 100
        );


    productivePercent.textContent =
        `${percentage}% completed productive time`;

}


// ========================================
// DARK MODE
// ========================================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "darkMode",
            isDark
        );

    }
);


// ========================================
// LOAD DARK MODE
// ========================================

const savedDarkMode =
    localStorage.getItem(
        "darkMode"
    );


if (
    savedDarkMode === "true"
) {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent =
        "☀️";

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ========================================
// INITIAL LOAD
// ========================================

renderRoutines();

updateSummary();
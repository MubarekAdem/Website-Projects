let i = 0;

$("table").on("click", "tr td", function () {
    // Check if the cell is empty
    if ($(this).is(':empty')) {
        if (i % 2 === 0) {
            $(this).append("<h1>X</h1>");
        } else {
            $(this).append("<h1>O</h1>");
        }

        // Increment i for the next turn
        i++;
    }
});

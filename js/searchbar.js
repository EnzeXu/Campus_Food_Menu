const target_food_keys = {
    "chicken": ["chicken"],
    "pork": ["pork", "ham"],
    "beef": ["beef", "steak"],
    "fish": ["fish", "fillet", "tilapia", "salmon", "cod", "tuna", "catfish"],
    "shrimp": ["shrimp"],
};

const color_dic = {
    "chicken": "#8dd3c7",
    "pork": "#ffffb3",
    "beef": "#bebada",
    "fish": "#fb8072",
    "shrimp": "#80b1d3",
}

const inverse_location_dictionary = {
    "Commons Dining Hall": 78390,
    "Food Hall @ Sadler": 78391,
};

const inverse_period_dictionary = {
    "Breakfast": 5408,
    "Lunch": 5409,
    "Dinner": 5410,
    "All Day": 5411,
};

const period_dictionary = {
    "5408": "Breakfast",
    "5409": "Lunch",
    "5410": "Dinner",
    "5411": "All Day",
};

const station_dictionary = {
    "44367": "Greens & Grains",
    "44368": "Ignite",
    "44369": "Piazza",
    "44370": "Savor & Spice",
    "44371": "Confectionary",
    "44372": "Savory Stack",
    "45173": "Root",
    "45174": "One World Kitchen",
    "45175": "True Balance",
    "45176": "Simmer & Thyme",
    "45177": "Foodie Fest",
    "45210": "Graze",
    "45211": "Under The Hood",
    "45212": "Global Kitchen",
    "45213": "Uno Mas",
    "45214": "True Balance",
    "45215": "Sweet Pickles",
    "45216": "Trattoria",
    "45217": "Sweet Nothings",
    "45218": "Main Ingredient",
    "45219": "Fruit And Yogurt Bar",
    "45621": "Toppings Bar",
    "46414": "Tb Smoothies",
}

document.addEventListener('DOMContentLoaded', function() {
    let locationChoice = document.getElementById('location-choice');
    let locationList = ['Commons Dining Hall', 'Food Hall @ Sadler']; // Example location list

    locationList.forEach(function(location) {
        let option = new Option(location, location);
        locationChoice.add(option);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    let locationChoice = document.getElementById('location-choice-week');
    let locationList = ['Commons Dining Hall', 'Food Hall @ Sadler']; // Example location list

    locationList.forEach(function(location) {
        let option = new Option(location, location);
        locationChoice.add(option);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    let meatChoice = document.getElementById('meat-choice');
    let meatList = ["All"].concat(Object.keys(target_food_keys));
    // console.log(meatList)
    // console.log(Array.from(Object.keys(target_food_keys)))
    // console.log(Object.keys(target_food_keys))

    meatList.forEach(function(location) {
        let option = new Option(location, location);
        meatChoice.add(option);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var periodChoice = document.getElementById('period-choice');
    var periodList = ['Breakfast', 'Lunch', 'Dinner', 'All Day']; // Example period list

    periodList.forEach(function(period) {
        var option = new Option(period, period);
        if (period === 'Dinner') {
            option.style.color = 'black'; // Make "Dinner" black
        } else {
            option.style.color = '#cccccc'; // Make other options light gray
        }
        periodChoice.add(option);
    });
});

function highlightKeywordInText(text, keyword) {
    // Escape special characters in the keyword for use in a regular expression
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Use a regular expression to globally and case-insensitively find the keyword
    const regex = new RegExp(escapedKeyword, 'gi');

    // Replace all occurrences of the keyword with a span element that highlights the keyword
    return text.replace(regex, match => `<span style="color: blue;">${match}</span>`);
}

function fetchDataFromPath(path) {
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

function displayResults(results, keyword) {
    let product_keywords = ["Period", "Station", "ProductId", "MarketingName", "ShortDescription", "IsOrganic", "IsVegan", "IsVegetarian", "ServingSize", "ServingUnit", "Calories", "CaloriesFromFat", "IngredientStatement"];
    let title_html = "";
    product_keywords.forEach(item => {
        title_html += `<th>${item}</th>`;
    });
    let tableHTML = `<table class="table"><thead><tr>` + title_html + `</tr></thead><tbody>`;

    let body_html = "";
    results.forEach(item => {
        if (keyword.length === 0 || (`${item["MarketingName"]}/${item["ShortDescription"]}/${item["IngredientStatement"]}`).toLowerCase().includes(keyword.toLowerCase())) {
            let content_html = "";
            product_keywords.forEach(one_keyword => {
                let content;
                if (one_keyword === "Period") {
                    // console.log(item[one_keyword]);
                    content = period_dictionary[item["PeriodId"]];
                } else if (one_keyword === "Station") {
                    if (period_dictionary[item["PeriodId"]]) {
                        content = station_dictionary[item["StationId"]];
                    } else {
                        content = "Unknown Station";
                    }
                } else {
                    if (keyword.length === 0) {
                        content = item[one_keyword];
                    } else {
                        content = highlightKeywordInText(String(item[one_keyword]), String(keyword));
                    }
                }
                content_html += `<td>${content}</td>`;
            });
            body_html += `<tr>` + content_html + `</tr>`;
        }
    });
    tableHTML += body_html;
    tableHTML += `</tbody></table>`;
    console.log(tableHTML);

    if (body_html.length > 0) {
        document.getElementById('search-results').innerHTML = tableHTML;
    } else {
        document.getElementById('search-results').innerHTML = "<p>Data not found for the given criteria.</p>";
    }

}

function processData(data, location, period, date, keyword) {
    console.log(data["location_data"]);
    try {
        const location_id = inverse_location_dictionary[location];
        const period_id = inverse_period_dictionary[period];
        console.log("location id:", location_id);
        console.log("period id:", period_id);
        console.log(`fetching data["location_data"][${location_id}]["date_data"][${date}][${period_id}]`);
        const results = data["location_data"][location_id]["date_data"][date][period_id];
        console.log("results:", results);
        displayResults(results, keyword); // Function to display results in a table
    } catch (error) {
        console.error("Data not found for the given criteria", error);
        document.getElementById('search-results').innerHTML = "<p>Data not found for the given criteria.</p>";
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.search-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Getting user inputs
        const date = document.getElementById('date-choice').value;
        const location = document.getElementById('location-choice').value;
        const period = document.getElementById('period-choice').value;
        const keyword = document.getElementById('keyword-input').value;
        console.log("'" + date + "', '" + location + "', '" + period + "', '" + keyword + "'");
        fetchDataFromPath('../local_data/data.json')
            .then(data => {
                processData(data, location, period, date, keyword);
            })
            .catch(error => {
                console.error("Error fetching data from first path:", error);
                // Try the second path if the first fails
                fetchDataFromPath('../Campus_Food_Menu/local_data/data.json')
                    .then(data => {
                        processData(data, location, period, date, keyword);
                    })
                    .catch(finalError => {
                        console.error("Error fetching data from second path:", finalError);
                        document.getElementById('search-results').innerHTML = "<p>Unable to fetch data from both paths.</p>";
                    });
            });
    });
});
//
// document.getElementById('button-search').addEventListener('click', function() {
//     const date = document.getElementById('date-choice').value;
//     const location = document.getElementById('location-choice').value;
//     const period = document.getElementById('period-choice').value;
//     const keyword = document.getElementById('keyword-input').value;
//     console.log("'" + date + "', '" + location + "', '" + period + "', '" + keyword + "'");
//     fetchDataFromPath('../local_data/data.json')
//         .then(data => {
//             processData(data, location, period, date, keyword);
//         })
//         .catch(error => {
//             console.error("Error fetching data from first path:", error);
//             // Try the second path if the first fails
//             fetchDataFromPath('../Campus_Food_Menu/local_data/data.json')
//                 .then(data => {
//                     processData(data, location, period, date, keyword);
//                 })
//                 .catch(finalError => {
//                     console.error("Error fetching data from second path:", finalError);
//                     document.getElementById('search-results').innerHTML = "<p>Unable to fetch data from both paths.</p>";
//                 });
//         });
// });

function processDataWeek(location_id, meat_choice) {
    fetchDataFromPath('../local_data/data.json')
        .then(data => {
            let data_location = data["location_data"][location_id]["date_data"]; // [date][period_id]
            let available_dates = data["location_data"][location_id]["date_list"];
            let data_week = collectWeekInfo(data_location, available_dates);
            console.log("data_week:", data_week);
            let categories = Object.keys(data_week[0]["week_count_sum_dic"]);
            if (meat_choice !== "All") {
                categories = [meat_choice];
            }
            displayWeekInfo(data_week, categories);

        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.search-form-week').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Getting user inputs
        const location = document.getElementById('location-choice-week').value;
        const meat_choice = document.getElementById('meat-choice').value;
        const location_id = inverse_location_dictionary[location];
        console.log("'" + location + "', '" + meat_choice + "'");

        processDataWeek(location_id, meat_choice);
    });
});

// document.getElementById('button-week').addEventListener('click', function() {
//     const location = document.getElementById('location-choice-week').value;
//     const meat_type = document.getElementById('meat-choice').value;
//     const location_id = inverse_location_dictionary[location];
//     console.log("'" + location + "', '" + meat_type + "'");
//
//     processDataWeek(location_id);
// });

function getOperatingSystem() {
    var platform = navigator.platform.toLowerCase();
    // var userAgent = navigator.userAgent.toLowerCase();

    if (platform.includes('mac')) {
        return 'macOS';
    } else if (platform.includes('linux')) {
        return 'Linux';
    } else {
        return 'Other';
    }
}

// console.log("Platform: ", getOperatingSystem());



//
// processDataWeek(78391);

function collectWeekInfo(dic, available_dates) {
    console.log(dic);
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    let weekIndex = 0;
    let result = [];

    // Find the first Sunday
    let startDateIndex = available_dates.findIndex(date => new Date(date).getDay() === 0);
    if (startDateIndex === -1) {
        console.error("No Sunday in available dates.");
        return [];
    }

    for (let i = startDateIndex; i < available_dates.length; i += 7) {
        let weekStartDate = available_dates[i];
        let weekEndDate = available_dates[Math.min(i + 6, available_dates.length - 1)];

        let week_count_sum_dic = {};
        Object.keys(target_food_keys).forEach(one_key => {
            week_count_sum_dic[one_key] = 0;
        })

        for (let j = i; j <= i + 6 && j < available_dates.length; j++) {
            let date = available_dates[j];
            if (dic[date]) {
                Object.values(inverse_period_dictionary).forEach(one_period => {
                    let one_period_food_list = dic[date][one_period];
                    one_period_food_list.forEach(one_dish => {
                        let context = one_dish["IngredientStatement"] + one_dish["ShortDescription"];
                        // console.log("context", context);
                        let one_count_dic = countKeywordsInText(context, target_food_keys);
                        Object.keys(target_food_keys).forEach(one_keyword => {
                            week_count_sum_dic[one_keyword] += one_count_dic[one_keyword];
                        })
                    });

                })
                // weekValueSum += dic[date]; // Ensure the date exists in the dictionary
            }
        }

        // Store the week information in the result object
        result.push({
            "week_start_date": weekStartDate,
            "week_end_date": weekEndDate,
            "week_count_sum_dic": week_count_sum_dic,
        });

        weekIndex++;
    }

    return result;
}

// Example usage:
// let dic = {
//     "2023-04-02": 1,
//     "2023-04-03": 1,
//     "2023-04-04": 1,
//     "2023-04-05": 1,
//     "2023-04-06": 1,
//     "2023-04-07": 1,
//     "2023-04-08": 1,
//     "2023-04-09": 2,
//     "2023-04-10": 2,
//     "2023-04-11": 2,
//     "2023-04-12": 2,
//     "2023-04-13": 2,
//     "2023-04-14": 2,
//     "2023-04-15": 3,
//     "2023-04-16": 3,
//     "2023-04-17": 3,
// };
//
// let available_dates = Object.keys(dic);
// console.log(collectWeekInfo(dic, available_dates));

function countKeywordsInText(text, target_keys) {
    // Normalize the text to lowercase
    text = text.toLowerCase();

    // Prepare the result dictionary
    const results = {};

    // Process each keyword group
    Object.keys(target_keys).forEach(key => {
        let count = 0;
        // Normalize and count each synonym in the list
        target_keys[key].forEach(synonym => {
            synonym = synonym.toLowerCase();
            const regex = new RegExp(`\\b${synonym}\\b`, 'g'); // Use word boundaries to count whole words only
            const matches = text.match(regex);
            // count += (matches ? matches.length : 0);
            count = count? 1:(matches ? 1 : 0);
        });
        // Store the result
        results[key] = count;
    });

    return results;
}


function displayWeekInfo(data, categories) {
// document.addEventListener('DOMContentLoaded', function () {
//     const data = [
//         {
//             "week_start_date": "2024-02-03",
//             "week_end_date": "2024-02-09",
//             "week_count_sum_dic": {chicken: 142, pork: 125, beef: 63, fish: 5, lamb: 0}
//         },
//         {
//             "week_start_date": "2024-02-10",
//             "week_end_date": "2024-02-16",
//             "week_count_sum_dic": {chicken: 112, pork: 120, beef: 60, fish: 15, lamb: 8}
//         }
//     ];

    const margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1400 - margin.left - margin.right, //960
        height = 500 - margin.top - margin.bottom;

    d3.select("#week-info-chart").selectAll("*").remove();
    const svg = d3.select("#week-info-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    const x1 = d3.scaleBand()
        .paddingInner(0.1)
        .paddingOuter((5 - categories.length) / 10 + 0.1);
// .padding(0.05);

    const y = d3.scaleLinear()
        .rangeRound([height, 0]);

    const color = d3.scaleOrdinal()
        // .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"]);
        .range(categories.map(one_key => color_dic[one_key]));


    // const categories = ["chicken", "pork", "beef", "fish", "lamb"];
    // const categories = Object.keys(data[0]["week_count_sum_dic"]);

    x0.domain(data.map(d => `${d.week_start_date} - ${d.week_end_date}`));
    x1.domain(categories).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, d => d3.max(categories, key => d.week_count_sum_dic[key]))]).nice();

    // svg.append("g")
    //     .selectAll("g")
    //     .data(data)
    //     .enter().append("g")
    //     .attr("transform", d => `translate(${x0(`${d.week_start_date} - ${d.week_end_date}`)},0)`)
    //     .selectAll("rect")
    //     .data(d => categories.map(key => ({key, value: d.week_count_sum_dic[key]})))
    //     .enter().append("rect")
    //     .attr("x", d => x1(d.key))
    //     .attr("y", d => y(d.value))
    //     .attr("width", x1.bandwidth())
    //     .attr("height", d => height - y(d.value))
    //     .attr("fill", d => color(d.key));

    const group = svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", d => `translate(${x0(`${d.week_start_date} - ${d.week_end_date}`)},0)`);

    // console.log(x1.bandwidth())
    const bar = group.selectAll("rect")
        .data(d => categories.map(key => ({ key, value: d.week_count_sum_dic[key] })))
        .enter().append("rect")
        // .attr("x", d => x1(d.key))
        .attr("x", d => x1(d.key))
        .attr("y", y(0))
        .attr("width", x1.bandwidth()) // Math.min(x1.bandwidth(), 46)
        .attr("height", 0)
        .attr("fill", d => color(d.key));

    const barText = group.selectAll("text.value")
        .data(d => categories.map(key => ({ key, value: d.week_count_sum_dic[key] })))
        .enter().append("text")
        .attr("class", "value")
        .attr("x", d => x1(d.key) + x1.bandwidth() / 2)
        .attr("y", y(0))
        .attr("text-anchor", "middle")
        .text(d => d.value);

    // Animate the text along with the bars
    barText.transition()
        .duration(1000)
        .attr("y", d => y(d.value) - 5); // Move text to the top of the bar

    // Transition to grow the bars
    bar.transition()
        .duration(1000)
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value));


    // Add x-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .style("font-size", "16px");

    // Add y-axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .selectAll("text")
        .style("font-size", "16px");

    // Add legend
    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 17)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(categories.slice().reverse())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d);
}
// });

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date-choice');
    const today = new Date();
    // Format as MM/DD/YYYY
    const formattedDate = ((today.getMonth() + 1) + '').padStart(2, '0') + '/'
        + (today.getDate() + '').padStart(2, '0') + '/'
        + today.getFullYear();
    dateInput.value = today.toISOString().split('T')[0]; // Set input value in YYYY-MM-DD
    // Optionally display the date in MM/DD/YYYY somewhere in UI if needed
    // document.getElementById('display-date').textContent = formattedDate;
});


processDataWeek(78390, "All");
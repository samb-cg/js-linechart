# Basic javascript line chart

This is very easy solution for anyone looking to use a simple line chart on their website. If you are looking for a more 
extensive library I recommend using something like Chart.js.

## Usage

This code creates a single blue line chart

```javascript
const chart = new LineChart(svg, {
    data: {
        labels: array_with_dates,
        datasets: [
            {
                name: "foo",
                data: array_with_data,
                linecolor: #007bff,
                pointcolor: #007bff 
            }
        ]
    }
});
```

To add more lines simply increase the amount of datasets

```javascript
const chart = new LineChart(svg, {
    data: {
        labels: array_with_dates,
        datasets: [
            {
                name: "foo",
                data: array_with_data,
                linecolor: #007bff,
                pointcolor: #007bff 
            },
            {
                name: "bar",
                data: another_array_with_data,
                linecolor: #e60000,
                pointcolor: #e60000 
            }
        ]
    }
});
```

Make sure the data in the data arrays are numbers and that the length of the array equals that of the date array.
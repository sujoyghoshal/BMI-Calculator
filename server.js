const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static('./public'));
app.use(express.static('./public/style.css'));

//*Task 1: Endpoint to calculate BMI
app.post('/calculate', (req, res) => {
    const { gender, age, weight, height } = req.body;
    let bmi;
    if (height <= 110) {
        bmi = weight / (1.1 * 1.1);
    } else {
        bmi = weight / ((height / 100) * (height / 100));
    }
    let state;
    if (bmi < 18.5) {
        state = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        state = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
        state = 'Overweight';
    } else {
        state = 'Obesity';
    }

    const result = { gender, age, weight, height, bmi, state };

    //*Store BMI data in data.json
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data file');
        }
        const bmiData = JSON.parse(data);
        bmiData.push(result);
        fs.writeFile('./data.json', JSON.stringify(bmiData), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing data file');
            }
            res.json(result);
        });
    });
});

//*Task 4: Endpoint to retrieve stored data
app.get('/getdata', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data file');
        }
        const bmiData = JSON.parse(data);
        res.json(bmiData);
    });
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const promptsFilePath = path.join(__dirname, 'prompts.json');

app.use(express.json());

// Define the /save-prompt route
app.post('/save-prompt', (req, res) => {
    const promptData = req.body;
    console.log('Prompt data received:', promptData);

    fs.readFile(promptsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading prompts.json:', err);
            return res.status(500).send('Failed to read prompts file.');
        }

        const prompts = JSON.parse(data);
        prompts.push(promptData);

        fs.writeFile(promptsFilePath, JSON.stringify(prompts, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to prompts.json:', err);
                return res.status(500).send('Failed to save the new prompt.');
            }

            res.status(200).send({ message: 'Prompt saved successfully!' });
        });
    });
});

// Serve updatePrompts.html
app.get('/update-prompts', (req, res) => {
    res.sendFile(path.join(__dirname, 'updatePrompts.html'));
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

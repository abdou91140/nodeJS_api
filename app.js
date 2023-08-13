require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],  // Les méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // Les en-têtes autorisés
}));

const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: false }));

app.use("/api/data", require("./routes/society.js"));
app.use("/pdf", require("./routes/pdf.js"));


app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);

});

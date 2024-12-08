import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        allowedHeaders: 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
    import(`./routes/${file}`).then((route) => {
        app.use("/api", route.default);
    })
    .catch((err) => {
        console.log("Failed to load route file", err);
    });
})

const server = () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running at port ${port}`);
        });
    } catch (error) {
        console.log("Failed to strt server.....", error.message);
        process.exit(1);
    }
}

server();
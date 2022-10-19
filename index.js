const express = require("express");

var app = express();
var router = express.Router();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(router);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "html");

app.listen(
    PORT,
    () => console.log("App live and listening on port " + PORT)
);

router.get("/", (req, res) => {
    return res.sendFile("index.html", { root: "public/views" });
});

router.get("/previews", (req, res) => {
    var UUIDRegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    if (!req.query || !req.query.authToken || !UUIDRegExp.test(req.query.authToken)) return res.redirect("/");
    return res.sendFile("previews.html", { root: "public/views" });
});

router.get("/howto", (req, res) => {
    return res.sendFile("howto.html", { root: "public/views" });
});

app.get("*", (req, res) => {
    return res.redirect("/");
});

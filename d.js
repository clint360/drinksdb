var http = require("http");
http
    .createServer(function (req, res) {
    handleDrinksRequest(req, res);
})
    .listen(8080);
console.log("Listening on port 8080");
function throw404(res) {
    writeJson(res, { status: "Resource not found" }, 404);
}
function handleDrinksRequest(req, res) {
    var pathname = parse(req.url).pathname;
    var method = req.method;
    if (pathname === "/drinks") {
        if (method === "GET") {
            return getAllDrinks(req, res);
        }
        else if (method === "POST") {
            return createDrink(req, res);
        }
    }
    else if (pathname.split("/").length === 3) {
        switch (method.toLowerCase()) {
            case "get":
                return getOneDrink(req, res);
            case "put":
                return updateOneDrink(req, res);
            case "patch":
                return patchOnDrink(req, res);
            case "delete":
                return deleteOneDrink(req, res);
            default:
                break;
        }
    }
    throw404(res);
}

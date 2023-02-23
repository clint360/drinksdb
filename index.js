const http = require("http");
let { parse } = require("url");
let {
  getAllDrinks,
  createDrinks,
  getOneDrinks,
  updateOneDrinks,
  patchOnDrinks,
  deleteOneDrinks,
} = require("./drinksdb.ts");
const { writeJson } = require("./utils");

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
  const { pathname } = parse(req.url);
  const { method } = req;
  if (pathname === "/drinks") {
    if (method === "GET") {
      return getAllDrinks(req, res);
    } else if (method === "POST") {
      return createDrink(req, res);
    }
  } else if (pathname.split("/").length === 3) {
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

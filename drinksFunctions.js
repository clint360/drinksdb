const database = require("./drinksdb");
const { writeJson, readRequestData, getIdFromUrl } = require("./utils");

function getAllDrinks(req, res) {
  const drinks = database.getDrinks();
  writeJson(res, drinks);
}

function getOneDrink(req, res) {
  const id = getIdFromUrl(req.url);
  const drinks = database.getDrinks();
  const drink = drinks.find((u) => u.id === id);
  if (drink) {
    writeJson(res, drink);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}
async function updateOneDrink(req, res) {
  const id = getIdFromUrl(req.url);
  const { name, image, category } = await readRequestData(req);
  if (!name || !image || !category) {
    return writeJson(res, { error: "Drink data missing" }, 403);
  }
  const drinks = database.getDrinks();
  const index = drinks.findIndex((drink) => drink.id === id);
  if (index > -1) {
    drinks.splice(index, 1, { name, image, category, id });
    database.saveDrinks(drinks);
    writeJson(res, drinks[index]);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

function deleteOneDrink(req, res) {
  const id = getIdFromUrl(req.url);
  const drinks = database.getDrinks();
  const index = drinks.findIndex((drink) => drink.id === id);
  if (index > -1) {
    drinks.splice(index, 1);
    database.saveDrinks(drinks);
  }
  writeJson(res, { status: "success" });
}

async function patchOnDrink(req, res) {
  const id = getIdFromUrl(req.url);
  const data = await readRequestData(req);
  if (!data) {
    return writeJson(res, { error: "Drink data missing" }, 403);
  }
  const drinks = database.getDrinks();
  const index = drinks.findIndex((drink) =>drink.id === id);
  if (index > -1) {
    drinks.splice(index, 1, { ...drinks[index], ...data, id });
    database.saveDrinks(drinks);
    writeJson(res, drinks[index]);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

async function createDrink(req, res) {
  const data = await readRequestData(req);
  if (!data) {
    return writeJson(res, { error: "Drink data missing" }, 403);
  }
  const newDrink = { ...data, id: Date.now() };
  const drinks = database.getDrinks();
  database.saveDrinks([...drinks, newDrink]);
  writeJson(res, newDrink);
}

module.exports = {
  getAllDrinks,
  createDrink,
  getOneDrink,
  updateOneDrink,
  deleteOneDrink,
  patchOnDrink,
};

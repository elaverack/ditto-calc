const path = require("path");
const express = require("express");
// Monorepo calc (not published as npm "calc"); subpkg only runs locally — use dist for Vercel etc.
const calc = require(path.join(__dirname, "calc", "dist", "index.js"));
const app = express();

app.use(express.json());

app.get("/calculate", function (req, res, next) {
	const gen = calc.Generations.get(typeof req.body.gen === "undefined" ? 9 : req.body.gen);
	var error = "";
	if (typeof req.body.attackingPokemon === "undefined") {
		error += "attackingPokemon must exist and have a valid pokemon name\n";
	}
	if (typeof req.body.defendingPokemon === "undefined") {
		error += "defendingPokemon must exist and have a valid pokemon name\n";
	}
	if (error) {
		throw new Error(error);
	}
	const result = calc.calculate(
		gen,
		new calc.Pokemon(gen, req.body.attackingPokemon, req.body.attackingPokemonOptions),
		new calc.Pokemon(gen, req.body.defendingPokemon, req.body.defendingPokemonOptions),
		new calc.Move(gen, req.body.moveName),
		new calc.Field(typeof req.body.field === "undefined" ? undefined : req.body.field)
	);
	res.json(result);
});

app.use(express.static(path.join(__dirname, "dist")));

var port = process.env.PORT || 3000;
if (require.main === module) {
	app.listen(port, function () {
		console.log("Server running on port " + port);
	});
}

module.exports = app;

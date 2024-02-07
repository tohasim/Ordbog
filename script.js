"use strict";

let rawtext = "";

let globalArrayOfWords = "";
start();
async function start() {
	rawtext = await fetch("./Data/data.csv").then((response) => response.text());
	globalArrayOfWords = rawtext.split("\n").map((line) => {
		const parts = line.split("\t");
		return {
			variant: parts[0],
			headword: parts[1],
			homograph: parts[2],
			partofspeech: parts[3],
			id: parts[4],
		};
	});
}

function wordAndObjectComparer(word, object) {
	return object.variant.localeCompare(word);
}

function binarySearchWithComparer(
	word,
	comparer = wordAndObjectComparer(),
	values = globalArrayOfWords
) {
	let min = 0;
	let max = values.length - 1;
	while (true) {
		let index = Math.floor((min + max) / 2);
		let middleObject = values[index];
		let comparison = comparer(word, middleObject);
		if (index >= max) {
			return "Ordet blev ikke fundet";
		}
		switch (comparison) {
			case 0:
				return index;
			case 1:
				max = index - 1;
				break;
			case -1:
				min = index + 1;
				break;
		}
	}
}
function measureTimes() {
	performance.mark("beforeBinarySearch");
	const binaryIndex = binarySearchWithComparer("skejes", wordAndObjectComparer);
	performance.mark("afterBinarySearch");

	performance.measure(
		"binarySearch",
		"beforeBinarySearch",
		"afterBinarySearch"
	);

	performance.mark("beforeFind");
	const findIndex = globalArrayOfWords.findIndex(
		(wordObject) => wordObject.variant === "skejes"
	);
	performance.mark("afterFind");

	performance.measure("find", "beforeFind", "afterFind");

	console.log(`
    Time spent on binary search: ${
			performance.getEntriesByName("binarySearch")[0].duration
		}, found index ${binaryIndex}
    Time spent on find: ${
			performance.getEntriesByName("find")[0].duration
		}, found index ${findIndex}
    `);
}

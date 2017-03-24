xlsxj = require('xlsx-to-json')
xlsxj({
  input: "questions.xlsx",
  output: "questions.json"
}, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
})

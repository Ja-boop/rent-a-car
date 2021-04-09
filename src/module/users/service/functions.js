module.exports = function getCurrentDate() {
    let today = new Date();

    let year = today.getFullYear();
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let date = ("0" + today.getDate()).slice(-2);

    return currentDate = `${year}-${month}-${date}`
}

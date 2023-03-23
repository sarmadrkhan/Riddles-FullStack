/**
 * Constructor function for new Film objects
 * @param {string} riddleId unique ID of the riddle (e.g., '1')
 * @param {string} text the text of the riddle
 * @param {string} difficulty easy, average or difficult
 * @param {number} maxDuration the maxDuration assigned to the riddle from 30-600 seconds
 * @param {string} answer the answer of the riddle
 * @param {string} hint1 the first hint of the riddle
 * @param {string} hint2 the second hint of the riddle
 * @param {boolean} isClosed the riddle is answered or not
 * @param {number} author the id of author of the riddle
*/
function Riddle({ riddleId, text, difficulty, maxDuration, answer, hint1, hint2, isClosed, author, replies=[] } = {}) {
    this.riddleId = riddleId;
    this.text = text;
    this.difficulty = difficulty;
    this.maxDuration = maxDuration;
    this.answer = answer;
    this.hint1 = hint1;
    this.hint2 = hint2;
    this.isClosed = isClosed;
    this.author = author;
    this.replies = replies;
}

exports.Riddle = Riddle
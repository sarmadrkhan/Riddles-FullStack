'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');
const {Riddle} = require('./models/Riddle')
// This function retrieves the whole list of films from the database.
exports.getRiddles = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM riddles';
      db.all(sql, [], (err, rows) => {
        if (err) { reject(err); return; }
        else {
          const riddles = rows.map(row => new Riddle(row))
          resolve(riddles);
        }
      });
    });
};
exports.getPlayers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
      if (err) { reject(err); return; }
      else {
        const players = rows.map(row => {
          return {
            id: row.id,
            name: row.name,
            score: row.score,
          }
        })
        resolve(players);
      }
    });
  });
};
exports.getResponsesByRiddleId = (riddleId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM replies WHERE riddleId=?';
    db.all(sql,[riddleId], (err, rows) => {
      if (err) { reject(err); return; }
      else {
        const replies = rows.map(row => {
          return {
            author: row.author,
            reply: row.reply
          }
        })
        resolve(replies);
      }
    })
  })
}
exports.getMyRiddles = (authorId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM riddles WHERE author=?';
    db.all(sql, [authorId], (err, rows) => {
      if (err) { reject(err); return; }
      else {
        const riddles = rows.map(row => new Riddle(row))
        resolve(riddles);
      }
    });
  });
};
// This function retrieves a film given its id and the associated user id.
exports.getRiddleById = (riddleId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM riddles WHERE riddleId=?';
      db.get(sql, [riddleId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row == undefined) {
          resolve({ error: 'Riddle not found.' });
        } else {
          const riddle = new Riddle(row)
          //  {
          //   riddleId: row.riddleId,
          //   text: row.text,
          //   difficulty: row.difficulty,
          //   maxDuration: row.maxDuration,
          //   answer: row.answer,
          //   hint1: row.hint1,
          //   hint2: row.hint2,
          //   isClosed: row.isClosed,
          //   author: row.author
          //   replies: row.replies
          // }
          resolve(riddle);
        }
      });
    });
};

exports.getPlayerById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'User not found.' });
      } else {
        const player = {
          id: row.id,
          score: row.score,
          name: row.name
        }
        resolve(player);
      }
    });
  });
};

exports.closeRiddle = (riddleId) => {
  return new Promise ((resolve, reject)=>{
    const sql = 'UPDATE riddles SET isClosed = 1, maxDuration = 0 WHERE riddleId=?';
    db.run(sql,[riddleId], function (err) {
      if(err){
        reject(err);
        return;
      }
      resolve(exports.getRiddleById(riddleId))
    })
  })
}
exports.updateScore = (player) => {
  return new Promise ((resolve, reject)=>{
    const sql = 'UPDATE users SET score = ? WHERE id=?';
    db.run(sql,[player.score, player.id], function (err) {
      if(err){
        reject(err);
        return;
      }
      resolve(exports.getPlayerById(player.id))
    })
  })
}
exports.addReply = (reply) => {
  return new Promise ((resolve, reject)=>{
    const sql = 'INSERT INTO replies (riddleId, author, reply) VALUES (?,?,?)';
    db.run(sql,[reply.riddleId, reply.author, reply.reply], function (err) {
      if(err){
        reject(err);
        return;
      }
      resolve(exports.getRiddleById(reply.riddleId))
    })
  })
}
/**
 * This function adds a new film in the database.
 * The film id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createRiddle = (riddle) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO riddles (text, difficulty, maxDuration, answer, hint1, hint2, isClosed, author) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [riddle.text, riddle.difficulty, riddle.maxDuration, riddle.answer, riddle.hint1, riddle.hint2, riddle.isClosed, riddle.author], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(exports.getRiddleById(riddle.riddleId));
      });
    });
};
    
// This function deletes an existing riddle given its id.
exports.deleteRiddle = (user, id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM films WHERE id = ? and user = ?';
      db.run(sql, [id, user], (err) => {
        if (err) {
          reject(err);
          return;
        } else
          resolve(null);
      });
    });
}

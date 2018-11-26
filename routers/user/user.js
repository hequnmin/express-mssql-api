
import express from 'express';
import sql from 'mssql';
import db from '../../configs/db';
import { randomString } from '../../utils/cryptoUtils';
import '../../utils/dateUtils';

const router = express.Router();

router.get('/', (req, res) => {
  sql.connect(db).then(() => {

    const request = new sql.Request();
    request.query("select * from [User]").then((result) => {
      sql.close();
      res.json(result.recordset);
    }).catch((err) => {
      sql.close();
      res.send(err);
    });

  }).catch((err) => {
    res.send(err);
  })
});

router.get('/:objectId', (req, res) => {
  const objectId = req.params.objectId;
  sql.connect(db).then(() => {
    const request = new sql.Request();
    request
      .input('objectId', sql.VarChar(20), objectId)
      .query("select * from [User] where objectId = @objectId;").then((result) => {
        sql.close();
        if (result.recordset.length <=0) {
          res.json({});
        } else {
          res.json(result.recordset[0]);
        }
    }).catch((err) => {
      sql.close();
      res.send(err);
    });
  }).catch((err) => {
      res.send(err);
  });
});

router.post('/', (req, res) => {
  const user = req.body;
  sql.connect(db).then(() => {
    const createAt = new Date();
    const request = new sql.Request();
    request
      .input('objectId', sql.VarChar(20), randomString(10))
      .input('username', sql.VarChar(50), user.username)
      .input('email', sql.VarChar(50), user.email)
      .input('password', sql.VarChar(50), user.password)
      .input('createAt', sql.DateTime, createAt)
      .query("insert into [User] (objectId, username, email, password, createAt) values (@objectId, @username, @email, @password, @createAt)").then((result) => {
      sql.close();
      res.send(createAt.Format('yyyy-MM-dd hh:mm:ss.S'));
    }).catch((err) => {
      res.send(err);
    });
  });
});

router.delete('/:objectId', (req, res) => {
  const objectId = req.params.objectId;
  sql.connect(db)
    .then(() => {
      const deleteAt = new Date();
      const request = new sql.Request();
      request
        .input('objectId', sql.VarChar(20), objectId)
        .query("delete from [User] where objectId = @objectId")
          .then((result) => {
            sql.close();
            res.send(deleteAt.Format('yyyy-MM-dd hh:mm:ss.S'));
          })
          .catch((err) => {
            sql.close();
            res.send(err);
          });
    })
    .catch((err) => {
      res.send(err);
    })

});

router.put('/:objectId', (req, res) => {
  const objectId = req.params.objectId;
  const user = req.body;
  sql.connect(db).then(() => {
    const updateAt = new Date();
    const request = new sql.Request();
    request
      .input('objectId', sql.VarChar(20), objectId)
      .input('username', sql.VarChar(50), user.username)
      .input('email', sql.VarChar(50), user.email)
      .input('password', sql.VarChar(50), user.password)
      .input('updateAt', sql.DateTime, updateAt)
      .query("update [User] set username = @username, email = @email, password = @password where objectId = @objectId").then((result) => {
        sql.close();
        res.send(updateAt);
      }).catch((err) => {
        sql.close();
        res.send(err);
      });
  }).catch((err) => {
    res.send(err);
  })
});

export default router;

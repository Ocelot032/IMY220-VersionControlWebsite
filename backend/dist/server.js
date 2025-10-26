"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ==================== Core imports ====================
var express = require("express");
var path = require("path");
var session = require("express-session");
var cors = require("cors");
var multer = require("multer");
var fs = require("fs");
var _require = require("mongodb"),
  MongoClient = _require.MongoClient,
  ObjectId = _require.ObjectId;

// ==================== MongoDB setup ====================
var connectionString = "mongodb+srv://marker:mark123@imy220.0gytrcp.mongodb.net/?retryWrites=true&w=majority&appName=IMY220";
var client = new MongoClient(connectionString);
var db;
function connectDB() {
  return _connectDB.apply(this, arguments);
} // ==================== Query helper ====================
function _connectDB() {
  _connectDB = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
    var _t27;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.p = _context27.n) {
        case 0:
          if (!db) {
            _context27.n = 1;
            break;
          }
          return _context27.a(2, db);
        case 1:
          _context27.p = 1;
          _context27.n = 2;
          return client.connect();
        case 2:
          db = client.db("Zynthex");
          console.log("MongoDB Connected");
          _context27.n = 3;
          return db.collection("users").createIndex({
            username: 1
          }, {
            unique: true
          });
        case 3:
          _context27.n = 4;
          return db.collection("users").createIndex({
            email: 1
          }, {
            unique: true
          });
        case 4:
          _context27.n = 5;
          return db.collection("projects").createIndex({
            owner: 1
          });
        case 5:
          return _context27.a(2, db);
        case 6:
          _context27.p = 6;
          _t27 = _context27.v;
          console.error("MongoDB Connection error", _t27);
          throw _t27;
        case 7:
          return _context27.a(2);
      }
    }, _callee27, null, [[1, 6]]);
  }));
  return _connectDB.apply(this, arguments);
}
function queryDB(_x, _x2) {
  return _queryDB.apply(this, arguments);
} // ==================== Express app setup ====================
function _queryDB() {
  _queryDB = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(collectionName, operation) {
    var data,
      db,
      collection,
      _args28 = arguments,
      _t28;
    return _regenerator().w(function (_context28) {
      while (1) switch (_context28.n) {
        case 0:
          data = _args28.length > 2 && _args28[2] !== undefined ? _args28[2] : {};
          _context28.n = 1;
          return connectDB();
        case 1:
          db = _context28.v;
          collection = db.collection(collectionName);
          _t28 = operation;
          _context28.n = _t28 === "find" ? 2 : _t28 === "insertOne" ? 4 : _t28 === "updateOne" ? 6 : _t28 === "deleteOne" ? 8 : _t28 === "aggregate" ? 10 : 12;
          break;
        case 2:
          _context28.n = 3;
          return collection.find(data.query || {}, data.options || {}).toArray();
        case 3:
          return _context28.a(2, _context28.v);
        case 4:
          _context28.n = 5;
          return collection.insertOne(data.doc);
        case 5:
          return _context28.a(2, _context28.v);
        case 6:
          _context28.n = 7;
          return collection.updateOne(data.filter, data.update, data.options || {});
        case 7:
          return _context28.a(2, _context28.v);
        case 8:
          _context28.n = 9;
          return collection.deleteOne(data.filter);
        case 9:
          return _context28.a(2, _context28.v);
        case 10:
          _context28.n = 11;
          return collection.aggregate(data.pipeline || []).toArray();
        case 11:
          return _context28.a(2, _context28.v);
        case 12:
          throw new Error("Invalid operation");
        case 13:
          return _context28.a(2);
      }
    }, _callee28);
  }));
  return _queryDB.apply(this, arguments);
}
var app = express();
var PORT = 8080;

// Universal project root (works in backend/ and backend/dist/)
var projectRoot = path.resolve(__dirname, "..", "..");
// const projectRoot = __dirname.includes("backend")
//   ? path.resolve(__dirname, "..") // running from /backend
//   : path.resolve(__dirname);      // running from /dist

// Middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(session({
  secret: "IMY220ProjectFinal",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

// ==================== File uploads ====================
var uploadRoot = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, {
  recursive: true
});
if (!fs.existsSync(path.join(uploadRoot, "projects"))) fs.mkdirSync(path.join(uploadRoot, "projects"), {
  recursive: true
});
if (!fs.existsSync(path.join(uploadRoot, "profiles"))) fs.mkdirSync(path.join(uploadRoot, "profiles"), {
  recursive: true
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    if (file.fieldname === "profileImg") cb(null, path.join(uploadRoot, "profiles"));else cb(null, path.join(uploadRoot, "projects"));
  },
  filename: function filename(req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
app.locals.upload = upload;

// ==================== API ROUTES ====================
// -- keep all your CRUD routes exactly as they are here --
// Example stubs shown for reference:
app.post("/api/users/register", upload.single("profileImg"), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var user, result, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          user = req.body;
          user.profileImg = req.file ? req.file.filename : null;
          _context.n = 1;
          return queryDB("users", "insertOne", {
            doc: user
          });
        case 1:
          result = _context.v;
          res.json(result);
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          console.error("Register error:", _t);
          res.status(500).json({
            error: "Registration failed"
          });
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function (_x3, _x4) {
    return _ref.apply(this, arguments);
  };
}());
app.post("/api/users/login", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body, username, password, user, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          if (!(!username || !password)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(400).json({
            error: "Username and password required."
          }));
        case 1:
          _context2.n = 2;
          return queryDB("users", "find", {
            query: {
              username: username,
              password: password
            }
          });
        case 2:
          user = _context2.v;
          if (!(user.length === 0)) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(401).json({
            error: "Invalid credentials."
          }));
        case 3:
          req.session.user = {
            username: user[0].username,
            email: user[0].email,
            isAdmin: user[0].isAdmin
          };
          res.json({
            message: "Login successful",
            user: req.session.user
          });
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          console.error("Login error:", _t2);
          res.status(500).json({
            error: "Internal server error during login."
          });
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
app.post("/api/users/logout", function (req, res) {
  if (req.session.user) {
    req.session.destroy(function (err) {
      if (err) return res.status(500).json({
        error: "Logout failed."
      });
      res.clearCookie("connect.sid");
      res.json({
        message: "Logged out successfully."
      });
    });
  } else {
    res.status(400).json({
      error: "No active session."
    });
  }
});

//======== GET all users
app.get('/api/users/', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var users, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return queryDB('users', 'find');
        case 1:
          users = _context3.v;
          res.json(users);
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          res.status(500).json({
            error: 'Could not fetch users.'
          });
        case 3:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());

//======== GET single user by username
app.get('/api/users/:username', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var username, user, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          username = req.params.username;
          _context4.n = 1;
          return queryDB('users', 'find', {
            query: {
              username: username
            }
          });
        case 1:
          user = _context4.v;
          if (user.length) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, res.status(404).json({
            error: 'User not found.'
          }));
        case 2:
          res.json(user[0]);
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t4 = _context4.v;
          console.error('Get user error:', _t4);
          res.status(500).json({
            error: 'Internal server error.'
          });
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return function (_x9, _x0) {
    return _ref4.apply(this, arguments);
  };
}());

//======== EDIT profile (ecl username & email)
app.patch('/api/users/:username', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var username, updates, result, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          username = req.params.username;
          updates = req.body; //prevent username/email changes
          delete updates.username;
          delete updates.email;
          _context5.n = 1;
          return queryDB('users', 'updateOne', {
            filter: {
              username: username
            },
            update: {
              $set: updates
            }
          });
        case 1:
          result = _context5.v;
          if (!(result.matchedCount === 0)) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, res.status(404).json({
            error: 'User not found.'
          }));
        case 2:
          res.json({
            message: 'Profile updated successfully.'
          });
          _context5.n = 4;
          break;
        case 3:
          _context5.p = 3;
          _t5 = _context5.v;
          console.error('Profile update error:', _t5);
          res.status(500).json({
            error: 'Internal server error during profile update.'
          });
        case 4:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 3]]);
  }));
  return function (_x1, _x10) {
    return _ref5.apply(this, arguments);
  };
}());

//======== DELETE user
app["delete"]('/api/users/:username', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var username, result, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          username = req.params.username;
          _context6.n = 1;
          return queryDB('users', 'deleteOne', {
            filter: {
              username: username
            }
          });
        case 1:
          result = _context6.v;
          if (!(result.deletedCount === 0)) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2, res.status(404).json({
            error: 'User not found.'
          }));
        case 2:
          res.json({
            message: 'User deleted successfully.'
          });
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t6 = _context6.v;
          console.error('Delete user error:', _t6);
          res.status(500).json({
            error: 'Internal server error during deletion.'
          });
        case 4:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 3]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());

//======== UPLOAD profile img
app.post('/api/users/:username/upload', function (req, res, next) {
  var multer = require('multer');
  var upload = multer({
    storage: multer.diskStorage({
      destination: function destination(req, file, cb) {
        return cb(null, 'uploads/profiles');
      },
      filename: function filename(req, file, cb) {
        return cb(null, Date.now() + '-' + file.originalname);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }).single('profileImg');
  upload(req, res, /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(err) {
      var username, fileName, _t7;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            if (!err) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2, res.status(400).json({
              error: 'File upload failed.'
            }));
          case 1:
            _context7.p = 1;
            username = req.params.username;
            fileName = req.file.filename;
            _context7.n = 2;
            return queryDB('users', 'updateOne', {
              filter: {
                username: username
              },
              update: {
                $set: {
                  profileImg: fileName
                }
              }
            });
          case 2:
            res.json({
              message: 'Profile image uploaded.',
              file: fileName
            });
            _context7.n = 4;
            break;
          case 3:
            _context7.p = 3;
            _t7 = _context7.v;
            console.error('Upload error:', _t7);
            res.status(500).json({
              error: 'Error saving profile image.'
            });
          case 4:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 3]]);
    }));
    return function (_x13) {
      return _ref7.apply(this, arguments);
    };
  }());
});

// ====== PROJECTS

// ======== GET all projects
app.get('/api/project/', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var projects, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return queryDB('projects', 'find');
        case 1:
          projects = _context8.v;
          res.json(projects);
          _context8.n = 3;
          break;
        case 2:
          _context8.p = 2;
          _t8 = _context8.v;
          console.error('Fetch projects error:', _t8);
          res.status(500).json({
            error: 'Failed to fetch projects.'
          });
        case 3:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return function (_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}());

// ======== GET single project by id
app.get('/api/project/:id', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var id, project, _t9;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          id = new ObjectId(req.params.id);
          _context9.n = 1;
          return queryDB('projects', 'find', {
            query: {
              _id: id
            }
          });
        case 1:
          project = _context9.v;
          if (project.length) {
            _context9.n = 2;
            break;
          }
          return _context9.a(2, res.status(404).json({
            error: 'Project not found.'
          }));
        case 2:
          res.json(project[0]);
          _context9.n = 4;
          break;
        case 3:
          _context9.p = 3;
          _t9 = _context9.v;
          console.error('Fetch project error:', _t9);
          res.status(500).json({
            error: 'Failed to fetch project.'
          });
        case 4:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 3]]);
  }));
  return function (_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}());

// ======== CREATE Project
app.post('/api/project/', /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var _req$body2, name, description, owner, members, type, hashtags, userExists, projectDoc, result, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          _req$body2 = req.body, name = _req$body2.name, description = _req$body2.description, owner = _req$body2.owner, members = _req$body2.members, type = _req$body2.type, hashtags = _req$body2.hashtags;
          if (!(!name || !owner)) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2, res.status(400).json({
            error: 'Name and owner are required.'
          }));
        case 1:
          _context0.n = 2;
          return queryDB('users', 'find', {
            query: {
              username: owner
            }
          });
        case 2:
          userExists = _context0.v;
          if (userExists.length) {
            _context0.n = 3;
            break;
          }
          return _context0.a(2, res.status(400).json({
            error: 'Owner does not exist.'
          }));
        case 3:
          projectDoc = {
            name: name,
            description: description || '',
            owner: owner,
            members: members || [],
            type: type || 'unspecified',
            hashtags: hashtags || [],
            image: '',
            status: 'checkedIn',
            version: 1,
            checkedOutBy: '',
            files: [],
            createdAt: new Date()
          };
          _context0.n = 4;
          return queryDB('projects', 'insertOne', {
            doc: projectDoc
          });
        case 4:
          result = _context0.v;
          res.status(201).json({
            message: 'Project created successfully',
            result: result
          });
          _context0.n = 6;
          break;
        case 5:
          _context0.p = 5;
          _t0 = _context0.v;
          console.error('Create project error:', _t0);
          res.status(500).json({
            error: 'Internal server error during project creation.'
          });
        case 6:
          return _context0.a(2);
      }
    }, _callee0, null, [[0, 5]]);
  }));
  return function (_x18, _x19) {
    return _ref0.apply(this, arguments);
  };
}());

// ======== UPLOAD project name
app.post('/api/project/:id/image', upload.single('projectImage'), /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
    var id, _t1;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          console.log('Uploading image for project', req.params.id, req.file);
          _context1.p = 1;
          id = new ObjectId(req.params.id);
          if (req.file) {
            _context1.n = 2;
            break;
          }
          return _context1.a(2, res.status(400).json({
            error: 'No image uploaded.'
          }));
        case 2:
          _context1.n = 3;
          return queryDB('projects', 'updateOne', {
            filter: {
              _id: id
            },
            update: {
              $set: {
                image: req.file.filename
              }
            }
          });
        case 3:
          res.json({
            message: 'Project image uploaded.',
            file: req.file.filename
          });
          _context1.n = 5;
          break;
        case 4:
          _context1.p = 4;
          _t1 = _context1.v;
          console.error('Image upload error:', _t1);
          res.status(500).json({
            error: 'Failed to upload project image.'
          });
        case 5:
          return _context1.a(2);
      }
    }, _callee1, null, [[1, 4]]);
  }));
  return function (_x20, _x21) {
    return _ref1.apply(this, arguments);
  };
}());

// ======== ADD file to project
app.post('/api/project/:id/files', upload.single('file'), /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var id, fileInfo, _t10;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          id = new ObjectId(req.params.id);
          if (req.file) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2, res.status(400).json({
            error: 'No file uploaded.'
          }));
        case 1:
          fileInfo = {
            fileName: req.file.originalname,
            fileUrl: req.file.filename,
            uploadedAt: new Date()
          };
          _context10.n = 2;
          return queryDB('projects', 'updateOne', {
            filter: {
              _id: id
            },
            update: {
              $push: {
                files: fileInfo
              }
            }
          });
        case 2:
          res.json({
            message: 'File uploaded.',
            file: fileInfo
          });
          _context10.n = 4;
          break;
        case 3:
          _context10.p = 3;
          _t10 = _context10.v;
          console.error('File upload error:', _t10);
          res.status(500).json({
            error: 'Failed to upload file.'
          });
        case 4:
          return _context10.a(2);
      }
    }, _callee10, null, [[0, 3]]);
  }));
  return function (_x22, _x23) {
    return _ref10.apply(this, arguments);
  };
}());

// ======== DELETE file from project
app["delete"]('/api/project/:id/files/:fileName', /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
    var id, fileName, result, _t11;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          _context11.p = 0;
          id = new ObjectId(req.params.id);
          fileName = req.params.fileName;
          _context11.n = 1;
          return queryDB('projects', 'updateOne', {
            filter: {
              _id: id
            },
            update: {
              $pull: {
                files: {
                  fileName: fileName
                }
              }
            }
          });
        case 1:
          result = _context11.v;
          if (!(result.matchedCount === 0)) {
            _context11.n = 2;
            break;
          }
          return _context11.a(2, res.status(404).json({
            error: 'Project not found.'
          }));
        case 2:
          res.json({
            message: 'File removed successfully.'
          });
          _context11.n = 4;
          break;
        case 3:
          _context11.p = 3;
          _t11 = _context11.v;
          console.error('File deletion error:', _t11);
          res.status(500).json({
            error: 'Failed to delete file.'
          });
        case 4:
          return _context11.a(2);
      }
    }, _callee11, null, [[0, 3]]);
  }));
  return function (_x24, _x25) {
    return _ref11.apply(this, arguments);
  };
}());

// ======== CHECK OUT project
app.patch('/api/project/:id/checkout', /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
    var id, username, project, _t12;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 0;
          id = new ObjectId(req.params.id);
          username = req.body.username;
          _context12.n = 1;
          return queryDB('projects', 'find', {
            query: {
              _id: id
            }
          });
        case 1:
          project = _context12.v;
          if (project.length) {
            _context12.n = 2;
            break;
          }
          return _context12.a(2, res.status(404).json({
            error: 'Project not found.'
          }));
        case 2:
          if (!(project[0].status === 'checkedOut')) {
            _context12.n = 3;
            break;
          }
          return _context12.a(2, res.status(400).json({
            error: 'Project already checked out.'
          }));
        case 3:
          _context12.n = 4;
          return queryDB('projects', 'updateOne', {
            filter: {
              _id: id
            },
            update: {
              $set: {
                status: 'checkedOut',
                checkedOutBy: username
              }
            }
          });
        case 4:
          res.json({
            message: "Project checked out by ".concat(username, ".")
          });
          _context12.n = 6;
          break;
        case 5:
          _context12.p = 5;
          _t12 = _context12.v;
          console.error('Checkout error:', _t12);
          res.status(500).json({
            error: 'Failed to check out project.'
          });
        case 6:
          return _context12.a(2);
      }
    }, _callee12, null, [[0, 5]]);
  }));
  return function (_x26, _x27) {
    return _ref12.apply(this, arguments);
  };
}());

// ======== CHECK IN project
app.patch('/api/project/:id/checkin', /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(req, res) {
    var id, _req$body3, username, message, project, newVersion, checkinDoc, _t13;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          _context13.p = 0;
          id = new ObjectId(req.params.id);
          _req$body3 = req.body, username = _req$body3.username, message = _req$body3.message;
          _context13.n = 1;
          return queryDB('projects', 'find', {
            query: {
              _id: id
            }
          });
        case 1:
          project = _context13.v;
          if (project.length) {
            _context13.n = 2;
            break;
          }
          return _context13.a(2, res.status(404).json({
            error: 'Project not found.'
          }));
        case 2:
          if (!(project[0].checkedOutBy !== username)) {
            _context13.n = 3;
            break;
          }
          return _context13.a(2, res.status(400).json({
            error: 'You did not check out this project.'
          }));
        case 3:
          newVersion = project[0].version + 1;
          _context13.n = 4;
          return queryDB('projects', 'updateOne', {
            filter: {
              _id: id
            },
            update: {
              $set: {
                status: 'checkedIn',
                checkedOutBy: '',
                version: newVersion
              }
            }
          });
        case 4:
          //log checkin to separate collection
          checkinDoc = {
            projectId: id,
            username: username,
            message: message || '',
            version: newVersion,
            timestamp: new Date()
          };
          _context13.n = 5;
          return queryDB('checkins', 'insertOne', {
            doc: checkinDoc
          });
        case 5:
          res.json({
            message: 'Project checked in successfully.',
            version: newVersion
          });
          _context13.n = 7;
          break;
        case 6:
          _context13.p = 6;
          _t13 = _context13.v;
          console.error('Checkin error:', _t13);
          res.status(500).json({
            error: 'Failed to check in project.'
          });
        case 7:
          return _context13.a(2);
      }
    }, _callee13, null, [[0, 6]]);
  }));
  return function (_x28, _x29) {
    return _ref13.apply(this, arguments);
  };
}());

// ======== UPDATE project details
app.patch('/api/project/:id', /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(req, res) {
    var id, updates, result, _t14;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          _context14.p = 0;
          id = new ObjectId(req.params.id);
          updates = req.body; // don’t allow owner changes 
          delete updates.owner;
          _context14.n = 1;
          return queryDB('projects', 'updateOne', {
            filter: {
              _id: id
            },
            update: {
              $set: updates
            }
          });
        case 1:
          result = _context14.v;
          if (!(result.matchedCount === 0)) {
            _context14.n = 2;
            break;
          }
          return _context14.a(2, res.status(404).json({
            error: 'Project not found.'
          }));
        case 2:
          res.json({
            message: 'Project updated successfully.'
          });
          _context14.n = 4;
          break;
        case 3:
          _context14.p = 3;
          _t14 = _context14.v;
          console.error('Update project error:', _t14);
          res.status(500).json({
            error: 'Failed to update project.'
          });
        case 4:
          return _context14.a(2);
      }
    }, _callee14, null, [[0, 3]]);
  }));
  return function (_x30, _x31) {
    return _ref14.apply(this, arguments);
  };
}());

// ======== DELETE project
app["delete"]('/api/project/:id', /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(req, res) {
    var id, result, _t15;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          _context15.p = 0;
          id = new ObjectId(req.params.id);
          _context15.n = 1;
          return queryDB('projects', 'deleteOne', {
            filter: {
              _id: id
            }
          });
        case 1:
          result = _context15.v;
          if (!(result.deletedCount === 0)) {
            _context15.n = 2;
            break;
          }
          return _context15.a(2, res.status(404).json({
            error: 'Project not found.'
          }));
        case 2:
          _context15.n = 3;
          return queryDB('checkins', 'deleteOne', {
            filter: {
              projectId: id
            }
          });
        case 3:
          res.json({
            message: 'Project deleted successfully.'
          });
          _context15.n = 5;
          break;
        case 4:
          _context15.p = 4;
          _t15 = _context15.v;
          console.error('Delete project error:', _t15);
          res.status(500).json({
            error: 'Failed to delete project.'
          });
        case 5:
          return _context15.a(2);
      }
    }, _callee15, null, [[0, 4]]);
  }));
  return function (_x32, _x33) {
    return _ref15.apply(this, arguments);
  };
}());

// ====== FRIENDS

// ======== SEND friend req
// body: { requester: "username1", receiver: "username2" }
app.post('/api/friends/request', /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(req, res) {
    var _req$body4, requester, receiver, users, existing, friendDoc, result, _t16;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          _context16.p = 0;
          _req$body4 = req.body, requester = _req$body4.requester, receiver = _req$body4.receiver;
          if (!(!requester || !receiver)) {
            _context16.n = 1;
            break;
          }
          return _context16.a(2, res.status(400).json({
            error: 'Requester and receiver required.'
          }));
        case 1:
          if (!(requester === receiver)) {
            _context16.n = 2;
            break;
          }
          return _context16.a(2, res.status(400).json({
            error: 'You cannot friend yourself.'
          }));
        case 2:
          _context16.n = 3;
          return queryDB('users', 'find', {
            query: {
              username: {
                $in: [requester, receiver]
              }
            }
          });
        case 3:
          users = _context16.v;
          if (!(users.length < 2)) {
            _context16.n = 4;
            break;
          }
          return _context16.a(2, res.status(404).json({
            error: 'One or both users not found.'
          }));
        case 4:
          _context16.n = 5;
          return queryDB('friends', 'find', {
            query: {
              $or: [{
                requester: requester,
                receiver: receiver
              }, {
                requester: receiver,
                receiver: requester
              }]
            }
          });
        case 5:
          existing = _context16.v;
          if (!(existing.length > 0)) {
            _context16.n = 6;
            break;
          }
          return _context16.a(2, res.status(400).json({
            error: 'Friend request already exists or users are already friends.'
          }));
        case 6:
          friendDoc = {
            requester: requester,
            receiver: receiver,
            status: 'pending',
            createdAt: new Date()
          };
          _context16.n = 7;
          return queryDB('friends', 'insertOne', {
            doc: friendDoc
          });
        case 7:
          result = _context16.v;
          res.status(201).json({
            message: 'Friend request sent.',
            result: result
          });
          _context16.n = 9;
          break;
        case 8:
          _context16.p = 8;
          _t16 = _context16.v;
          console.error('Friend request error:', _t16);
          res.status(500).json({
            error: 'Internal server error during friend request.'
          });
        case 9:
          return _context16.a(2);
      }
    }, _callee16, null, [[0, 8]]);
  }));
  return function (_x34, _x35) {
    return _ref16.apply(this, arguments);
  };
}());

// ======== ACCEPT friend req
// body: { receiver: "username2" }
app.patch('/api/friends/:id/accept', /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(req, res) {
    var id, result, request, _request$, requester, receiver, _t17;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          _context17.p = 0;
          id = req.params.id;
          _context17.n = 1;
          return queryDB('friends', 'updateOne', {
            filter: {
              _id: new ObjectId(id)
            },
            update: {
              $set: {
                status: 'accepted'
              }
            }
          });
        case 1:
          result = _context17.v;
          if (!(result.matchedCount === 0)) {
            _context17.n = 2;
            break;
          }
          return _context17.a(2, res.status(404).json({
            error: 'Friend request not found.'
          }));
        case 2:
          _context17.n = 3;
          return queryDB('friends', 'find', {
            query: {
              _id: new ObjectId(id)
            }
          });
        case 3:
          request = _context17.v;
          _request$ = request[0], requester = _request$.requester, receiver = _request$.receiver;
          _context17.n = 4;
          return queryDB('users', 'updateOne', {
            filter: {
              username: requester
            },
            update: {
              $push: {
                friends: receiver
              }
            }
          });
        case 4:
          _context17.n = 5;
          return queryDB('users', 'updateOne', {
            filter: {
              username: receiver
            },
            update: {
              $push: {
                friends: requester
              }
            }
          });
        case 5:
          res.json({
            message: 'Friend request accepted.'
          });
          _context17.n = 7;
          break;
        case 6:
          _context17.p = 6;
          _t17 = _context17.v;
          console.error('Accept friend error:', _t17);
          res.status(500).json({
            error: 'Internal server error during accept.'
          });
        case 7:
          return _context17.a(2);
      }
    }, _callee17, null, [[0, 6]]);
  }));
  return function (_x36, _x37) {
    return _ref17.apply(this, arguments);
  };
}());

// ======== DECLINE friend req
app.patch('/api/friends/:id/decline', /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(req, res) {
    var id, result, _t18;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          _context18.p = 0;
          id = req.params.id;
          _context18.n = 1;
          return queryDB('friends', 'updateOne', {
            filter: {
              _id: new ObjectId(id)
            },
            update: {
              $set: {
                status: 'declined'
              }
            }
          });
        case 1:
          result = _context18.v;
          if (!(result.matchedCount === 0)) {
            _context18.n = 2;
            break;
          }
          return _context18.a(2, res.status(404).json({
            error: 'Friend request not found.'
          }));
        case 2:
          res.json({
            message: 'Friend request declined.'
          });
          _context18.n = 4;
          break;
        case 3:
          _context18.p = 3;
          _t18 = _context18.v;
          console.error('Decline friend error:', _t18);
          res.status(500).json({
            error: 'Internal server error during decline.'
          });
        case 4:
          return _context18.a(2);
      }
    }, _callee18, null, [[0, 3]]);
  }));
  return function (_x38, _x39) {
    return _ref18.apply(this, arguments);
  };
}());

// ======== UNFRIEND 
// body: { username1: "A", username2: "B" }
app["delete"]('/api/friends/unfriend', /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(req, res) {
    var _req$body5, username1, username2, existing, result, _t19;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          _context19.p = 0;
          _req$body5 = req.body, username1 = _req$body5.username1, username2 = _req$body5.username2;
          if (!(!username1 || !username2)) {
            _context19.n = 1;
            break;
          }
          return _context19.a(2, res.status(400).json({
            error: 'Both usernames required.'
          }));
        case 1:
          _context19.n = 2;
          return queryDB('friends', 'find', {
            query: {
              $or: [{
                requester: username1,
                receiver: username2
              }, {
                requester: username2,
                receiver: username1
              }],
              status: 'accepted'
            }
          });
        case 2:
          existing = _context19.v;
          if (!(existing.length === 0)) {
            _context19.n = 3;
            break;
          }
          return _context19.a(2, res.status(404).json({
            error: 'No existing friendship found.'
          }));
        case 3:
          _context19.n = 4;
          return queryDB('friends', 'deleteOne', {
            filter: {
              $or: [{
                requester: username1,
                receiver: username2
              }, {
                requester: username2,
                receiver: username1
              }]
            }
          });
        case 4:
          result = _context19.v;
          _context19.n = 5;
          return queryDB('users', 'updateOne', {
            filter: {
              username: username1
            },
            update: {
              $pull: {
                friends: username2
              }
            }
          });
        case 5:
          _context19.n = 6;
          return queryDB('users', 'updateOne', {
            filter: {
              username: username2
            },
            update: {
              $pull: {
                friends: username1
              }
            }
          });
        case 6:
          res.json({
            message: 'Users unfriended successfully.'
          });
          _context19.n = 8;
          break;
        case 7:
          _context19.p = 7;
          _t19 = _context19.v;
          console.error('Unfriend error:', _t19);
          res.status(500).json({
            error: 'Internal server error during unfriend.'
          });
        case 8:
          return _context19.a(2);
      }
    }, _callee19, null, [[0, 7]]);
  }));
  return function (_x40, _x41) {
    return _ref19.apply(this, arguments);
  };
}());

// ======== GET all friends of user
app.get('/api/friends/:username', /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(req, res) {
    var username, accepted, friendUsernames, _t20;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          _context20.p = 0;
          username = req.params.username;
          _context20.n = 1;
          return queryDB('friends', 'find', {
            query: {
              $or: [{
                requester: username
              }, {
                receiver: username
              }],
              status: 'accepted'
            }
          });
        case 1:
          accepted = _context20.v;
          friendUsernames = accepted.map(function (f) {
            return f.requester === username ? f.receiver : f.requester;
          });
          res.json({
            friends: friendUsernames
          });
          _context20.n = 3;
          break;
        case 2:
          _context20.p = 2;
          _t20 = _context20.v;
          console.error('Get friends error:', _t20);
          res.status(500).json({
            error: 'Internal server error fetching friends.'
          });
        case 3:
          return _context20.a(2);
      }
    }, _callee20, null, [[0, 2]]);
  }));
  return function (_x42, _x43) {
    return _ref20.apply(this, arguments);
  };
}());

// ======== GET pending reqs
app.get('/api/friends/:username/pending', /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(req, res) {
    var username, pending, _t21;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.p = _context21.n) {
        case 0:
          _context21.p = 0;
          username = req.params.username;
          _context21.n = 1;
          return queryDB('friends', 'find', {
            query: {
              receiver: username,
              status: 'pending'
            }
          });
        case 1:
          pending = _context21.v;
          res.json({
            pending: pending
          });
          _context21.n = 3;
          break;
        case 2:
          _context21.p = 2;
          _t21 = _context21.v;
          console.error('Get pending error:', _t21);
          res.status(500).json({
            error: 'Internal server error fetching pending requests.'
          });
        case 3:
          return _context21.a(2);
      }
    }, _callee21, null, [[0, 2]]);
  }));
  return function (_x44, _x45) {
    return _ref21.apply(this, arguments);
  };
}());

// ====== CHECKINS

// ======== GET all checkins
app.get('/api/checkins/', /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(req, res) {
    var checkins, _t22;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          _context22.p = 0;
          _context22.n = 1;
          return queryDB('checkins', 'find', {
            query: {},
            options: {
              sort: {
                timestamp: -1
              }
            }
          });
        case 1:
          checkins = _context22.v;
          res.json(checkins);
          _context22.n = 3;
          break;
        case 2:
          _context22.p = 2;
          _t22 = _context22.v;
          console.error('Fetch checkins error:', _t22);
          res.status(500).json({
            error: 'Failed to fetch check-ins.'
          });
        case 3:
          return _context22.a(2);
      }
    }, _callee22, null, [[0, 2]]);
  }));
  return function (_x46, _x47) {
    return _ref22.apply(this, arguments);
  };
}());

// ======== GET checkins by project
app.get('/api/checkins/project/:projectId', /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(req, res) {
    var projectId, checkins, _t23;
    return _regenerator().w(function (_context23) {
      while (1) switch (_context23.p = _context23.n) {
        case 0:
          _context23.p = 0;
          projectId = req.params.projectId;
          if (ObjectId.isValid(projectId)) {
            _context23.n = 1;
            break;
          }
          return _context23.a(2, res.status(400).json({
            error: 'Invalid project ID format.'
          }));
        case 1:
          _context23.n = 2;
          return queryDB('checkins', 'find', {
            query: {
              projectId: new ObjectId(projectId)
            },
            options: {
              sort: {
                timestamp: -1
              }
            }
          });
        case 2:
          checkins = _context23.v;
          if (checkins.length) {
            _context23.n = 3;
            break;
          }
          return _context23.a(2, res.status(404).json({
            error: 'No check-ins found for this project.'
          }));
        case 3:
          res.json(checkins);
          _context23.n = 5;
          break;
        case 4:
          _context23.p = 4;
          _t23 = _context23.v;
          console.error('Fetch project checkins error:', _t23);
          res.status(500).json({
            error: 'Failed to fetch project check-ins.'
          });
        case 5:
          return _context23.a(2);
      }
    }, _callee23, null, [[0, 4]]);
  }));
  return function (_x48, _x49) {
    return _ref23.apply(this, arguments);
  };
}());

// ======== GET checkins by user
app.get('/api/checkins/user/:username', /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24(req, res) {
    var username, checkins, _t24;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.p = _context24.n) {
        case 0:
          _context24.p = 0;
          username = req.params.username;
          _context24.n = 1;
          return queryDB('checkins', 'find', {
            query: {
              username: username
            },
            options: {
              sort: {
                timestamp: -1
              }
            }
          });
        case 1:
          checkins = _context24.v;
          if (checkins.length) {
            _context24.n = 2;
            break;
          }
          return _context24.a(2, res.status(404).json({
            error: 'No check-ins found for this user.'
          }));
        case 2:
          res.json(checkins);
          _context24.n = 4;
          break;
        case 3:
          _context24.p = 3;
          _t24 = _context24.v;
          console.error('Fetch user checkins error:', _t24);
          res.status(500).json({
            error: 'Failed to fetch user check-ins.'
          });
        case 4:
          return _context24.a(2);
      }
    }, _callee24, null, [[0, 3]]);
  }));
  return function (_x50, _x51) {
    return _ref24.apply(this, arguments);
  };
}());

// ======== ADD new chicken
// This will usually be triggered automatically by the project check-in route
// but we include it here for testing or manual use
app.post('/api/checkins/', /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(req, res) {
    var _req$body6, projectId, username, message, version, checkinDoc, result, _t25;
    return _regenerator().w(function (_context25) {
      while (1) switch (_context25.p = _context25.n) {
        case 0:
          _context25.p = 0;
          _req$body6 = req.body, projectId = _req$body6.projectId, username = _req$body6.username, message = _req$body6.message, version = _req$body6.version;
          if (!(!projectId || !username)) {
            _context25.n = 1;
            break;
          }
          return _context25.a(2, res.status(400).json({
            error: 'projectId and username required.'
          }));
        case 1:
          if (ObjectId.isValid(projectId)) {
            _context25.n = 2;
            break;
          }
          return _context25.a(2, res.status(400).json({
            error: 'Invalid project ID format.'
          }));
        case 2:
          checkinDoc = {
            projectId: new ObjectId(projectId),
            username: username,
            message: message || '',
            version: version || 1,
            timestamp: new Date()
          };
          _context25.n = 3;
          return queryDB('checkins', 'insertOne', {
            doc: checkinDoc
          });
        case 3:
          result = _context25.v;
          res.status(201).json({
            message: 'Check-in logged successfully.',
            result: result
          });
          _context25.n = 5;
          break;
        case 4:
          _context25.p = 4;
          _t25 = _context25.v;
          console.error('Add checkin error:', _t25);
          res.status(500).json({
            error: 'Failed to log check-in.'
          });
        case 5:
          return _context25.a(2);
      }
    }, _callee25, null, [[0, 4]]);
  }));
  return function (_x52, _x53) {
    return _ref25.apply(this, arguments);
  };
}());

// ======== DELETE chicken
app["delete"]('/api/checkins/:id', /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(req, res) {
    var id, result, _t26;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.p = _context26.n) {
        case 0:
          _context26.p = 0;
          id = req.params.id;
          if (ObjectId.isValid(id)) {
            _context26.n = 1;
            break;
          }
          return _context26.a(2, res.status(400).json({
            error: 'Invalid check-in ID format.'
          }));
        case 1:
          _context26.n = 2;
          return queryDB('checkins', 'deleteOne', {
            filter: {
              _id: new ObjectId(id)
            }
          });
        case 2:
          result = _context26.v;
          if (!(result.deletedCount === 0)) {
            _context26.n = 3;
            break;
          }
          return _context26.a(2, res.status(404).json({
            error: 'Check-in not found.'
          }));
        case 3:
          res.json({
            message: 'Check-in deleted successfully.'
          });
          _context26.n = 5;
          break;
        case 4:
          _context26.p = 4;
          _t26 = _context26.v;
          console.error('Delete checkin error:', _t26);
          res.status(500).json({
            error: 'Failed to delete check-in.'
          });
        case 5:
          return _context26.a(2);
      }
    }, _callee26, null, [[0, 4]]);
  }));
  return function (_x54, _x55) {
    return _ref26.apply(this, arguments);
  };
}());

// Quick sanity route
app.get("/api", function (req, res) {
  return res.json({
    message: "API working successfully"
  });
});

// ==================== Frontend serving ====================
// Serve the built or public React files regardless of build mode
app.use(express["static"](path.join(projectRoot, "frontend", "public")));

// Let React Router handle non-API routes
app.get(/^\/(?!api).*/, function (req, res) {
  res.sendFile(path.join(projectRoot, "frontend", "public", "index.html"));
});

// ==================== Error handling ====================
app.use(function (err, req, res, next) {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Something went wrong on the server."
  });
});

// ==================== Start server ====================
connectDB().then(function () {
  app.listen(PORT, function () {
    return console.log("Server running at http://localhost:".concat(PORT));
  });
})["catch"](function (err) {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});